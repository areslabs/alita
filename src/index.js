#!/usr/bin/env node
/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import fse from 'fs-extra'
import {geneWXFileStruc} from './struc/index'
import {getDependenciesMap, getRNCompList, emptyDir} from './util/util'
import packagz from '../package.json'
import filewatch from './filewatch/index'


const path = require('path')
const getopts = require("getopts")
const colors = require('colors')
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

emptyDir(OUT_DIR, new Set([
    'miniprogram_npm',
    'node_modules'
]))
console.log('输出目录清理完成'.info)

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



const {extCompPathMaps, extChildComp, allExtComp, extReactComp, jsxPropsMap} = getExtCompPathMaps(configObj.extCompLibs)

global.execArgs = {
    INPUT_DIR,
    OUT_DIR,
    watchMode: !!options.watch,
    tranComp: !!options.component,
    configObj,
    extCompPathMaps,
    extChildComp,
    allExtComp,
    extReactComp,
    jsxPropsMap,
    beta: options.beta
}

function getExtCompPathMaps(extCompLibs) {
    const extCompPathMaps = {}
    const jsxPropsMap = {}
    const extChildComp = new Set([])
    const extReactComp = new Set([])
    const allExtComp = new Set([])
    for(let i = 0; i < extCompLibs.length; i ++) {
        const extLib = extCompLibs[i]
        const libName = extLib.name
        let compDir = extLib.compDir
        if (!compDir) {
            compDir = '/'
        } else {
            compDir = compDir.charAt(0) !== '/' ? '/' + compDir : compDir
            compDir = compDir.charAt(compDir.length - 1) !== '/' ? compDir + '/' : compDir
        }

        const wxLibName = getWxLibName(libName)

        let compPathMap = {}
        for(let j = 0; j < extLib.compLists.length; j ++) {
            const compName = extLib.compLists[j]
            if (typeof compName === 'string') {
                compPathMap[compName] = `${wxLibName}${compDir}${compName}/index`
                allExtComp.add(compName)
            } else {
                const {name, extendsComponent, needOperateChildren, jsxProps} = compName
                compPathMap[name] = `${wxLibName}${compDir}${name}/index`

                if (needOperateChildren === true) {
                    extChildComp.add(name)
                }

                if (extendsComponent === true) {
                    extReactComp.add(name)
                }

                if (jsxProps) {
                    jsxPropsMap[name] = jsxProps
                }

                allExtComp.add(name)
            }

        }
        extCompPathMaps[libName] = compPathMap
    }
    return {
        extCompPathMaps,
        extChildComp,
        extReactComp,
        allExtComp,
        jsxPropsMap
    }
}

function getWxLibName(libName) {
    const dm = configObj.dependenciesMap
    if (dm[libName] === undefined) {
        return libName
    } else if (typeof dm[libName] === 'string') {
        return dm[libName]
    } else if (Array.isArray(dm[libName])) {
        return dm[libName][0]
    }
}

// 生成微信package.json文件
function geneWXPackgejson(configObj) {
    const packJSONPath = path.resolve(INPUT_DIR, configObj.packageJSONPath)
    console.log('package.json路径：'.info, packJSONPath)
    if (fse.existsSync(packJSONPath)) {
        const pack = JSON.parse(fse.readFileSync(packJSONPath).toString())
        const newPack = {}
        if (!pack.name) {
            console.log('package.json文件缺少name字段'.warn)
        }
        newPack.name = pack.name
        newPack.version = pack.version || '1.0.0'

        global.execArgs.packageName = pack.name || ''

        const allDepKeys = Object.keys(pack.dependencies || {})
        const newDep = {}
        allDepKeys.forEach(depKey => {
            if (configObj.dependenciesMap[depKey] === false) {
                // remove
            } else if (configObj.dependenciesMap[depKey] !== undefined) {
                const newDepValue = configObj.dependenciesMap[depKey]

                if (typeof newDepValue === 'string') {
                    newDep[newDepValue] = pack.dependencies[depKey]
                } else {
                    const [name, version] = newDepValue
                    newDep[name] = version
                }
            }  else {
                newDep[depKey] = pack.dependencies[depKey]
            }
        })
        newPack.dependencies = newDep
        fse.writeFileSync(
            path.resolve(OUT_DIR, 'package.json'),
            JSON.stringify(newPack, null, '\t'),
        )
    } else {
        console.log('请在配置文件指定正确的package.json路径'.error)
        process.exit()
    }
}

async function main() {
    // 生成微信目录结构
    await geneWXFileStruc(OUT_DIR)

    // 生成微信package.json文件
    geneWXPackgejson(configObj)

    const ignored = /node_modules|\.git|\.expo|android|ios|\.idea|__tests__|.ios\.js|.android\.js|\.web\.js|\.sh|\.iml|\.vs_code|alita\.config\.js|babel\.config\.js|metro\.config\.js|\.gitignore|app\.json|package\.json|package-lock\.json|\.eslintrc\.js|\.eslintrc\.json|\.eslintrc|yarn\.lock|\.test\.js|.watchmanconfig/
    filewatch(ignored)
}

main()