#import <React/RCTBridgeModule.h>
#import "ESPTouch/esptouch/ESPTouchDelegate.h"
#import "ESPTouch/esptouch/ESPTouchTask.h"

@interface EspTouch : NSObject <RCTBridgeModule, ESPTouchDelegate>

@end
