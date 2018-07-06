// var fs = require('fs')
// var path= require('path');
// const express = require('express')
// var app = express();
  // app
  // .use('/assets/node_modules/react-navigation/src/views/assets', express.static(path.join(__dirname, 'currency/assets/node_modules/react-navigation/src/views/assets')))
  // .use('/assets/node_modules/react-native-dropdownalert/assets', express.static(path.join(__dirname, 'currency/assets/node_modules/react-native-dropdownalert/assets')))
  // .use('/assets/app', express.static(path.join(__dirname, 'currency/assets/app')))
  // .use('/', express.static(path.join(__dirname, '/hackernews/build')))

  // .use(express.static(path.join(__dirname, 'public')))//模板的资源文件 可删除
  // .use('/Apps', express.static(path.join(__dirname, 'ipad/Apps')))
  // .set('views', path.join(__dirname, 'views'))//模板的网页文件
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))//模板的网页文件
  // .get('/cool', (req, res) => res.send(cool()))//测试
  // .get('/status', (req, res) => res.send('packager-status:running'))
  // .get('/index.ios.bundle', (req, res) => {
  // 	fs.readFile(path.join(__dirname, 'index.ios.jsbundle'), 'utf-8', (err, data) => {
  // 		res.header('Content-Type', 'application/javascript');
	 //    if (err) {
	 //        console.log(err);
	 //    } else {
	 //        res.send(data);
	 //    }
	 // })
  // })
  // .get('/currency/index.ios.bundle', (req, res) => {
  //   fs.readFile(path.join(__dirname, 'currency/index.ios.jsbundle'), 'utf-8', (err, data) => {
  //     res.header('Content-Type', 'application/javascript');
  //     if (err) {
  //         console.log(err);
  //     } else {
  //         res.send(data);
  //     }
  //  })
  // })

   // .all('*', function(req, res, next){
   //   res.header("Content-Type", "application/json;charset=utf-8");
   //   next()
   // })


// req.params
// GET /hello/fred/0926xxx572

// app.get('/hello/:name/:tel', function(req, res) {
//     console.log(req.params.name);
//     console.log(req.params.tel);
// });

require('./hotUpdate')