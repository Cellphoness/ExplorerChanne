'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Created by tdzl2003 on 2/13/16.
 */

var _require = require('./api');

const loadSession = _require.loadSession;


function printUsage(_ref) {
  let args = _ref.args;
  
  console.log(`
  
  ------- dppush register

  注册
  
  ------- dppush login
  
  登录
  
  ------- dppush logout
  
  登出并清除本地的登录信息
  
  ------- dppush me
  
  查看自己是否已经登录，以及昵称等信息。
  
  ------- dppush bundle
  
  生成资源包
  
  * platform: ios|android 对应的平台
  * entryFile: 入口脚本文件
  * intermediaDir: 临时文件输出目录
  * output: 最终ppk文件输出路径
  * dev: 是否打包开发版本
  * verbose: 是否展现打包过程的详细信息
  
  ------- dppush publish <ppkFile>
  
  发布新的更新版本。
  
  * platform: ios|android 对应的平台
  * name: 当前版本的名字(版本号)
  * description: 当前版本的描述信息，可以对用户进行展示
  * metaInfo: 当前版本的元信息，可以用来保存一些额外信息
  
  
  ------- dppush update
  
  为一个包版本绑定一个更新版本。这项操作也可以在网页管理端进行。
  
  * platform: ios|android 对应的平台
  * version: 要绑定的版本
  
  ------- dppush versions
  
  列举可用bundle的版本
  
  * platform: ios|android 对应的平台
  
  ------- dppush deleteVer
  
  删除bundle的版本
  
  ------- dppush createPackageVersion
  
  创建原生包的版本
  
  ------- dppush deletePkg
  
  删除原生包的版本
  
  ------- dppush expiredPkg
  
  将原生包的版本设置为过期 0/1 0不过期 1已过期, 1即返回
  
  ------- dppush packages
  
  查看已经上传的包。这项操作也可以在网页管理端进行。
  
  * platform: ios|android 对应的平台
  
  ------- dppush createApp
  
  创建应用并立刻绑定到当前工程。这项操作也可以在网页管理端进行。
  
  * platform: ios|android 对应的平台
  * name: 应用名称
  * downloadUrl: 应用安装包的下载地址
  
  ------- dppush deleteApp < id >
  
  删除已有应用。所有已创建的应用包、热更新版本都会被同时删除。这项操作也可以在网页管理端进行。
  
  * platform: ios|android 对应的平台
  
  
  ------- dppush apps
  
  查看当前所有应用。
  
  * platform: ios|android 对应的平台
  
  ------- dppush selectApp
  
  绑定应用到当前工程。
  
  * platform: ios|android 对应的平台
  
  ------- dppush updateDownloadUrl
  
  更新app的下载链接。
  
  * platform: ios|android 对应的平台
  * downloadUrl: 应用安装包的下载地址`);

  process.exit(1);
}

const commands = _extends({}, require('./user').commands, require('./bundle').commands, require('./app').commands, require('./package').commands, require('./versions').commands, {
  help: printUsage
});

exports.run = function () {
  const argv = require('cli-arguments').parse(require('../cli.json'));
  global.NO_INTERACTIVE = argv.options['no-interactive'];

  loadSession().then(function () {
    return commands[argv.command](argv);
  }).catch(function (err) {
    if (err.status === 401) {
      console.log('Not loggined.\nRun `dppush login` at your work directory to login.');
      return;
    }
    console.error(err.stack);
    process.exit(-1);
  });
};