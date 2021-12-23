#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "ESPTouch/esptouch/ESPTouchDelegate.h"
#import "ESPTouch/esptouch/ESPTouchTask.h"

@interface EspTouch : RCTEventEmitter <RCTBridgeModule, ESPTouchDelegate>

@property (atomic, strong) ESPTouchTask *task;

@end
