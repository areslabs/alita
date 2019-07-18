#!/usr/bin/env node
/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import path from 'path'
import getopts from 'getopts'
import colors from 'colors'
import fse from 'fs-extra'
import {getDependenciesMap, getRNCompList, emptyDir} from './util/util'
import packagz from '../package.json'
import filewatch from './filewatch/index'
import geneWXFileStruc from './util/geneWXFileStruc'
import getExtCompPathMaps from './util/getExtCompPathMaps'
import geneWXPackageJSON from './util/geneWXPackageJSON'

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

const options = getopts(process.argv, {
    alias: {
        o: "outdir",
        i: "inputdir",
        w: 'watch',
        v: 'version',
        config: 'config',
        beta: 'beta',
        comp: 'component'
    },
})


const DEFAULTCONFIG = {
    name: '需要一个名字！',
    appid: '',


    isFileIgnore: () => false,

    subDir: '/',

    packageJSONPath: './package.json',
    dependenciesMap: getDependenciesMap('^1.0.0'),

    extCompLibs: [
        {
            name: 'react-native',
            compDir: 'component',
            compLists: getRNCompList()
        }
    ]
}

if (options.version) {
    console.log(packagz.version)
    process.exit()
}

if (!options.inputdir) {
    console.log('input dir must exists， check your -i argument'.error)
    process.exit()
}
const INPUT_DIR = path.resolve(options.inputdir)
if (!fse.existsSync(INPUT_DIR)) {
    console.log(`输入目录不存在！`.error)
    process.exit()
}

if (!options.outdir) {
    console.log('output dir must exists， check your -o argument'.error)
    process.exit()
}
const OUT_DIR = path.resolve(options.outdir)

console.log(`输入目录: ${INPUT_DIR}`.info)
console.log(`输出目录: ${OUT_DIR}`.info)

if (fse.existsSync(OUT_DIR)) {
    emptyDir(OUT_DIR, new Set([
        'miniprogram_npm',
        'node_modules',
        'project.config.json'
    ]))
    console.log('输出目录清理完成'.info)
}


const CONFIGPATH = path.resolve(INPUT_DIR, options.config || 'alita.config.js')
let configObj = DEFAULTCONFIG

if (fse.existsSync(CONFIGPATH)) {
    console.log('配置文件路径：'.info, CONFIGPATH)
    const userConfig = require(CONFIGPATH)
    configObj = {
        ...DEFAULTCONFIG,
        ...userConfig,
        dependenciesMap: {
            ...DEFAULTCONFIG.dependenciesMap,
            ...(userConfig.dependenciesMap || {})
        },
        extCompLibs: [
            ...DEFAULTCONFIG.extCompLibs,
            ...(userConfig.extCompLibs || [])
        ]
    }
} else {
    console.log('未发现配置文件，将使用默认配置'.info)
}

global.execArgs = {
    INPUT_DIR,
    OUT_DIR,
    watchMode: !!options.watch,
    tranComp: !!options.component,
    configObj,
    beta: options.beta
}

global.execArgs = {
    ...global.execArgs,
    ...getExtCompPathMaps(configObj.extCompLibs)
}

// 生成微信目录结构
geneWXFileStruc(OUT_DIR)

// 生成微信package.json文件
geneWXPackageJSON()

const ignored = /node_modules|\.git|\.expo|android|ios|\.idea|__tests__|.ios\.js|.android\.js|\.web\.js|\.sh|\.iml|\.vs_code|alita\.config\.js|babel\.config\.js|metro\.config\.js|\.gitignore|app\.json|package\.json|package-lock\.json|\.eslintrc\.js|\.eslintrc\.json|\.eslintrc|yarn\.lock|\.test\.js|.watchmanconfig/
filewatch(ignored)