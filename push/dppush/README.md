# dppush cli 使用说明

使用步骤

* `cd dppush`
* `npm install`
* `npm link`

然后就可以在电脑的任意目录下使用dppush，建议在工作目录（workspace）下操作，名字不一定是workspace可以随意命名，也可以直接在react-native项目的根目录操作，之后`dppush bundle`也是必须在此目录操作

* `cd workspace`
* `dppush login`
*  输入你注册的用户名和密码 ... ，如果未注册用`dppush register`注册


* 以下如果已经创建有app 可以直接用`dppush selectApp` (--platform)
* `dppush createApp` (--platform --name --downloadUrl) 在workspace会生成一个.update文件 里面存放的是appKey(appId)

* 创建原生包的版本
* `dppush createPackageVersion` (--platform)

* 给react-native项目打包 在react-native项目的根目录
* `dppush bundle` 默认参数 (--platform --verbose --dev:false entryFile:"" --intermediaDir: 临时文件输出目录 --output: 默认输出路径 build/output/{time}.ppk)

* `dppush publish {ppkPath}` (--platform) 后接刚刚打包的ppk压缩文件的路径

* `dppush update` (--platform --version) 将bundle的版本和原生包的版本绑定

* 以上

注意 ：react-native项目需要安装对应版本的

npm install --save react-native-update@具体版本请看[react-native-update](https://github.com/reactnativecn/react-native-pushy)

并修改文件 node_modules/react-native-update/index.js
```
//5 line
const HotUpdate = require('react-native').NativeModules.HotUpdate;
import {NativeAppEventEmitter} from 'react-native';

// let host = 'http://update.reactnative.cn/api';

let host = 'https://frozen-scrubland-23823.herokuapp.com';

export const downloadRootDir = HotUpdate.downloadRootDir;
export const packageVersion = HotUpdate.packageVersion;
export const currentVersion = HotUpdate.currentVersion;
export const isFirstTime = HotUpdate.isFirstTime;
export const isRolledBack = HotUpdate.isRolledBack;

/*
Return json:
Package was expired:
{
  expired: true,
  downloadUrl: 'http://appstore/downloadUrl',
}
Package is up to date:
{
  upToDate: true,
}
There is available update:
{
  update: true,
  name: '1.0.3-rc',
  hash: 'hash',
  description: '添加聊天功能\n修复商城页面BUG',
  metaInfo: '{"silent":true}',
  updateUrl: 'http://update-packages.reactnative.cn/hash',
  pdiffUrl: 'http://update-packages.reactnative.cn/hash',
  diffUrl: 'http://update-packages.reactnative.cn/hash',
}
 */
export async function checkUpdate(APPKEY) {
  console.log('appkey:', APPKEY);
  console.log('packageVersion:', packageVersion);
  console.log('currentVersion:', currentVersion);
  const resp = await fetch(`${host}/main/checkUpdate`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      packageVersion: packageVersion,
      hash: currentVersion,
      appKey: APPKEY
    }),
  });

  let result = await resp.json()

  if (resp.status !== 200) {
    throw new Error(result.msg);
  }

  if (result.success === 0) {
    throw new Error(result.msg);
  }

  return result;
}
//69 line

```

# 命令

#### dppush register

注册

#### dppush login

登录

#### dppush logout

登出并清除本地的登录信息

#### dppush me

查看自己是否已经登录，以及昵称等信息。

#### dppush bundle

生成资源包

* platform: ios|android 对应的平台
* entryFile: 入口脚本文件
* intermediaDir: 临时文件输出目录
* output: 最终ppk文件输出路径
* dev: 是否打包开发版本
* verbose: 是否展现打包过程的详细信息

#### dppush publish <ppkFile>

发布新的更新版本。

* platform: ios|android 对应的平台
* name: 当前版本的名字(版本号)
* description: 当前版本的描述信息，可以对用户进行展示
* metaInfo: 当前版本的元信息，可以用来保存一些额外信息


#### dppush update

为一个包版本绑定一个更新版本。这项操作也可以在网页管理端进行。

* platform: ios|android 对应的平台
* version: 要绑定的版本

#### dppush versions

列举可用bundle的版本

* platform: ios|android 对应的平台

#### dppush deleteVer

删除bundle的版本

#### dppush createPackageVersion

创建原生包的版本

#### dppush deletePkg

删除原生包的版本

#### dppush expiredPkg

将原生包的版本设置为过期 0/1 0不过期 1已过期, 1即返回
```
{
  expired: true,
  downloadUrl: 'http://appstore/downloadUrl',
}
```


#### dppush packages

查看已经上传的包。这项操作也可以在网页管理端进行。

* platform: ios|android 对应的平台

#### dppush createApp

创建应用并立刻绑定到当前工程。这项操作也可以在网页管理端进行。

* platform: ios|android 对应的平台
* name: 应用名称
* downloadUrl: 应用安装包的下载地址

#### dppush deleteApp < id >

删除已有应用。所有已创建的应用包、热更新版本都会被同时删除。这项操作也可以在网页管理端进行。

* platform: ios|android 对应的平台


#### dppush apps

查看当前所有应用。

* platform: ios|android 对应的平台

#### dppush selectApp

绑定应用到当前工程。

* platform: ios|android 对应的平台

#### dppush updateDownloadUrl

更新app的下载链接。

* platform: ios|android 对应的平台
* downloadUrl: 应用安装包的下载地址

# 接口文档：略
（见pushServer）
