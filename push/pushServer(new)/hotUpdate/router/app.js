var express      = require('express')
var db           = require('../db')
var paramCheck   = require('./check')
var { Log, Auth }      = require('./middleware')
var crypto       = require('crypto')
const fs         = require('fs')
var router       = express.Router()
const {rmdirSync} = require('../util')
// var redis = require('../db/redis')

// 该路由使用的中间件
router.use(Log('app'));
router.use(Auth);

router.get('/list', (req, res, next) => {
    db.queryApp(({val, data}) => {
        if (val === true) {
            res.send({success:1, data:data.list})
        } else {
            res.send({success:0, msg:data})
            next(data)
        }
    })
})

router.post('/appId', (req, res, next) => {
    let {id} = req.body
    if (paramCheck({id})) {
        db.queryById(id, ({val, app}) => {
            if (val === true) {
                res.send({success:1, appKey:app.appId, name:app.name})
            } else {
                res.send({success:0, msg:app})
                next(app)
            }
        })
    }
})

router.post('/exists', (req, res, next) => {
    let {name, appId, platform} = req.body
    if (name && platform) {
        var h = crypto.createHash('md5')
        h.update(name+platform)
        var appKey = h.digest('hex')
        db.existsByAppId(appKey, ({val, msg, count}) => {
            if (val === true) {
                if (count !== 0) {
                    res.send({success:1, appKey})
                } else {
                    res.send({success:0, msg:'not exist'})
                }
            } else {
                res.send({success:0, msg})
                next(msg)
            }
        })
    } else {
        if (appId) {
            db.existsByAppId(appId, ({val, msg, count}) => {
                if (val === true) {
                    if (count !== 0) {
                        res.send({success:1, appId})
                    } else {
                        res.send({success:0, msg:'not exist'})
                    }
                } else {
                    res.send({success:0, msg})
                    next(msg)
                }
            }) 
        } else {
            res.send({success:0, msg:'please use appId or name with platform to post'})
        }
    }
})

router.post('/update', (req, res, next) => {
    let {downloadUrl, appId, name, platform} = req.body
    if (appId == undefined && (name && platform)) {
        var h = crypto.createHash('md5')
        h.update(name+platform)
        appId = h.digest('hex')
    }
    if (paramCheck({downloadUrl, appId})) {
        db.existsByAppId(appId, ({val, msg, count}) => {
            if (val === true) {
                if (count !== 0) {
                    db.updateAppInfo(appId, downloadUrl, ({val, msg}) => {
                        if (val === true) {
                            res.send({success:1, appId})
                        } else {
                            res.send({success:0, msg})
                            next(msg)
                        }
                    })
                } else {
                    res.send({success:0, msg:'not exist'})
                }
            } else {
                res.send({success:0, msg})
                next(msg)
            }
        }) 
    } else {
        res.send({success:0, msg:'please use appId or name to post'})
    }      
})

router.post('/query', (req, res, next) => {
    let {platform} = req.body
    if (paramCheck({platform}, res)) {
        db.queryByPlatform(platform, ({val, data}) => {
            if (val === true) {
                res.send({success:1, data})
            } else {
                res.send({success:0, msg:data})
                next(data)
            }
        })
    }
})

router.post('/create', (req, res, next) => {
    let {name, platform, downloadUrl} = req.body
    if (!downloadUrl.length && platform === 'ios') {
        downloadUrl = 'www.dppush.ios.ipa';
    }
    if (paramCheck({name, platform, downloadUrl}, res)) {
        var h = crypto.createHash('md5')
        h.update(name+platform)
        var appId = h.digest('hex')
        db.insertApp(appId, name, platform, downloadUrl, ({val, msg, id}) => {
            if (val === true) {
                res.send({success:1, appKey:appId, id})
            } else {
                if (msg.code === '23505') {
                    var message = 'App with Name ' + name + ' already exits'
                    console.log(message)
                    res.send({success:0, msg:message})
                } else {
                    res.send({success:0, msg})
                }
                next(msg)
            }
        })
    }
})

router.post('/delete', (req, res, next) => {
    let {name, appId, platform} = req.body
    let appIdHex = appId
    if (name && platform) {
        var h = crypto.createHash('md5')
        h.update(name+platform)
        appIdHex = h.digest('hex');
    }
    if (appIdHex) {
        db.queryBundleByVersion(appIdHex)
        .then(({data}) => {
            let list = data.list
            var url = require("url");
            var querystring = require("querystring");
            list.forEach(element => {
                let diff_dir = 'hotUpdate/diff/' + element.hash;
                rmdirSync(diff_dir, e => {
                    if (e) {
                        console.log(e);
                    }
                })
                for (const key in element.packages) {
                    if (bundle.packages.hasOwnProperty(key)) {
                        const e = bundle.packages[key];
                        if (e && e.updateDiff) {
                            var arg = url.parse(e.updateDiff).query;
                            var params = querystring.parse(arg);
                            // redis.del(params.name)
                            db.deleteFormKey(params.name)
                            .then(() => {
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    }
                }
                let ppkPath = "uploads/" + element.hash;
                fs.exists(ppkPath, exists => {
                    if (exists) {
                        fs.unlinkSync(ppkPath)
                    }
                });
                // redis.del(element.hash)
                db.deleteFormKey(element.hash)
                .then(() => {
                }).catch(err => {
                    console.log(err);
                })
            });
            db.deleteBundleByAppId(appIdHex)
            .then(() => {
                db.deleteByAppId(appIdHex, ({val, msg}) => {
                    if (val === true) {
                        res.send({success:1, appId:appIdHex})
                    } else {
                        res.send({success:0, msg})
                        next(msg)
                    }
                })
            })
            .catch(err => {
                res.send({success:0, msg:err})
            })
        })
        .catch(err => {
            res.send({success:0, msg:err})
        })
    } else {
        res.send({success:0, msg:'please use appId or name with platform to post'})
    }
})

module.exports = router;