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

import configure from '../configure'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultAlias = {
    'react': '@areslabs/wx-react',
    'react-native': '@areslabs/wx-react-native',
    'prop-types': '@areslabs/wx-prop-types',
    '@areslabs/router': '@areslabs/wx-router',

    // 由于hoc的差异，hoc需要使用alita专用的
    'mobx-react': "@areslabs/wx-mobx-react",
    'react-redux': "@areslabs/wx-react-redux",

    // 处于包大小的考虑，内置处理
    'redux-promise': "@areslabs/wx-redux-promise",
}


const defaultRules = [
    {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    plugins: [
                        "@babel/plugin-transform-regenerator",
                        "@areslabs/babel-plugin-alitamisc"
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
    },
]


const mainFields = ['weixin', 'browser', 'module', 'main']
const extensions = ['.wx.js', '.wx.jsx', '.js', '.jsx', '.wx.ts', '.wx.tsx', '.ts', '.tsx', '.json']
export default function packByWebpack() {

    const cco = configure.configObj

    let resolve = null
    if (cco.resolve) {
        resolve = {
            alias: {
                defaultAlias,
                ...(cco.resolve.alias || {})
            },
            extensions,
            mainFields,
            ...cco.resolve
        }
    } else {
        resolve = {
            alias: defaultAlias,
            extensions,
            mainFields,
        }
    }

    let module = null
    if (cco.module) {
        module = {
            rules: {
                ...defaultRules,
                ...(cco.module.rules || [])
            },
            ...cco.module,
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
        }),

        // react-native 全局可以使用的变量
        new webpack.ProvidePlugin({
            fetch: ['react-native', 'fetch'],
            alert: ['react-native', 'alert'],
            requestAnimationFrame: ['react-native', 'requestAnimationFrame'],
            cancelAnimationFrame: ['react-native', 'cancelAnimationFrame'],
            "_ARR": "@areslabs/regenerator-runtime"
        }),
        ...(cco.plugins || [])
    ]
    if (configure.analyzer ) {
        plugins.push(new BundleAnalyzerPlugin())
    }


    const webpackConfigure = {
        entry: cco.entry,

        output: {
            path: path.resolve(cco.output),
            filename: '_rn_.js'
        },

        mode: configure.dev ? 'development' : 'production',
        optimization: {
            usedExports: true,
        },

        devtool: configure.dev ? 'source-map' : "none",

        plugins,

        resolve,

        module,
    } as webpack.Configuration

    configure.alias = webpackConfigure.resolve.alias
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