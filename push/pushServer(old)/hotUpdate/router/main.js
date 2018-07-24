var express      = require('express')
var db           = require('../db')
var paramCheck   = require('./check')
var { Log }      = require('./middleware')

var router       = express.Router()

// 该路由使用的中间件
router.use(Log('main'));

router.post('/checkUpdate', (req, res, next) => {
  let {packageVersion, hash, appKey} = req.body
  if (paramCheck({packageVersion, hash, appKey}, res)) {
    db.queryApp(({val, data:appData}) => {
      if (val) {
        let app = appData.list.find(e => appKey === e.appId)
        if (app) {
          db.queryVersionByAppid(appKey, ({val:result, data}) => {
            if (result) {
              let version = data.list.find(e => packageVersion === e.version)
              if (version) {
                if (version.expired === 1) {
                  res.send({
                    expired: true,
                    downloadUrl: app.downloadUrl,
                    success:1
                  })
                } else {
                  if (version.hash === hash) {
                    res.send({
                      upToDate: true,
                      success:1
                    })
                  } else {
                    db.queryBundleByVersion(appKey, packageVersion)
                    .then(({data:bundleList}) => {
                      let bundle = bundleList.list.find(e => hash === e.hash)
                      let targetBundle = bundleList.list.find(e => version.hash === e.hash)
                      if (bundle && targetBundle) {
                        res.send({
                          update: true,
                          name: targetBundle.name,
                          hash: version.hash,
                          description: targetBundle.description,
                          metaInfo: targetBundle.metaInfo,
                          diffUrl: bundle.packages[`${packageVersion}`].updateDiff,
                          updateDiffSize: bundle.packages[`${packageVersion}`].updateDiffSize,
                          unit: bundle.packages[`${packageVersion}`].unit
                        })
                      } else {
                        res.send({success:0, msg:'not such bundle exits'})
                      }
                    })
                    .catch((err) => {
                      res.send({success:0, msg:err})
                      next(err)
                    })
                  }
                }
              } else {
                res.send({success:0, msg:'not such version exits'})
              }
            } else {
              res.send({success:0, msg:data})
              next(data)
            }
          })
        } else {
          res.send({success:0, msg:'not such app exits'})
        }
      } else {
        res.send({success:0, msg:appData})
        next(appData)
      }
    })
  }
})

module.exports = router