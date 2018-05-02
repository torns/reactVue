const Koa = require('koa');
 const cors = require('koa-cors');
 const webpack = require('webpack');
 const path = require('path');
 const fs = require('fs');
 const serveMiddlware = require('koa-static');
 const router = require('koa-router');
 const devMiddleware = require('koa-webpack-dev-middleware');
 const hotMiddleware = require('koa-webpack-hot-middleware');
 const config = require('./webpack.config.babel');
 const {argv} = require('yargs');
 const Handlebars = require('handlebars');
 const {devStaticPort} = require('../config');
 
 const app = new Koa();
 const routerMiddleware = router();
 const compiler = webpack(config);
 
 routerMiddleware.get('*/bundle.css*', function() {
     this.type = '.css';
     this.body = '';
 });
 
 routerMiddleware.get('/index.html', function(next) {
     this.type = '.html';
     const assets = require(require('../config').assetsFile);
     const source = fs.readFileSync(path.resolve(__dirname, '../index.html')).toString();
     const template = Handlebars.compile(source);
     const getBundle = key => {
         if (argv.dev) {
             return `//localhost:${devStaticPort}${key}`;
         } else {
             return `//localhost:${devStaticPort}${assets[key]}`;
         }
     };
     Handlebars.registerHelper('getBundle', getBundle);
     this.body = template();
 });
 
 app.use(routerMiddleware.routes());
 app.use(cors({
 	credentials: true
 }));
 app.use(devMiddleware(compiler, {
     publicPath: '/',
     hot: true
 }));
 app.use(hotMiddleware(compiler));
 app.listen(devStaticPort, function() {
 	console.log(`listen at http://localhost:${devStaticPort}`);
 });
