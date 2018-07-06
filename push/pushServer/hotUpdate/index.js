const express = require('express')

// const cool = require('cool-ascii-faces')
const path = require('path')
const fs   = require('fs')
const PORT = process.env.PORT || 5000

var diffFromPPK   = require('./diff');
var crypto        = require('crypto');
var bodyParser	  = require('body-parser');
var { 
    app:appRouter,
	fileIO:file,
	version
} = require('./router');
// 二维码
// itms-services:///?action=download-manifest&url=https://frozen-scrubland-23823.herokuapp.com/Apps/manifest.plist

var app = express();

//最新ipad包
app.use('/Apps', express.static(path.join(__dirname, '..', 'ipad/Apps')))

//for parsing application/json
app.use(bodyParser.json());

//for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//for parsing multipart/form-data //需要用npm install multer@0.1.8
// var multer		  = require('multer')
// app.use(multer());

app.get('/getCurrencymd5', (req, res) => {
    var rs = fs.createReadStream('currency/index.ios.jsbundle');
	var hash = crypto.createHash('md5');
	rs.on('data', hash.update.bind(hash));
	rs.on('end', function () {
		let hexName = hash.digest('hex')
		console.log(hexName)
		res.send({hexName})
	});
})

app.get('/diff', (req, res) => {
    // diffFromPPK('hotUpdate/diff/ios.1526035049040.ppk', 'hotUpdate/diff/ios.1529977056703.ppk', 'hotUpdate/diff/FiweDcUzRBRYXj2lMJ4N5ZL94666').then(val => {
	// 	console.log(val);
	// 	res.send({val})
	// }, err => {
	// 	console.log(err);
	// 	res.send({err})
	// })
	res.send("test success")
})
app.use('/app', appRouter)
app.use('/file', file)
app.use('/version', version)

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))