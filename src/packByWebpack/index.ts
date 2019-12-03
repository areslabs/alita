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

const defaultAlias = {
    'react': '@areslabs/wx-react',
    'react-native': '@areslabs/wx-react-native',
    'prop-types': '@areslabs/wx-prop-types',
    '@areslabs/router': '@areslabs/wx-router',

    // 由于hoc的差异，hoc需要使用alita专用的
    'mobx-react': "@areslabs/wx-mobx-react",
    'react-redux': "@areslabs/wx-react-redux",
}

const defaultPlugins = []

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

        plugins: [
            ...defaultPlugins,
            ...(cco.plugins || [])
        ],

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
        successLog()
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

function successLog() {
    console.log('')
    console.log('编译完成'.info)
    console.log(`  • cd ${configure.configObj.output}`.black)
    console.log(`  • 开发者工具从 ${configure.configObj.output} 导入项目`.black)
    console.log('')
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