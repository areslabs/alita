/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import webpack from 'webpack'
import * as path from 'path'
import CopyPlugin from 'copy-webpack-plugin'

import WatchModuleUpdatedPlugin from './WatchModuleUpdatedPlugin'
import ExtractImageFilesPlugin from './ExtractImageFilesPlugin'

import configure from '../configure'
import miniprogramTarget from  './miniprogramTarget'

import {wxBaseComp} from '../constants'

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultAlias = {
    'react': '@areslabs/wx-react',
    'react-native': '@areslabs/wx-react-native',
    'prop-types': '@areslabs/wx-prop-types',

    // 由于hoc的差异，hoc需要使用alita专用的
    'mobx-react': "@areslabs/wx-mobx-react",
    'react-redux': "@areslabs/wx-react-redux",

    // 处于包大小的考虑，内置处理
    'redux-promise': "@areslabs/wx-redux-promise",
}





const mainFields = ['weixin', 'browser', 'module', 'main']
const extensions = ['.wx.js', '.wx.jsx', '.js', '.jsx', '.wx.ts', '.wx.tsx', '.ts', '.tsx', '.json']
const MagicNumber = 1000000
export default function packByWebpack() {

    const mpComps = new Set(wxBaseComp)
    const mpKeys = Object.keys(configure.configObj.miniprogramComponents)
    mpKeys.forEach(key => mpComps.add(key))

    const alitaHandleRule =  {
        test: /\.[jt]sx?$/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    plugins: [
                        "@babel/plugin-transform-regenerator",
                        ["@areslabs/babel-plugin-alitamisc",
                            {
                                stringComps: mpComps
                            }
                        ]
                    ]
                }
            },
            {
                loader: path.resolve(__dirname, 'jsx-loader.js'),
            },
            {
                loader: path.resolve(__dirname, 'entry-loader.js'),
            },
            {
                loader: path.resolve(__dirname, 'base-loader.js'),
            },
            {
                loader: path.resolve(__dirname, 'precheck-loader.js')
            },
            {
                loader: path.resolve(__dirname, 'gatherInfo-loader.js')
            }
        ]
    } as any

    const defaultRules = [
        alitaHandleRule
    ]

    const cco = configure.configObj

    let resolve = null
    if (cco.resolve) {
        resolve = {
            ...cco.resolve,

            alias: {
                ...defaultAlias,
                ...(cco.resolve.alias || {})
            },
            extensions: [...extensions, ...(cco.resolve.extensions || [])],
            mainFields: [...mainFields, ...(cco.resolve.mainFields || [])]
        }
    } else {
        resolve = {
            alias: defaultAlias,
            extensions,
            mainFields,
        }
    }

    if (cco.exclude) {
        alitaHandleRule.exclude = cco.exclude
    }

    if (cco.include) {
        alitaHandleRule.include = cco.include
    }

    // default
    if (!cco.include && ! cco.exclude) {
        alitaHandleRule.exclude = /node_modules/
    }

    let module = null
    if (cco.module) {
        module = {
            ...cco.module,
            rules: [
                ...defaultRules,
                ...(cco.module.rules || [])
            ],
        }
    } else {
        module = {
            rules: defaultRules
        }
    }

    const plugins = [
        new CopyPlugin([
            {
                from: path.resolve(__dirname, "..", "..", 'mptemp'),
                to: configure.outputFullpath
            },
        ]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': configure.dev ? '"development"' : '"production"',
            'global': 'wx'
        }),

        // react-native 全局可以使用的变量
        new webpack.ProvidePlugin({
            fetch: ['react-native', 'fetch'],
            alert: ['react-native', 'alert'],
            requestAnimationFrame: ['react-native', 'requestAnimationFrame'],
            cancelAnimationFrame: ['react-native', 'cancelAnimationFrame'],
            "_ARR": "@areslabs/regenerator-runtime",
        }),

        new WatchModuleUpdatedPlugin(),

        new ExtractImageFilesPlugin(),

        ...(cco.plugins || [])
    ]
    if (configure.analyzer ) {
        plugins.push(new BundleAnalyzerPlugin())
    }


    const webpackConfigure = {
        entry: {
            "_rn_": cco.entry
        },
        context: configure.inputFullpath,

        output: {
            path: path.resolve(cco.output),
            filename: '[name].js'
        },

        mode: configure.dev ? 'development' : 'production',

        target: miniprogramTarget,

        optimization: {
            usedExports: true,

            splitChunks: {
                chunks: 'async',
                minSize: 1,
                maxSize: 0,
                minChunks: MagicNumber,
                maxAsyncRequests: MagicNumber,
                maxInitialRequests: MagicNumber,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        minChunks: MagicNumber,
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: MagicNumber,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                }
            }
        },

        //TODO
        devtool: configure.dev ? 'cheap-source-map' : "none",

        plugins,

        resolve,

        module,


        // 当alita使用的loader和项目中依赖冲突时，比如项目中有多个babel-loader， alita需要取到自己的那一个
        resolveLoader: {
            modules: [path.resolve('node_modules', '@areslabs',  'alita-core', 'node_modules'), 'node_modules'],
        }
    } as webpack.Configuration

    configure.resolve = webpackConfigure.resolve
    // 把webpackConfigure 暴露出来， 方便其他地方获取此configure
    // TODO 使用webpack的获取方式？
    configure.webpackConfigure = webpackConfigure

    const compiler = webpack(webpackConfigure)


    if (configure.dev) {
        compiler.watch({
            aggregateTimeout: 300,
        } ,watchCb)
    } else {
        compiler.run(runCb)
    }
}

function runCb(err, stats) {
    const info = stats.toJson();

    if (stats.hasWarnings()) {
        info.warnings.forEach(err => {
            handleWarning(err)
        })
    }

    if (stats.hasErrors()) {
        info.errors.forEach(err => {
            handleError(err)
        })
    } else {
        console.log('\n编译完成'.info)
    }
}

function watchCb(err, stats) {
    const info = stats.toJson();

    if (stats.hasWarnings()) {
        info.warnings.forEach(err => {
            handleWarning(err)
        })
    }

    if (stats.hasErrors()) {
        info.errors.forEach(err => {
            handleError(err)
        })
    } else {
        console.log(`\n编译完成, 监听文件...`.info)
    }

}

function handleError(message) {

    console.log(message.error)
    //const mess = message.split('\n')
    //return console.log(`${mess[0]} ${mess[3]}\n${mess[4]}`.error)
}

function handleWarning(message) {
    console.log(message.warning)
    /*const mess = message.split('\n')
    return console.log(`${mess[0]} ${mess[3]}\n${mess[4]}`.warning)*/
}