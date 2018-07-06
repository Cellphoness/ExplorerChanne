var express      = require('express')
// var db           = require('../db')
// var paramCheck   = require('./check')
var { Log }      = require('./middleware')
var crypto       = require('crypto')
var router       = express.Router()
var fs = require('fs')
var path= require('path');

//上传接口的中间件
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// 该路由使用的中间件
router.use(Log('file'));

// {appRoot}/file/download?dir=/hotUpdate/db&name=mydatebase.db
// 需要加密
router.get('/download',function(req, res, next){
    var fileName = req.query.name,
    currFile = path.join(__dirname, '..', '..', req.query.dir, fileName),
    fReadStream;
    console.log(currFile);
    console.log(fileName);
    fs.exists(currFile,function(exist) {
        if(exist){
            res.set({
                "Content-type":"application/octet-stream",
                "Content-Disposition":"attachment;filename="+encodeURI(fileName)
            });
            fReadStream = fs.createReadStream(currFile);
            fReadStream.on("data",function(chunk){res.write(chunk,"binary")});
            fReadStream.on("end",function () {
                res.end();
            });
        }else{
            res.set("Content-type","text/html");
            res.send("file not exist!");
            res.end();
        }
    });
});

//upload.single('avatar')
router.post('/upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.body);
    
    req.file = req.file;
    var tmp_path = req.file.path;
    console.log(tmp_path);

    /** The original name of the uploaded file
         stored in the variable "originalname". **/
    var target_path = 'uploads/' + req.file.originalname;

    /** A better way to copy the uploaded file. **/
    console.log(target_path);


    if (!fs.existsSync('uploads/')) {
        fs.mkdirSync('uploads/');
    }

    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() { 
        fs.unlink(tmp_path, function(err) { 
            if (err) {
                console.log(err);
            }
        });
        var rs = fs.createReadStream('currency/index.ios.jsbundle');
        var hash = crypto.createHash('md5');
        rs.on('data', hash.update.bind(hash));
        rs.on('end', function () {
            let hash = hash.digest('hex')
            res.send({hash})
        });
    });
    src.on('error', function(err) { 
        res.send({err}); 
        console.log(err);
    });
  })

module.exports = router