const HappyPack = require('happypack');
const path = require('path');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const {getSassLoaderConfig, getEntries} = require('./utils');
const {styleLoader, cssLoader, cssModuleLoader, sassLoader} = getSassLoaderConfig();

const cacheLoader = {
    loader: 'cache-loader',
    options: {
      cacheDirectory: path.resolve(__dirname, '.cache--happypack')
    }
};

exports.js = new HappyPack({
    id: 'js',
    loaders: [cacheLoader, 'babel-loader'],
    threadPool: happyThreadPool,
});

exports.html = new HappyPack({
    id: 'html',
    loaders: [cacheLoader, {
        loader: 'html-loader',
        options: {
            minimize: false,
            removeComments: false,
            removeAttributeQuotes: false,
            conservativeCollapse: false
        }
    }],
    threadPool: happyThreadPool,
});

exports.css = new HappyPack({
    id: 'css',
    loaders: [cacheLoader, cssLoader],
    threadPool: happyThreadPool
});

exports.css_l = new HappyPack({
    id: 'css_l',
    loaders: [cacheLoader, cssModuleLoader],
    threadPool: happyThreadPool
});

exports.scss = new HappyPack({
    id: 'scss',
    loaders: [cacheLoader, cssLoader, sassLoader],
    threadPool: happyThreadPool
});

exports.scss_l = new HappyPack({
    id: 'scss_l',
    loaders: [cacheLoader, cssModuleLoader, sassLoader],
    threadPool: happyThreadPool
});
