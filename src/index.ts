#!/usr/bin/env node
/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as path from 'path'
import getopts from 'getopts'
import colors from 'colors'
import * as fse from 'fs-extra'
import program from 'commander'
import { emptyDir } from './util/util'
import packagz from '../package.json'
import geneWXFileStruc from './util/geneWXFileStruc'
import initProject from './util/initProject'

import packByWebpack from './packByWebpack'
import conf from './configure'

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
            'alita [--dev] [--watch] [--config=]'
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

program.usage('alita [--dev] [--watch] [--config=]')
program.on('-h', help)
program.on('--help', help)
program
    .version(packagz.version, '-v --version')
    .option('--watch', 'watch files and recompile when they change')
    .option('--config', 'specify configuration file')
    .option('--dev', 'development mode')
    .parse(process.argv)




const options = getopts(process.argv, {
    alias: {
        w: 'watch',
        v: 'version',
        config: 'config',
        dev: 'dev',

        // use with init
        typescript: 'typescript'
    },
})

if (options._.includes('init')) {
    initProject(options._, options.typescript)
    process.exit()
}

conf.dev = !!options.dev

const DEFAULTCONFIG = {
    name: '',
    appid: '',

    entry: './src/index.js',
    output: './wx-dist',

    subDir: '/',
}

const inputFullpath = path.resolve('.')
conf.inputFullpath = inputFullpath

const CONFIGPATH = options.config ?
    path.resolve(options.config)
    : path.resolve(inputFullpath, 'alita.config.js')
let configObj = DEFAULTCONFIG
if (fse.existsSync(CONFIGPATH)) {
    const userConfig = require(CONFIGPATH)
    console.log('配置文件路径：'.info, CONFIGPATH)
    configObj = {
        ...DEFAULTCONFIG,
        ...userConfig,
    }
} else {
    console.log('未发现配置文件，将使用默认配置'.info)
}
conf.configObj = configObj

const entryFullpath = path.resolve(configObj.entry)
conf.entryFullpath = entryFullpath

console.log(`入口文件：${entryFullpath}`.info)
const outputFullpath = path.resolve(configObj.output)
conf.outputFullpath = outputFullpath

console.log(`输出目录: ${outputFullpath}`.info)
if (fse.existsSync(outputFullpath)) {
    emptyDir(outputFullpath, new Set([
        'project.config.json'
    ]))
    console.log('清理完成，构建小程序项目...'.info)
}



function main() {

    //TODO watch

    // 生成微信目录结构
    geneWXFileStruc(conf.outputFullpath)

    packByWebpack()

    //filewatch()
}


main()
