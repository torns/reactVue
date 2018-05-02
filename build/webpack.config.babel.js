const devConfig = require('./webpack.config.dev');
const productConfig = require('./webpack.config.product');
const {argv} = require('yargs');
const config = argv.dev ? devConfig : productConfig;
module.exports = config;