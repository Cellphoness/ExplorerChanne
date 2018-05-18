import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Navigator from './config/routes';
import EStyleSheet from 'react-native-extended-stylesheet';
import { BDrawerProvider } from './components/BottomDrawer';
import { Dimensions } from 'react-native';

EStyleSheet.build({  
    $white: '#FFFFFF',
    $lightGray: '#F0F0F0',
    $border: '#E2E2E2',
    $inputText: '#797979',
    $darkText: '#343434',
    $screenWidth: Dimensions.get('window').width,
    $screenHeight: Dimensions.get('window').height,
  });

export default () => <BDrawerProvider><Navigator /></BDrawerProvider>;

/*
上传包(如果自己构建只需要一个版本号就足够)
pushy uploadIpa <your-package.ipa>
pushy uploadApk android/app/build/outputs/apk/app-release.apk

//全自动构建JS包版本
pushy bundle --platform <ios|android>

发布JS包版本(手动)
pushy publish --platform <ios|android> <ppkFile>

更新JS包版本(手动)
pushy update --platform <ios|android>

*/