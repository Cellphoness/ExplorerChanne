var express      = require('express')
var db           = require('../db')
var paramCheck   = require('./check')
var { Log }      = require('./middleware')

var util = require('../util')

var router       = express.Router()

// 该路由使用的中间件
router.use(Log('user'));

router.get('/me', (req, res, next) => {
    console.log('header');
    console.log(req.headers['x-accesstoken']);
    let token = req.headers['x-accesstoken'];
    if (token) {
        util.getUserId(token)
        .then(email => {
            db.existUser(email)
            .then((data) =>{ 
                if (!data.length) {
                    res.send({success:0, msg:'user with email: ' + email + ' not exist'})
                } else {
                    let info = data[0]
                    delete info.password
                    res.send({success:1, ...info})
                }
            })
            .catch(err => {
                res.send({success:0, msg:err})
                next(err)
            })
        }).catch(err => {
            res.status(401).send({msg:'Not authenticated'})
        });
    } else {
        res.status(401).send({msg:'Not authenticated'})
    }
})

router.post('/login', (req, res, next) => {
    let {email, password} = req.body
    if (paramCheck({email, password})) {
        db.existUser(email).then((data) =>{ 
            if (!data.length) {
                res.send({success:0, msg:'user with email: ' + email + ' not exist'})
            } else {
                let info = data[0]
                if (password !== info.password) {
                    res.send({success:0, msg:'wrong password'})
                } else {
                    delete info.password
                    const token = util.createToken(email)
                    res.send({success:1, token, info})
                }
            }
        }).catch(err => {
            res.send({success:0, msg:err})
            next(err)
        })
    }
})

router.post('/register', (req, res, next) => {
    let {name, email, password} = req.body
    if (paramCheck({name, email, password})) {
        db.createUser(name, email, password)
        .then(() => {
            let data = {name, email}
            const token = util.createToken(email)
            console.log('success');
            res.send({success:1, token, info:data})
        })
        .catch(err => {
            if (err.code === '23505') {
                var message = 'User with email ' + email + ' already exits'
                res.send({success:0, msg:message})
            } else {
                res.send({success:0, err})
            }
            next(err)
        })
    }
})


module.exports = router;