const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {argv} = require('yargs');
const {getSassLoaderConfig, getEntries, fileMappingPlugin, STATICENV} = require('./utils');
const happypack = require('./happypack');
const hashStr = argv.nohash ? '' : '-[hash:5]';
const conhashStr = argv.nohash ? '' : '-[contenthash:5]';
const {distDir} = require('../config');
const happypackPlugins = Object.keys(happypack).map(plugin => happypack[plugin]);

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: getEntries(),
    output: {
        publicPath: '/zyfbim/dist/',
        path: path.join(distDir, '/'),
        filename: '[name]/bundle-[chunkhash:5].js',
        chunkFilename: 'app/[name]_bundle[id][chunkhash:5].js',
    },
    module: {
        rules: [{
            test: /\.css$/,
            oneOf: [{
                resourceQuery: /l/,
                use: ExtractTextPlugin.extract(`${path.resolve(__dirname, '../node_modules', 'happypack/loader')}?id=css_l`)
            }, {
                use: ExtractTextPlugin.extract(`${path.resolve(__dirname, '../node_modules', 'happypack/loader')}?id=css`)
            }]
        }, {
            test: /\.scss$/,
            oneOf: [{
                resourceQuery: /l/,
                use: ExtractTextPlugin.extract(`${path.resolve(__dirname, '../node_modules', 'happypack/loader')}?id=scss_l`)
            }, {
                use: ExtractTextPlugin.extract(`${path.resolve(__dirname, '../node_modules', 'happypack/loader')}?id=scss`)
            }]
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: `[path][name]${hashStr}.[ext]`,
                    limit: 2048
                }
            }]
        }, {
            test: /\.vue$/,
            use: [{
                loader: 'vue-loader',
                options: {
                    cacheDirectory: true
                }
            }],
            exclude: /node_modules/
        }, {
            test: /\.(ttf|eot|svg|woff|woff2|otf)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: `[path][name]${hashStr}.[ext]`
                }
            }]
        }, {
            test: /\.js$/,
            use: [`${path.resolve(__dirname, '../node_modules', 'happypack/loader')}?id=js`],
            exclude: /node_modules/
        }, {
            test: /\.html$/,
            use: [`${path.resolve(__dirname, '../node_modules', 'happypack/loader')}?id=html`]
        }]
    },
    resolve: {
        modules: ['src/components', 'src/lib', 'node_modules'],
        extensions: ['.js', '.vue'],
        alias: {'vue': 'vue/dist/vue.js'}
    },
    resolveLoader: {
        modules: ['node_modules'],
        mainFields: ['loader', 'main']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
            'STATICENV': JSON.stringify(STATICENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin({filename: `[name]/bundle${conhashStr}.css`, allChunks: true}),
        ...happypackPlugins,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        fileMappingPlugin
    ]
};
