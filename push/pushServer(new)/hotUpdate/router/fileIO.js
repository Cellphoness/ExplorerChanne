var express      = require('express')
var { Log }      = require('./middleware')
var crypto       = require('crypto')
var router       = express.Router()
var fs = require('fs')
// var path = require('path');
// var redis = require('../db/redis')
var db = require('../db')

//上传接口的中间件
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// 该路由使用的中间件
router.use(Log('file'));

// {appRoot}/file/download?name=fileName
// 需要加密
router.get('/download',function(req, res, next){
    var fileName = req.query.name;
    // currFile = path.join(__dirname, '..', '..', req.query.dir, fileName),
    // fReadStream;
    // console.log(currFile);
    console.log(fileName);
    // redis.getAsync(fileName)
    db
    .readFormKey(fileName)
    .then(reply => {
        // reply is null when the key is missing
        if (reply && reply.rows && reply.rows.length) {
            let result = reply.rows[0]
            let data = result.data
            res.set({
                "Content-type":"application/octet-stream",
                "Content-Disposition":"attachment;filename="+encodeURI(fileName)
            });
            var decodeImg = new Buffer.from(data, 'base64');         // new Buffer(string, encoding)
            res.write(decodeImg,"binary");
            res.end();
        } else {
            res.set("Content-type","text/html");
            res.send("file not exist!");
            res.end();
        }
    }).catch(err => {
        res.set("Content-type","text/html");
        res.send(err);
        res.end();
    });

    // fs.exists(currFile,function(exist) {
    //     if(exist){
    //         res.set({
    //             "Content-type":"application/octet-stream",
    //             "Content-Disposition":"attachment;filename="+encodeURI(fileName)
    //         });
    //         fReadStream = fs.createReadStream(currFile);
    //         fReadStream.on("data",function(chunk){
    //             res.write(chunk,"binary")});
    //         fReadStream.on("end",function () {
    //             res.end();
    //         });
    //     }else{
    //         res.set("Content-type","text/html");
    //         res.send("file not exist!");
    //         res.end();
    //     }
    // });
});

//upload.single('avatar')
router.post('/upload', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(req.body);
    
    req.file = req.file;
    var tmp_path = req.file.path;

    /** The original name of the uploaded file stored in the variable "originalname". **/
    //  var target_path = 'uploads/' + req.file.originalname;
    /** A better way to copy the uploaded file. **/

    var hash = crypto.createHash('md5');
    var src = fs.createReadStream(tmp_path);

    src.on('data', hash.update.bind(hash));
    src.on('end', function () {
        var hashName = hash.digest('hex')
        var tempBuffer = fs.readFileSync(tmp_path);
        let base64Str = tempBuffer.toString('base64');  // base64编码字符串
        
        db
        .readFormKey(hashName)
        .then(reply => {
            // reply is null when the key is missing
            if (reply && reply.rows && reply.rows.length) {
                db.updateFormKey(hashName, base64Str)
                .then(() => {
                    fs.unlink(tmp_path, function(err) { 
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.send({hash:hashName})
                })
                .catch(e => {
                    res.send({e}); 
                    console.log(e);
                })
            } else {
                // redis.setAsync(hashName, base64Str)
                db.saveToFile(hashName, base64Str)
                .then(() => {
                    fs.unlink(tmp_path, function(err) { 
                        if (err) {
                            console.log(err);
                        }
                    });
                    res.send({hash:hashName})
                })
                .catch(e => {
                    res.send({e}); 
                    console.log(e);
                })
            }
        })
        
        /*
        if (!fs.existsSync('uploads/')) {
            fs.mkdirSync('uploads/');
        }
        var target_path = 'uploads/' + hashName;

        var src_write = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src_write.pipe(dest);
        src_write.on('end', function() { 
            fs.unlink(tmp_path, function(err) { 
                if (err) {
                    console.log(err);
                }
            });
            res.send({hash:hashName})
        });
        src_write.on('error', function(err) { 
            res.send({err}); 
            console.log(err);
        });
        */
    });
  })

module.exports = router