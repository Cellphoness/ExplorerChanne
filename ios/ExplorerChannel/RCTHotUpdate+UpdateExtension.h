//
//  RCTHotUpdate+UpdateExtension.h
//  unZipDemo
//
//  Created by kencai on 2018/7/2.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <RCTHotUpdate/RCTHotUpdate.h>

@interface RCTHotUpdate (UpdateExtension)

+ (NSString *)downloadDir;
+(void)setNeedUpdate:(NSDictionary *)options markSuccess:(BOOL)flag;

@end
