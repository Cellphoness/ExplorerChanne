var moment = require('moment')

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


module.exports = {Log:routeLog}