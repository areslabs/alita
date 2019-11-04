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
import { getDependenciesMap, getRNCompList, emptyDir, buildDefaultDependencies } from './util/util'
import packagz from '../package.json'
import filewatch from './filewatch/index'
import geneWXFileStruc from './util/geneWXFileStruc'
import getExtCompPathMaps from './util/getExtCompPathMaps'
import analyzingDependencies from './util/analyzingDependencies'
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

    /**
     * deprecated
     */
    dependenciesMap: getDependenciesMap('^1.0.0'),
    extCompLibs: [
        {
            name: 'react-native',
            compDir: 'component',
            compLists: getRNCompList()
        }
    ],
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

const OUT_DIR = path.resolve(options.outdir, options.component ? 'miniprogram_dist': '')

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

    if (userConfig.dependenciesMap || userConfig.extCompLibs) {
        console.log('\ndependenciesMap, extCompLibs配置项已经弃用！！！请使用dependencies替代，详情请参考文档。 \n'.warn)
    }

    configObj = {
        ...DEFAULTCONFIG,
        ...userConfig,

        /**
         * deprecated
         */
        dependenciesMap: {
            ...DEFAULTCONFIG.dependenciesMap,
            ...(userConfig.dependenciesMap || {})
        },
        extCompLibs: [
            ...DEFAULTCONFIG.extCompLibs,
            ...(userConfig.extCompLibs || [])
        ]
    }

    if (userConfig.dependencies) {
        configObj.dependencies = [
            ...(buildDefaultDependencies('^1.0.0')),
            ...userConfig.dependencies
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

    if (configObj.dependencies) {
        const {
            dependenciesMap,
            extCompPathMaps,
            extChildComp,
            extReactComp,
            allBaseComp,
            textComp,
            jsxPropsMap
        } = analyzingDependencies(configObj.dependencies)

        // rn npm和wx npm包名映射
        global.execArgs.dependenciesMap = dependenciesMap

        // wx 组件名和路径的映射，方便生成小程序自定义组件的json文件
        global.execArgs.extCompPathMaps = extCompPathMaps

        // 需要操作children的RN组件，在转化的时候需要特殊处理，参考ScrollTabView
        global.execArgs.extChildComp = extChildComp

        // 所有配置在compLists，继承自非RNBaseComponent的组件，包括FlatList等
        global.execArgs.extReactComp = extReactComp

        // 所以继承RNBaseComponent的组件
        global.execArgs.allBaseComp = allBaseComp

        // 直接包裹文字的组件，需要特殊处理
        global.execArgs.textComp = textComp

        // 属性传递JSX的情况，需要特殊处理，参考FlatList的renderItem属性
        global.execArgs.jsxPropsMap = jsxPropsMap

        // 生成微信目录结构
        geneWXFileStruc(OUT_DIR, options.component)

        // 生成微信package.json文件
        geneWXPackageJSON(options.wxName, dependenciesMap)
    } else {
        // deprecated
        global.execArgs = {
            ...global.execArgs,
            ...getExtCompPathMaps(configObj.extCompLibs, configObj.dependenciesMap)
        }

        // 生成微信目录结构
        geneWXFileStruc(OUT_DIR, options.component)

        // 生成微信package.json文件
        geneWXPackageJSON(options.wxName, configObj.dependenciesMap)
    }


    filewatch()
}