#import <React/RCTBridgeModule.h>
#import "ESPTouch/esptouch/ESPTouchDelegate.h"
#import "ESPTouch/esptouch/ESPTouchTask.h"

@interface EspTouch : NSObject <RCTBridgeModule, ESPTouchDelegate>

@property (atomic, strong) ESPTouchTask *task;
@property (atomic, strong) NSCondition *lock;

@end
