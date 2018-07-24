//
//  RCTHotUpdate+UpdateExtension.m
//  unZipDemo
//
//  Created by kencai on 2018/7/2.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RCTHotUpdate+UpdateExtension.h"

static NSString *const keyUpdateInfo = @"REACTNATIVECN_HOTUPDATE_INFO_KEY";
static NSString *const paramPackageVersion = @"packageVersion";
static NSString *const paramLastVersion = @"lastVersion";
static NSString *const paramCurrentVersion = @"currentVersion";
static NSString *const paramIsFirstTime = @"isFirstTime";
static NSString *const paramIsFirstLoadOk = @"isFirstLoadOK";
static NSString *const keyFirstLoadMarked = @"REACTNATIVECN_HOTUPDATE_FIRSTLOADMARKED_KEY";
static NSString *const keyRolledBackMarked = @"REACTNATIVECN_HOTUPDATE_ROLLEDBACKMARKED_KEY";

@implementation RCTHotUpdate (UpdateExtension)

+(void)setNeedUpdate:(NSDictionary *)options markSuccess:(BOOL)flag
{
  NSString *hashName = options[@"hashName"];
  if (hashName.length) {
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *lastVersion = nil;
    if ([defaults objectForKey:keyUpdateInfo]) {
      NSDictionary *updateInfo = [defaults objectForKey:keyUpdateInfo];
      lastVersion = updateInfo[paramCurrentVersion];
    }
    
    NSMutableDictionary *newInfo = [[NSMutableDictionary alloc] init];
    newInfo[paramCurrentVersion] = hashName;
    newInfo[paramLastVersion] = lastVersion;
    newInfo[paramIsFirstTime] = @(!flag);
    newInfo[paramIsFirstLoadOk] = @(flag);
    newInfo[paramPackageVersion] = [RCTHotUpdate packageVersion];
    [defaults setObject:newInfo forKey:keyUpdateInfo];
    
    [defaults synchronize];
  }
}

+ (NSString *)packageVersion
{
  static NSString *version = nil;
  
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
  });
  return version;
}


+ (NSString *)downloadDir
{
  NSString *directory = [NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES) firstObject];
  NSString *downloadDir = [directory stringByAppendingPathComponent:@"reactnativecnhotupdate"];

  return downloadDir;
}

@end
