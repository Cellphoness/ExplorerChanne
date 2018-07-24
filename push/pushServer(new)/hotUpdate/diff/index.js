var _yazl  = require('yazl');
var _yauzl = require('yauzl');
var _path  = require('path');
var fs     = require('fs');
var _mkdirRecursive = require('mkdir-recursive');
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
var path = _interopRequireWildcard(_path);
function mkdir(dir) {
  return new Promise(function (resolve, reject) {
    (0, _mkdirRecursive.mkdir)(dir, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

var diff;
try {
  var bsdiff = require('node-bsdiff');
  diff = typeof bsdiff != 'function' ? bsdiff.diff : bsdiff;
} catch (e) {
  diff = function () {
    console.warn('This function needs "node-bsdiff". Please run "npm i node-bsdiff -S" from your project directory first!');
    throw new Error('This function needs module "node-bsdiff". Please install it first.');
  };
}

function enumZipEntries(zipFn, callback) {
  return new Promise(function (resolve, reject) {
    (0, _yauzl.open)(zipFn, { lazyEntries: true }, function (err, zipfile) {
      if (err) {
        return reject(err);
      }
      zipfile.on('end', resolve);
      zipfile.on('error', reject);
      zipfile.on('entry', function (entry) {
        const result = callback(entry, zipfile);
        if (result && typeof result.then === 'function') {
          result.then(function () {
            return zipfile.readEntry();
          });
        } else {
          zipfile.readEntry();
        }
      });
      zipfile.readEntry();
    });
  });
}

function readEntire(entry, zipFile) {
  const buffers = [];
  return new Promise(function (resolve, reject) {
    zipFile.openReadStream(entry, function (err, stream) {
      stream.pipe({
        write(chunk) {
          buffers.push(chunk);
        },
        end() {
          resolve(Buffer.concat(buffers));
        },
        prependListener() {},
        on() {},
        once() {},
        emit() {}
      });
    });
  });
}

function basename(fn) {
  const m = /^(.+\/)[^\/]+\/?$/.exec(fn);
  return m && m[1];
}

var diffFromPPK = function () {
  var _ref2 = _asyncToGenerator(function* (origin, next, output) {
    yield mkdir(path.dirname(output));

    const originEntries = {};
    const originMap = {};

    let originSource;

    yield enumZipEntries(origin, function (entry, zipFile) {
      originEntries[entry.fileName] = entry;
      if (!/\/$/.test(entry.fileName)) {
        // isFile
        originMap[entry.crc32] = entry.fileName;

        if (entry.fileName === 'index.bundlejs') {
          // This is source.
          return readEntire(entry, zipFile).then(function (v) {
            return originSource = v;
          });
        }
      }
    });

    originSource = originSource || new Buffer(0);

    const copies = {};

    var zipfile = new _yazl.ZipFile();

    const writePromise = new Promise(function (resolve, reject) {
      zipfile.outputStream.on('error', function (err) {
        throw err;
      });
      zipfile.outputStream.pipe(fs.createWriteStream(output)).on("close", function () {
        resolve();
      });
    });

    const addedEntry = {};

    function addEntry(fn) {
      //console.log(fn);
      if (!fn || addedEntry[fn]) {
        return;
      }
      const base = basename(fn);
      if (base) {
        addEntry(base);
      }
      zipfile.addEmptyDirectory(fn);
    }

    const newEntries = {};

    yield enumZipEntries(next, function (entry, nextZipfile) {
      newEntries[entry.fileName] = entry;

      if (/\/$/.test(entry.fileName)) {
        // Directory
        if (!originEntries[entry.fileName]) {
          addEntry(entry.fileName);
        }
      } else if (entry.fileName === 'index.bundlejs') {
        //console.log('Found bundle');
        return readEntire(entry, nextZipfile).then(function (newSource) {
          //console.log('Begin diff');
          zipfile.addBuffer(diff(originSource, newSource), 'index.bundlejs.patch');
          //console.log('End diff');
        });
      } else {
        // If same file.
        const originEntry = originEntries[entry.fileName];
        if (originEntry && originEntry.crc32 === entry.crc32) {
          // ignore
          return;
        }

        // If moved from other place
        if (originMap[entry.crc32]) {
          const base = basename(entry.fileName);
          if (!originEntries[base]) {
            addEntry(base);
          }
          copies[entry.fileName] = originMap[entry.crc32];
          return;
        }

        // New file.
        addEntry(basename(entry.fileName));

        return new Promise(function (resolve, reject) {
          nextZipfile.openReadStream(entry, function (err, readStream) {
            if (err) {
              return reject(err);
            }
            zipfile.addReadStream(readStream, entry.fileName);
            readStream.on('end', function () {
              //console.log('add finished');
              resolve();
            });
          });
        });
      }
    });

    const deletes = {};

    for (var k in originEntries) {
      if (!newEntries[k]) {
        console.log('Delete ' + k);
        deletes[k] = 1;
      }
    }

    //console.log({copies, deletes});
    zipfile.addBuffer(new Buffer(JSON.stringify({ copies, deletes })), '__diff.json');
    zipfile.end();
    yield writePromise;
  });
  return function diffFromPPK(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
};

module.exports = diffFromPPK();
