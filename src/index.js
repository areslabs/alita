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
import fse, { exists } from 'fs-extra'
import { getDependenciesMap, getRNCompList, emptyDir } from './util/util'
import packagz from '../package.json'
import filewatch from './filewatch/index'
import geneWXFileStruc from './util/geneWXFileStruc'
import getExtCompPathMaps from './util/getExtCompPathMaps'
import geneWXPackageJSON from './util/geneWXPackageJSON'
import initProject from './util/initProject'
import program from 'commander'

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


/**
 * alita commands
 *    - config
 *    - init
 */
// console.log('Compile ReactNative to WX\n')
const actionMap = {
    i: {
        description: 'transfert ReactNativeProject to WXProject',
        usages: [
            'alita -i inputDir -o outputDir',
            'alita -i inputDir -o outputDir --comp',
            'alita -i inputDir -o outputDir --watch'
        ]
    }
}

function help() {
    console.log('\nExample:')
    Object.keys(actionMap).forEach((action) => {
        actionMap[action].usages.forEach(usage => {
            console.log('  ' + usage)
        });
    });
    console.log('\r')
}

program.usage(`-i <inputDir> -o <outputDir>`)
program.on('-h', help)
program.on('--help', help)
program
    .version(packagz.version, '-v --version')
    .option('--watch', 'watch files and recompile when they change')
    .option('--comp', 'transfer ReactNative Component to WX')
    .option('--config', 'specify configuration file')
    .option('-i', 'specify inputDir')
    .option('-o', 'specify outputDir')
    .parse(process.argv)



// alita 不带参数时
if (!process.argv.slice(2).length) {
    program.outputHelp()
}


const options = getopts(process.argv, {
    alias: {
        o: "outdir",
        i: "inputdir",
        w: 'watch',
        v: 'version',
        config: 'config',
        beta: 'beta',
        comp: 'component',
        wxName: "wxName"
    },
})

if (options._.includes('init')) {
    initProject(options._)
    process.exit()
}

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

function enterI() {
    if (process.argv.indexOf('-i') !== -1) {
        return true
    } else {
        return false
    }
}

function enterO() {
    if (process.argv.indexOf('-o') !== -1) {
        return true
    } else {
        return false
    }
}

if (!enterI() || !enterO()) {
    program.outputHelp()
    process.exit()
}
if (enterI() && !options.inputdir) {
    console.log('input dir must exists， check your -i argument'.error)
    process.exit()
}
const INPUT_DIR = path.resolve(options.inputdir)
if (!fse.existsSync(INPUT_DIR)) {
    console.log(`输入目录不存在！`.error)
    process.exit()
}

if (enterO() && !options.outdir) {
    console.log('output dir must exists， check your -o argument'.error)
    process.exit()
}

if (options.component && !options.wxName) {
    console.log('--comp 需要配合 --wxName使用，来指定wx平台的包名！'.warn)
}

const OUT_DIR = path.resolve(options.outdir, options.component ? 'miniprogram_npm': '')

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


const CONFIGPATH = options.config ?
    path.resolve(options.config)
    : path.resolve(INPUT_DIR, 'alita.config.js')
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
    main()
} else {
    console.log('未发现配置文件，将使用默认配置'.info)
    main()
}

function main() {
    global.execArgs = {
        INPUT_DIR,
        OUT_DIR,
        watchMode: !!options.watch,
        tranComp: !!options.component,
        configObj,
        beta: options.beta,

        outdir: options.outdir
    }

    global.execArgs = {
        ...global.execArgs,
        ...getExtCompPathMaps(configObj.extCompLibs)
    }

    // 生成微信目录结构
    geneWXFileStruc(OUT_DIR, options.component)

    // 生成微信package.json文件
    geneWXPackageJSON(options.wxName)

    const ignored = /node_modules|\.git|\.expo|android|ios|\.idea|__tests__|.ios\.js|.android\.js|\.web\.js|\.sh|\.iml|\.vs_code|alita\.config\.js|babel\.config\.js|metro\.config\.js|\.gitignore|app\.json|package\.json|package-lock\.json|\.eslintrc\.js|\.eslintrc\.json|\.eslintrc|yarn\.lock|\.test\.js|.watchmanconfig/
    filewatch(ignored)
}