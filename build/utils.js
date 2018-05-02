const fs = require('fs');
const path = require('path');
const ip = require('ip');
const localIp = ip.address();
const {argv} = require('yargs');
const {devStaticPort} = require('../config');

const root = path.resolve(__dirname, '../src/');

exports.getSassLoaderConfig = (env = 'dev') => {
    const sourceMap = env === 'dev' ? true : false;
    const cacheDirectory = env === 'dev' ? undefined : path.resolve(__dirname, '.cache--happypack');
    const localIdentName = env === 'dev' ? '[path]_[name]__[local]___[hash:base64:5]' : '[hash:base64:8]';
    const styleLoader = {
        loader: 'style-loader',
        options: {
            sourceMap,
            cacheDirectory
        }
    };
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap,
            cacheDirectory
        }
    };
    const cssModuleLoader = {
        loader: 'css-loader',
        options: {
            modules: true,
            camelCase: true,
            localIdentName,
            sourceMap,
            importLoaders: 3,
            cacheDirectory
        }
    };
    const sassLoader = {
        loader: 'sass-loader',
        options: {
            includePaths: path.resolve(root, 'style'),
            cacheDirectory
        }
    };
    return {styleLoader, cssLoader, cssModuleLoader, sassLoader};
};

const getCustomAppDirs = () => {
    const apps = require('../customPages');
    if (apps && apps.length) {
        return argv.dev ? apps : undefined;
    }
};

exports.getEntries = () => {
    const hmr = `webpack-hot-middleware/client?path=http://${localIp}:${devStaticPort}/__webpack_hmr&reload=true;`;
    const commonEntry = argv.dev ? [path.resolve(root, 'common/app.js'), hmr] : path.resolve(root, 'common/app.js');
    const entries = {common: commonEntry};
    const customAppDirs = getCustomAppDirs();
    const appDirs = customAppDirs ? customAppDirs : fs.readdirSync(path.resolve(root, 'app'));
    return appDirs.reduce((entries, dir) => {
        const entry = path.resolve(root, 'app', dir, 'app.js');
        if (fs.existsSync(entry)) {
            const appEntry = argv.dev ? [entry, hmr] : entry;
            entries[`app/${dir}`] = appEntry;
        }
        return entries;
    }, entries);
};

exports.fileMappingPlugin = function () {
    this.plugin('done', function (stats) {
        const output = {};
        let assetsByChunkName = stats.toJson().assetsByChunkName;

        for (let chunkName in assetsByChunkName) {
            let chunkValue = assetsByChunkName[chunkName],
                mainPath = '/';

            // Webpack outputs an array for each chunkName when using sourcemaps and some plugins
            if (chunkValue instanceof Array) {
                for (let i = 0; i < chunkValue.length; i++) {
                    let asset = chunkValue[i];
                    let originalPath = asset.replace(/-[0-9a-z]+\./i, '.');
                    output[mainPath + originalPath] = mainPath + asset;
                }
            } else {
                let originalPath = chunkValue.replace(/-[0-9a-z]+\./i, '.');
                output[mainPath + originalPath] = mainPath + chunkValue;
            }
        }
        fs.writeFileSync(
            require('../config').assetsFile,
            JSON.stringify(output)
        );
    })
};

exports.STATICENV = process.env.STATICENV || 'pro';