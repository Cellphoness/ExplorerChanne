'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = exports.choosePackage = exports.listPackage = exports.updatePackage = undefined;

let choosePackage = exports.choosePackage = function () {
  var _ref3 = _asyncToGenerator(function* (appId) {
    const list = yield listPackage(appId);

    while (true) {
      const id = yield (0, _utils.question)('Enter versionId:');
      const app = list.find(function (v) {
        return v.id === (id | 0);
      });
      if (app) {
        return app;
      }
    }
  });

  return function choosePackage(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

let listPackage = exports.listPackage = function () {
  var _ref = _asyncToGenerator(function* (appId) {
    var _ref2 = yield get(`/version/list?appId=${appId}`);
    if (_ref2.success === 1) {
      const data = _ref2.data.list;
      for (const pkg of data) {
        console.log(`${pkg.id}) appId:${pkg.appId} ver:${pkg.version} using bundle hash:${pkg.hash} (expired:${pkg.expired}) `);
      }
      console.log(`\nTotal ${data.length} packages version.`);
      return data;
    } else {
      console.log('Error:'+_ref2.msg);
      return null;
    }
  });

  return function listPackage(_x) {
    return _ref.apply(this, arguments);
  };
}();

let updatePackage = exports.updatePackage = function () {
  var _ref = _asyncToGenerator(function* ({hash, expired, versionId}) {
    var _ref2 = yield post(`/version/update`, {hash, expired, versionId});
    if (_ref2.success === 1) {
      console.log('VersionId: '+ versionId + ' has update hash to ' + _ref2.hash)
    } else {
      console.log('Error:'+_ref2.msg);
    }
  });

  return function updatePackage(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _utils = require('./utils');

var _app = require('./app');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by tdzl2003 on 4/2/16.
 */

var _require = require('./api');

const get = _require.get,
      post = _require.post;

const commands = exports.commands = {
  createPackageVersion: function () {
    var _ref4 = _asyncToGenerator(function* (_ref5) {
      // let args = _ref5.args;
      let options = _ref5.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));
      var _ref6 = yield (0, _app.getSelectedApp)(platform);
      const version = options.version || (yield (0, _utils.question)('Package Version Name:'));
      const appId = _ref6.appKey;
      if (!version || !appId) {
        console.log('Canceled');
      } else {
        var _ref8 = yield post(`/version/create`, {
          appId,
          version
        });
        if (_ref8.success === 1) {
          const id = _ref8.id;
          console.log(platform + ' AppKey: ' + appId.slice(0, 8) + ' Package Version: ' + version + ` Version Id: ${id}`);
        } else {
          console.log('create version fail');
          console.log(_ref8.msg);
        }
      }
    });

    return function createPackageVersion(_x3) {
      return _ref4.apply(this, arguments);
    };
  }(),
  packages: function () {
    var _ref14 = _asyncToGenerator(function* (_ref15) {
      let options = _ref15.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref16 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref16.appId;

      yield listPackage(appId);
    });

    return function packages(_x5) {
      return _ref14.apply(this, arguments);
    };
  }(),
  deletePkg: function () {
    var _ref18 = _asyncToGenerator(function* (_ref15) {
      let options = _ref15.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref16 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref16.appId;

      var data = yield listPackage(appId);

      if (data) {
        const id = options.version || (yield (0, _utils.question)('Package Version ID you want to delete:'));
        var pkg = data.find(v => v.id === (id | 0))
        if (pkg) {
          const {version, appId} = pkg
          var result = yield post('/version/delete', {
            version, 
            appId
          })
          if (result.success === 1) {
            console.log('OK')
          } else {
            console.log(result.msg)
          }
        } else {
          console.log('Not match Version ID');
        }
      }
    });
    return function deletePkg(_x5) {
      return _ref18.apply(this, arguments);
    };
  }(),
  expiredPkg: function () {
    var _ref18 = _asyncToGenerator(function* (_ref15) {
      let options = _ref15.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref16 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref16.appId;

      var data = yield listPackage(appId);

      if (data) {
        const id = options.version || (yield (0, _utils.question)('Package Version ID you want to expired:'));
        var pkg = data.find(v => v.id === (id | 0))
        if (pkg) {
          const flag = (yield (0, _utils.question)('The expired status you want to set to 0/1:'));
          const {version, appId} = pkg
          var result = yield post('/version/update', {
            version, 
            appId,
            expired:flag
          })
          if (result.success === 1) {
            console.log('OK')
          } else {
            console.log(result.msg)
          }
        } else {
          console.log('Not match Version ID');
        }
      }
    });
    return function deletePkg(_x5) {
      return _ref18.apply(this, arguments);
    };
  }(),
};