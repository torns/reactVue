const path = require('path');

module.exports = {
    devStaticPort: 3000,
    distDir: path.resolve(__dirname, 'dist'),
    assetsFile: path.resolve(__dirname, 'webpack-assets.json')
};