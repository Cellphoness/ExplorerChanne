const express = require('express')
// const cool = require('cool-ascii-faces')
const path = require('path')
const PORT = process.env.PORT || 5000
var { 
    app:appRouter,
	fileIO:file,
	version,
	bundle,
	user,
	main
} = require('./router');
// 二维码
// itms-services:///?action=download-manifest&url=https://frozen-scrubland-23823.herokuapp.com/Apps/manifest.plist

var app = express();
var bodyParser	  = require('body-parser');

//最新ipad包
app.use('/Apps', express.static(path.join(__dirname, '..', 'ipad/Apps')))

//for parsing application/json
app.use(bodyParser.json());

//for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//for parsing multipart/form-data //需要用npm install multer@0.1.8
// var multer		  = require('multer')
// app.use(multer());

app.use('/app', appRouter)
app.use('/file', file)
app.use('/version', version)
app.use('/bundle', bundle)
app.use('/user', user)
app.use('/main', main)

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))