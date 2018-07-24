'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = undefined;

let showVersion = function () {
  var _ref = _asyncToGenerator(function* (appId, offset, version) {
    var _ref2 = yield post(`/bundle/query`, {appId, version});

    const data = _ref2.data;
          // count = _ref2.count;

    console.log(`Offset ${offset}`);
    console.log('Total ' + data.length + ' versions');
    for (const version of data) {
      let pkgs = Object.keys(version.packages)
      let packageInfo = pkgs.sort().slice(0, 3).map(function (v) {
        return v;
      }).join(', ');
      const count = pkgs.length;
      if (count > 3) {
        packageInfo += `...and ${count - 3} more`;
      }
      if (count === 0) {
        packageInfo = `(no package)`;
      } else {
        packageInfo = `[${packageInfo}]`;
      }
      console.log(`${version.id}) ${version.hash} ${version.name} metaInfo:${version.metaInfo} ${packageInfo}`);
      // console.log(`${version.id}) ${version.hash.slice(0, 8)} ${version.name} metaInfo:${version.metaInfo} ${packageInfo}`);
    }
    return data;
  });

  return function showVersion(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

let listVersions = function () {
  var _ref3 = _asyncToGenerator(function* (appId, version) {
    let offset = 0;
    yield showVersion(appId, offset, version);//分页还没做好
    // while (true) {
    //   const cmd = yield (0, _utils.question)('page Up/page Down/Begin/Quit(U/D/B/Q)');
    //   switch (cmd.toLowerCase()) {
    //     case 'u':
    //       offset = Math.max(0, offset - 10);break;
    //     case 'd':
    //       offset += 10;break;
    //     case 'b':
    //       offset = 0;break;
    //     case 'q':
    //       return;
    //   }
    // }
  });

  return function listVersions(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

let chooseVersion = function () {
  var _ref4 = _asyncToGenerator(function* (appId) {
    let offset = 0;
    const data = yield showVersion(appId, offset);
    while (true) {
      const cmd = yield (0, _utils.question)('Enter versionId or page Up/page Down/Begin(U/D/B)');
      switch (cmd.toLowerCase()) {
        case 'U':
          offset = Math.max(0, offset - 10);break;
        case 'D':
          offset += 10;break;
        case 'B':
          offset = 0;break;
        default:
          {
            const v = data.find(function (v) {
              return v.id === (cmd | 0);
            });
            if (v) {
              return v;
            }
          }
      }
    }
  });

  return function chooseVersion(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var _utils = require('./utils');

var _app = require('./app');

var _package = require('./package');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by tdzl2003 on 4/2/16.
 */

var _require = require('./api');

const get = _require.get,
      post = _require.post,
      put = _require.put,
      uploadFile = _require.uploadFile;
const commands = exports.commands = {
  publish: function () {
    var _ref5 = _asyncToGenerator(function* (_ref6) {
      let args = _ref6.args,
          options = _ref6.options;

      const fn = args[0];
      const name = options.name,
            description = options.description,
            metaInfo = options.metaInfo;


      if (!fn) {
        throw new Error('Usage: pushy publish <ppkFile> --platform ios|android');
      }

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref7 = yield (0, _app.getSelectedApp)(platform);

      const app_id = _ref7.appId;
      var _ref18 = yield post(`/app/appId/`,{id:app_id});
      var appId = _ref18.appKey;
      
      var _ref8 = yield uploadFile(fn);

      const hash = _ref8.hash;

      var _ref9 = yield post(`/bundle/create`, {
        platform,
        appId,
        name: name || (yield (0, _utils.question)('Enter version name:')) || '(未命名)',
        hash,
        description: description || (yield (0, _utils.question)('Enter description:')),
        metaInfo: metaInfo || (yield (0, _utils.question)('Enter meta info:'))
      });

      const id = _ref9.id;
      if (id) {
        console.log(`Version published: ${id}`);
        const v = yield (0, _utils.question)('Would you like to bind packages to this version?(Y/N)');
        if (v.toLowerCase() === 'y') {
          yield this.update({ args: [hash], options: { versionId: id, platform } });
        }
      } else {
        console.log('Error:'+_ref9.msg);
      }
    });

    return function publish(_x5) {
      return _ref5.apply(this, arguments);
    };
  }(),
  versions: function () {
    var _ref10 = _asyncToGenerator(function* (_ref11) {
      let options = _ref11.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref12 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref12.appKey;

      const list = yield _package.listPackage(_ref12.appId)
      
      if (list == null || list.length == 0) {
        console.log('app version count 0');
      } else {
        const id = yield (0, _utils.question)('Enter versionId:');
        const version = list.find(function (v) {
          return v.id === (id | 0);
        });
        if (version) {
          yield listVersions(appId, version.version);
        } else {
          yield listVersions(appId);
        }
      }
     
    });

    return function versions(_x6) {
      return _ref10.apply(this, arguments);
    };
  }(),
  update: function () {
    var _ref13 = _asyncToGenerator(function* (_ref14) {
      let args = _ref14.args,
          options = _ref14.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref15 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref15.appKey;

      const hash = args[0] || (yield chooseVersion(appId)).hash;
      console.log('Bind the RN bundle to package version');
      const version = options.version || (yield (0, _package.choosePackage)(_ref15.appId)).version;
      const result = yield post(`/bundle/update`, {
        version,
        hash,
        appId
      });
      if (result.success === 1) {
        console.log('Ok.');
      } else {
        console.log(result.msg)
      }
    });

    return function update(_x7) {
      return _ref13.apply(this, arguments);
    };
  }(),
  deleteVer: function () {
    var _ref26 = _asyncToGenerator(function* (_ref16) {
      let args = _ref16.args,
          options = _ref16.options;

      const platform = (0, _app.checkPlatform)(options.platform || (yield (0, _utils.question)('Platform(ios/android):')));

      var _ref25 = yield (0, _app.getSelectedApp)(platform);

      const appId = _ref25.appKey;

      const hash = args[0] || (yield chooseVersion(appId)).hash;
      console.log('delete version for hash '+hash);
      
      const result = yield post(`/bundle/delete`, {
        hash,
      });
      if (result.success === 1) {
        console.log('Ok.');
      } else {
        console.log(result.msg)
      }
    });

    return function update(_x7) {
      return _ref26.apply(this, arguments);
    };
  }(),
};