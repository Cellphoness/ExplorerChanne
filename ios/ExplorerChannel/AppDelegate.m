/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RCTHotUpdate/RCTHotUpdate.h>
#import <RCTHotUpdateManager.h>
#import "RCTHotUpdate+UpdateExtension.h"

@implementation AppDelegate
{
  RCTHotUpdateManager *_fileManager;
  RCTRootView *_rootView;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

//  NSString *ver = [NSString stringWithFormat:@"%@",[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];
//  if ([[NSUserDefaults standardUserDefaults] objectForKey:[@"setup_" stringByAppendingString:ver]] && [[[NSUserDefaults standardUserDefaults] objectForKey:[@"setup_" stringByAppendingString:ver]] isEqualToString:@"1"]) {
//    jsCodeLocation = [RCTHotUpdate bundleURL];
//  } else {
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//  }
  _rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                          moduleName:@"ExplorerChannel"
                                   initialProperties:nil
                                       launchOptions:launchOptions];
/*
#if DEBUG
  // 原来的jsCodeLocation保留在这里
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  // 非DEBUG情况下启用热更新
  jsCodeLocation= [RCTHotUpdate bundleURL];
#endif
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ExplorerChannel"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
 
 */
  _rootView.backgroundColor = [UIColor whiteColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = _rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
//  _fileManager = [RCTHotUpdateManager new];
  
  //本地包 第一个依赖包 (如果发新版本 记得新包的hash要改一下 ...f0287ec5ac89b42c385fe2228abdf623)

  //  [self unzipPPK:@"f0287ec5ac89b42c385fe2228abdf623" bundleFile:@"ios.1531902646898" fileExtension:@"ppk"];
//  [self unzipPPK:@"84748a57c70f86b25fe419e44d5e7ae5" bundleFile:@"ios.1531986292681" fileExtension:@"ppk"];
  
  
  return YES;
}

-(void)unzipPPK:(NSString *)hashName bundleFile:(NSString *)bundleFile fileExtension:(NSString *)fileExtension
{
  NSString *ver = [NSString stringWithFormat:@"%@",[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];
  if ([[NSUserDefaults standardUserDefaults] objectForKey:[@"setup_" stringByAppendingString:ver]] && [[[NSUserDefaults standardUserDefaults] objectForKey:[@"setup_" stringByAppendingString:ver]] isEqualToString:@"1"]) {
    return;
  }
  NSString *dir = [RCTHotUpdate downloadDir];
  NSString *unzipFilePath = [dir stringByAppendingPathComponent:hashName];
  NSString *zipFilePath = [[[NSBundle mainBundle] URLForResource:bundleFile withExtension:fileExtension] path];
  NSLog(@"unzipFilePath:%@", unzipFilePath);
  [_fileManager unzipFileAtPath:zipFilePath toDestination:unzipFilePath progressHandler:^(NSString *entry, long entryNumber, long total) {
    
  } completionHandler:^(NSString *path, BOOL succeeded, NSError *error) {
    NSLog(@"path:%@", path);
    if (error) {
      NSLog(@"eror:%@", error);
    } else {
      //需要手动添加
      [RCTHotUpdate setNeedUpdate:@{@"hashName": hashName} markSuccess:YES];
      
      //JS 里面手动调用一次 markSuccess
      
      // reload
      dispatch_async(dispatch_get_main_queue(), ^{
        [[NSUserDefaults standardUserDefaults] setObject:@"1" forKey:[@"setup_" stringByAppendingString:ver]];
        [_rootView setValue:@"ExplorerChannel" forKey:@"moduleName"];
        [_rootView.bridge setValue:[RCTHotUpdate bundleURL] forKey:@"bundleURL"];
        [_rootView.bridge reload];
      });
    }
  }];
}

@end
