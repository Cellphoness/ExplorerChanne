var express      = require('express')
var db           = require('../db')
var paramCheck   = require('./check')
var { Log }      = require('./middleware')
var crypto       = require('crypto')
var router       = express.Router()

// 该路由使用的中间件
router.use(Log('app'));

router.get('/list', (req, res, next) => {
    db.queryApp(({val, data}) => {
        if (val === true) {
            res.send({success:1, data:data.list})
        } else {
            res.send({success:0, data})
            next(data)
        }
    })
})

router.post('/appId', (req, res, next) => {
    let {id} = req.body
    if (paramCheck({id})) {
        db.queryById(id, ({val, data}) => {
            if (val === true) {
                res.send({success:1, appKey:data.appId})
            } else {
                res.send({success:0, data})
                next(data)
            }
        })
    }
})

router.post('/exists', (req, res, next) => {
    let {name, appId} = req.body
    if (name) {
        var h = crypto.createHash('md5')
        h.update(name)
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
            res.send({success:0, msg:'please use appId or name to post'})
        }
    }
})

router.post('/update', (req, res, next) => {
    let {downloadUrl, appId, name} = req.body
    if (appId == undefined && name) {
        var h = crypto.createHash('md5')
        h.update(name)
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
                res.send({success:0, data})
                next(data)
            }
        })
    }
})

router.post('/create', (req, res, next) => {
    let {name, platform, downloadUrl='https://lounge.dragonpass.com.cn/static/downloadCenter/index.html'} = req.body
    if (paramCheck({name, platform, downloadUrl}, res)) {
        var h = crypto.createHash('md5')
        h.update(name)
        var appId = h.digest('hex')
        db.insertApp(appId, name, platform, downloadUrl, ({val, msg, id}) => {
            if (val === true) {
                res.send({success:1, appKey:appId, id})
            } else {
                if (msg.errno == 19) {
                    var message = 'App with Name ' + name + ' alredy exits'
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
    let {name, appId} = req.body
    if (name) {
        var h = crypto.createHash('md5')
        h.update(name)
        var appIdHex = h.digest('hex')
        db.deleteByAppId(appIdHex, ({val, msg}) => {
            if (val === true) {
                res.send({success:1, appIdHex})
            } else {
                res.send({success:0, msg})
                next(msg)
            }
        })
    } else {
        if (appId) {
            db.deleteByAppId(appId, ({val, msg}) => {
                if (val === true) {
                    res.send({success:1, appId})
                } else {
                    res.send({success:0, msg})
                    next(msg)
                }
            }) 
        } else {
            res.send({success:0, msg:'please use appId or name to post'})
        }
    }
})

module.exports = router;