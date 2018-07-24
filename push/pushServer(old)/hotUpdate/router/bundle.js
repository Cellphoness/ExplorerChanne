var express      = require('express')
var db           = require('../db')
var paramCheck   = require('./check')
var {Log, Auth}  = require('./middleware')
const fs         = require('fs')
var crypto       = require('crypto')
var router       = express.Router()
var { appRoot }  = require('../constant');
var diffFromPPK  = require('../diff');

const {rmdirSync} = require('../util')

// 该路由使用的中间件
router.use(Log('bundle'));
router.use(Auth);

router.post('/query', async (req, res, next) => {
    let {appId, version} = req.body
    if (paramCheck({appId}, res)) {
        try {
            let result = await db.queryBundleByVersion(appId, version)
            const {data} = result
            res.send({success:1, data:data.list})
        } catch (err) {
            res.send({success:0, msg:err})
            next(err)
        }
    }
})

router.post('/update', async (req, res, next) => {
    let {version, appId, hash} = req.body
    if (paramCheck({version, appId, hash}, res)) {
        try {
            var h = crypto.createHash('md5')
            h.update(appId + version)
            var versionId = h.digest('hex')
            await db.updateHashByVersionId(versionId, hash)

            let result = await db.queryBundleByVersion(appId)
            const {data} = result
            let cur = data.list.find((e) => {
                return e.hash === hash
            });

            if (cur) {
                let packagesObj = {
                    ...cur.packages,
                }
                packagesObj[`${version}`] = {}
                await db.updateBundle(hash, JSON.stringify(packagesObj))
                
                let {data:data2} = await db.queryBundleByVersion(appId, version)
                let list = data2.list.filter((e) => {
                    return e.hash !== hash
                });
                var count = 0;
                list.forEach(async (element) => {
                    var source_bundle_path = 'uploads/' + element.hash;
                    var target_bundle_path = 'uploads/' + hash;
                    var diff_dir = 'hotUpdate/diff/' + element.hash;
                    if (!fs.existsSync(diff_dir)) {
                        fs.mkdirSync(diff_dir);
                    }
                    if (!fs.existsSync(diff_dir + '/' + version)) {
                        fs.mkdirSync(diff_dir + '/' + version);
                    }  else {
                        //删除文件夹里的所有文件
                        let files = fs.readdirSync(diff_dir + '/' + version);
                        files.forEach((file, index) => {
                            var curPath = diff_dir + '/' + version + "/" + file;
                            fs.unlinkSync(curPath);
                        });
                    }
                    var diff_name = hash;
                    var diff_path = diff_dir + '/' + version + '/' + diff_name;
                    await diffFromPPK(source_bundle_path, target_bundle_path, diff_path)
                    let packages = {...element.packages}
                    var states = fs.statSync(diff_path)
                    packages[`${version}`] = {
                        updateDiff:`${appRoot}file/download?dir=/${diff_dir + '/' + version}&name=${diff_name}`,
                        updateDiffSize: `${states.size / 1024}`,
                        unit:'KB'
                    }
                    await db.updateBundle(element.hash, JSON.stringify(packages))
                    count++
                });
                res.send({success:1, count})
            } else {
                res.send({success:0, msg:'not found'})
            }
                
        } catch (err) {
            res.send({success:0,msg:err})
            next(err)
        }
    }
})

router.post('/delete', (req, res, next) => {
    let {hash} = req.body
    if (paramCheck({hash}, res)) {
        db.queryVersion(({val:result, data}) => {
            if (result) {
              let version = data.list.find(e => hash === e.hash)
              if (version) {
                // 不能删除
                res.send({success:0, msg:'cannnot delete, already bind to version ' + version.version})
              } else {
                db.deleteBundleByHash(hash)
                .then(() => {
                    var diff_dir = 'hotUpdate/diff/' + hash;
                    rmdirSync(diff_dir, e => {
                        if (e) {
                            console.log(e);
                        }
                        let ppkPath = "uploads/" + hash;
                        fs.exists(ppkPath, exists => {
                            if (exists) {
                                fs.unlinkSync(ppkPath)
                            }
                        });
                        res.send({success:1})
                    })
                })
                .catch((err) => {
                    res.send({success:0, msg:err})
                    next(msg)
                })
              }
            }
        })         

        
    }
})

router.post('/create', (req, res, next) => {
    let {hash, appId, name, metaInfo, description, platform} = req.body
    let ppkUrl = `${appRoot}file/download?dir=/uploads&name=${hash}`
    let packageVerMapDiff = {}
    if (paramCheck({hash, appId, name}, res)) {
        db
        .createBundle(hash, appId, name, metaInfo, JSON.stringify(packageVerMapDiff), ppkUrl, description, platform)
        .then(({id}) => {
            res.send({success:1, id})
        })
        .catch((err) => {
            if (err.errno == 19) {
                var message = 'Bundle with Name ' + name + ' alredy exits'
                console.log(message)
                res.send({success:0, msg:message})
            } else {
                res.send({success:0, msg:err})
            }
            next(msg)
        }) 
    }
})


module.exports = router;