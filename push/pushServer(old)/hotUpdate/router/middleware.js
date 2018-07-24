var moment = require('moment')
var util = require('../util')

//内存有问题 闭包route
const routeLog = function (route) {
    let innerRoute = route
    return function Log(req, res, next) {
        console.log('Time: ', moment(Date.now()).format('MMM D, YYYY, h:mm:ss a'))
        
        if (req.method == 'POST') {
            console.log('POST')
            console.log(innerRoute + ' router, path: ' + req.path)
            console.log('params:', req.body)
        }

        if (req.method == 'GET') {
            console.log('GET')
            console.log(innerRoute + ' router, path: ' + req.path)
            console.log('params:', req.query)
        }

        next();
    }
}

const authMiddleware = (req, res, next) => {
    console.log('header');
    console.log(req.headers['x-accesstoken']);
    let token = req.headers['x-accesstoken'];
    if (!token) {
        res.status(401).send({msg:'Not authenticated'})
    } else {
        util.getUserId(req.headers['x-accesstoken'])
        .then(userId => {
            next();
        }).catch(err => {
            res.status(401).send({msg:'Not authenticated'})
        });
    } 
}

module.exports = {Log:routeLog, Auth:authMiddleware}