#import "EspTouch.h"

@implementation EspTouch

bool running = false;

-(id) init {
    self = [super init];
    self.lock = [[NSCondition alloc]init];
    return self;
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(startProvisioning,
                 ssid:(nonnull NSString*)ssid bssid:(nonnull NSString*)bssid password:(NSString *)password count:(int)count
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    NSLog(@"%d", count);
    [self.lock lock];
    if (running) {
        return;
    }
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_async(queue, ^{
        self.task = [[ESPTouchTask alloc] initWithApSsid:ssid andApBssid:bssid andApPwd:password];
        [self.task setEsptouchDelegate:self]; // Set result callback
        [self.task setPackageBroadcast:YES]; // if YES send broadcast packets, else send multicast packets

        running = true;
        NSArray* results = [self.task executeForResults:count];
        running = false;

        dispatch_async(dispatch_get_main_queue(), ^{
            ESPTouchResult *firstResult = [results objectAtIndex:0];
            if (firstResult != nil && [firstResult isSuc]) {
                NSDictionary *res = @{
                    @"success": @true,
                    @"bassid": firstResult.bssid
                };
                resolve(res);
            } else {
                reject(@"error", @"failed to provision devices", nil);
            }
        });
    });
    [self.lock unlock];
}

RCT_REMAP_METHOD(stopProvisioning,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    [self.lock lock];
    if (self.task != nil) {
        NSLog(@"interrupting");
        [self.task interrupt];
        running = false;
    }
    [self.lock unlock];
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
