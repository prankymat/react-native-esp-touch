#import "EspTouch.h"

@implementation EspTouch

ESPTouchTask *task;
bool running;

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(startProvisioning,
                 ssid:(nonnull NSString*)ssid bssid:(nonnull NSString*)bssid password:(NSString *)password count:(int)count
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    if (running) {
        return;
    }
    running = true;
    dispatch_queue_t  queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_async(queue, ^{
        task = [[ESPTouchTask alloc] initWithApSsid:ssid andApBssid:bssid andApPwd:password];
        [task setEsptouchDelegate:self]; // Set result callback
        [task setPackageBroadcast:YES]; // if YES send broadcast packets, else send multicast packets
        
        NSArray* results = [task executeForResults:count];

        dispatch_async(dispatch_get_main_queue(), ^{
            ESPTouchResult *firstResult = [results objectAtIndex:0];
            if ([firstResult isSuc]) {
                NSDictionary *res = @{
                    @"success": true,
                    @"bassid": firstResult.bssid
                };
                resolve(res);
            } else {
                reject(@"failed to provision devices");
            }
            
            running = false;
        });
    });
}

RCT_REMAP_METHOD(stopProvisioning,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    if (task) {
        NSLog(@"interrupting");
        [task interrupt];
        running = false;
    }
}

-(void) onEsptouchResultAddedWithResult: (ESPTouchResult *) result {
//    NSLog(@"welp %p", _resolveBlock);
//    if (_resolveBlock) {
//        _resolveBlock(@{
//            @"test": @"value"
//        });
//    }
}

@end
