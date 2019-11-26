/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import webpack from 'webpack'
import * as path from 'path'

import configure from '../configure'

//TODO
export const RNWXLIBMaps = {
    "react": "@areslabs/wx-react",
    "react-native": "@areslabs/wx-react-native",
    "prop-types": "@areslabs/wx-prop-types",
    "@areslabs/router": "@areslabs/wx-router",

    /* 官方支持库*/
    'moment': "@areslabs/wx-moment",
    'redux': "@areslabs/wx-redux",
    'react-redux': "@areslabs/wx-react-redux",
    'redux-actions': "@areslabs/wx-redux-actions",
    'redux-promise': "@areslabs/wx-redux-promise",
    'redux-thunk': "@areslabs/wx-redux-thunk",
    'mobx-react': "@areslabs/wx-mobx-react",
    'mobx': "@areslabs/wx-mobx"
}

const defaultAlias = {
    'react': '@areslabs/wx-react',
    'react-native': '@areslabs/wx-react-native',
    'prop-types': '@areslabs/wx-prop-types',
    '@areslabs/router': '@areslabs/wx-router',
}

const defaultPlugins = []

const defaultRules = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
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
            }
        ]
    },
]

export default function packByWebpack() {

    const cco = configure.configObj

    let resolve = null
    if (cco.resolve) {
        resolve = {
            alias: {
                defaultAlias,
                ...(cco.resolve.alias || {})
            },
            extensions: ['.wx.js', '.js', '.jsx', '.json'],
            mainFields: ['weixin', 'browser', 'module', 'main'],
            ...cco.resolve
        }
    } else {
        resolve = {
            alias: defaultAlias,
            extensions: ['.wx.js', '.js', '.jsx', '.json'],
            mainFields: ['weixin', 'browser', 'module', 'main']
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

        devtool: 'none',

        plugins: [
            ...defaultPlugins,
            ...(cco.plugins || [])
        ],

        resolve,

        module,
    }

    configure.alias = webpackConfigure.resolve.alias
    const compiler = webpack(webpackConfigure)
    compiler.run((err, stats) => {
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
        }
    })
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