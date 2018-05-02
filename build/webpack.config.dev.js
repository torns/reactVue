const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ip = require('ip');
const {argv} = require('yargs');
const {getSassLoaderConfig, getEntries, STATICENV} = require('./utils');
const localIp = ip.address();
const {styleLoader, cssLoader, cssModuleLoader, sassLoader} = getSassLoaderConfig();
const {devStaticPort} = require('../config');

module.exports = {
    devtool: 'cheap-source-map',
    context: path.join(__dirname, '/src'),
    entry: getEntries(),
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name]/bundle.js',
        chunkFilename: 'app/[name]_bundle[id][chunkhash:5].js',
        publicPath: `http://${localIp}:${devStaticPort}/`,
        pathinfo: true
    },
    module: {
        rules: [{
            test: /\.css$/,
            oneOf: [{
                resourceQuery: /l/,
                use: [styleLoader, cssModuleLoader]
            }, {
                use: [styleLoader, cssLoader]
            }]
        }, {
            test: /\.scss$/,
            oneOf: [{
                resourceQuery: /l/,
                use: [styleLoader, cssModuleLoader, sassLoader]
            }, {
                use: [styleLoader, cssLoader, sassLoader]
            }]
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    name: '[path][name].[ext]',
                    limit: 2048
                }
            }]
        }, {
            test: /\.(ttf|eot|svg|woff|woff2|otf)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }]
        },
            {
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }],
            exclude: /node_modules/
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
            test: /\.html$/,
            use: [{
                loader: 'html-loader',
                options: {
                    minimize: false,
                    removeComments: false,
                    removeAttributeQuotes: false,
                    conservativeCollapse: false
                }
            }]
        }]
    },
    resolve: {
        modules: ['src/components', 'src/lib', 'node_modules'],
        extensions: [ '.js', '.vue' ],
        alias: {'vue': 'vue/dist/vue.js'}
    },
    resolveLoader: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'node_modules/@hujiang')
        ],
        mainFields: [ 'loader', 'main' ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'localIp': JSON.stringify(localIp),
            'process.env.NODE_ENV': '"dev"',
            'STATICENV': JSON.stringify(STATICENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin({
            profile: false
        })
    ]
};
