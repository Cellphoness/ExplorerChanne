var express      = require('express')
var db           = require('../db')
var paramCheck   = require('./check')
var { Log }      = require('./middleware')
var crypto       = require('crypto')
var router       = express.Router()

// 该路由使用的中间件
router.use(Log('version'));

router.post('/exists', (req, res, next) => {
    let {version, appId} = req.body
    if (paramCheck({version, appId}, res)) {
        var h = crypto.createHash('md5')
        h.update(appId + version)
        var versionId = h.digest('hex')
        db.existsByVersionId(versionId, ({val, msg, count}) => {
            if (val === true) {
                if (count !== 0) {
                    res.send({success:1, versionId})
                } else {
                    res.send({success:0, msg:'not exist'})
                }
            } else {
                res.send({success:0, msg})
                next(msg)
            }
        })
    }
})

router.post('/update', (req, res, next) => {
    let {version, appId, hash, expired} = req.body
    if (paramCheck({version, appId})) {
        var h = crypto.createHash('md5')
        h.update(appId + version)
        var versionId = h.digest('hex')
        if ((hash === undefined || hash === null || hash.length === 0) && (expired === undefined || expired === null)) {
            res.send({success:0, msg:'post paramter should contain hash or expired'})
        } else {
            db.existsByVersionId(versionId, ({val, msg, count}) => {
                if (val === true) {
                    if (count !== 0) {
                        if (hash) {
                            db.updateHashByVersionId(versionId, hash, ({val, msg}) => {
                                if (val === true) {
                                    res.send({success:1, versionId})
                                } else {
                                    res.send({success:0, msg})
                                    next(msg)
                                }
                            })
                        }
                        if (expired === '1') {
                            db.queryVersionByAppid(appId, ({val, data}) => {
                                if (val === true) {
                                    var rawList = data.list
                                    var resultList = rawList.filter((element) => {
                                        return element.expired === 1
                                    })
                                    //不允许所有版本都过期
                                    if (resultList.length === rawList.length - 1) {
                                        res.send({success:0, msg:'appId:' + appId + ' ver:' + version + ' cannot set expired'})
                                    } else {
                                        db.updateExpiredByVersionId(versionId, expired, ({val, msg}) => {
                                            if (val === true) {
                                                res.send({success:1, versionId})
                                            } else {
                                                res.send({success:0, msg})
                                                next(msg)
                                            }
                                        })
                                    }
                                } else {
                                    res.send({success:0, data})
                                    next(data)
                                }
                            })
                            
                        } else if (expired === '0') {
                            db.updateExpiredByVersionId(versionId, expired, ({val, msg}) => {
                                if (val === true) {
                                    res.send({success:1, versionId})
                                } else {
                                    res.send({success:0, msg})
                                    next(msg)
                                }
                            })
                        } else {
                            res.send({success:0, msg:'post expired should be 0 or 1'})
                        }
                    } else {
                        res.send({success:0, msg:'not exist'})
                    }
                } else {
                    res.send({success:0, msg})
                    next(msg)
                }
            })
        }       
    }
})

router.post('/query', (req, res, next) => {
    let {appId} = req.body
    if (paramCheck({appId}, res)) {
        db.queryVersionByAppid(appId, ({val, data}) => {
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
    let {appId, version} = req.body
    if (paramCheck({appId, version}, res)) {
        var h = crypto.createHash('md5')
        h.update(appId + version)
        var versionId = h.digest('hex')
        db.createVersion(versionId, appId, version, ({val, msg}) => {
            if (val === true) {
                res.send({success:1, versionId})
            } else {
                if (msg.errno == 19) {
                    var message = 'version with vserionId ' + versionId + ' alredy exits'
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
    let {appId, version} = req.body
    if (paramCheck({appId, version}, res)) {
        var h = crypto.createHash('md5')
        h.update(appId + version)
        var versionId = h.digest('hex')
        db.deleteByVersionId(versionId, ({val, msg}) => {
            if (val === true) {
                res.send({success:1, versionId})
            } else {
                res.send({success:0, msg})
                next(msg)
            }
        })
    }
})

module.exports = router;