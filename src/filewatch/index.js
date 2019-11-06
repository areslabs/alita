/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import addFile from './addFile'
import unlinkFile from './unlinkFile'
import unlinkDir from './unlinkDir'
import changeFile from './changeFile'

const chokidar = require('chokidar')
const events = require('events');
// 创建 eventEmitter 对象
const eventEmitter = new events.EventEmitter();

const DONE_EVENT = 'DONE_EVENT'


const ignoreDics = [
    'node_modules',
    '.git',
    '.expo',
    'android',
    'ios',
    '.idea',
    '__tests__',
    '.vs_code',
    '.iml'
]

const ignoreFilesSufix = [
    '.ios.js',
    '.ios.jsx',
    '.ios.ts',
    '.ios.tsx',
    '.android.js',
    '.android.jsx',
    '.android.ts',
    '.android.tsx',
    '.web.js',
    '.web.jsx',
    '.web.ts',
    '.web.tsx',

    '.sh',
    'alita.config.js',
    'babel.config.js',
    'metro.config.js',
    '.gitignore',
    'app.json',
    'package.json',
    'package-lock.json',
    '.eslintrc.js',
    '.eslintrc',
    'yarn.lock',
    '.test.js',
    '.watchmanconfig',
    '.buckconfig',
    '.flowconfig',
    '.gitattributes',
    '.babelrc'
]

function isInIgnoreDic(path) {
    let fPath = path
    if (path.endsWith('/')) {
        fPath = path.substring(0, path.length - 1)
    }
    for(let i = 0; i < ignoreDics.length; i ++ ) {
        const ignoreDic = ignoreDics[i]

        if (fPath.endsWith(`/${ignoreDic}`)) {
            return true
        }

        if (fPath.includes(`/${ignoreDic}/`)) {
            return true
        }
    }

    return false
}

function isIgnoreSufix(path) {
    return ignoreFilesSufix.some(sufix => path.endsWith(sufix))
}

export default (ignored) => {
    const {INPUT_DIR, watchMode, tranComp} = global.execArgs

    const fileSet = new Set([])
    const watcher = chokidar.watch(INPUT_DIR,
        {
            persistent: watchMode,
            ignored: function(path) {
                const finalPath = path.replace(/\\/g, '/') // windows 路径处理


                if (isInIgnoreDic(finalPath)) {
                    return true
                }

                if (isIgnoreSufix(finalPath)) {
                    return true
                }


                const {INPUT_DIR, configObj} = global.execArgs
                const relativePath = finalPath.replace(INPUT_DIR, '')
                // 如果文件需要忽略， 则不处理
                if (typeof configObj.isFileIgnore === "function" && configObj.isFileIgnore(relativePath)) {
                    return true
                }


                return false
            },
            interval: 200
        })

    watcher
        .on('add', async (path) => {
            fileSet.add(path)
            const allFilepaths = await addFile(path)
            fileSet.delete(path)

            if (fileSet.size === 0) {
                eventEmitter.emit(DONE_EVENT)
            }
        })
        .on('change', async path => {
            changeFile(path)
        })
        .on('unlink', async path => {
            unlinkFile(path)
        })
        .on('unlinkDir', async dir => {
            unlinkDir(dir)
        })
        .on('ready', () => {
            eventEmitter.once(DONE_EVENT, () => {

                if (tranComp) {
                    successCompLog()
                } else {
                    successLog()
                }

                if (watchMode) {
                    console.log(`监听文件修改...`.info)
                }
            })
        })
}

function successLog() {
    const {outdir} = global.execArgs
    console.log('')
    console.log('编译完成，Run instructions for 小程序:'.info)
    console.log(`  • cd ${outdir}`.black)
    console.log(`  • npm install`.black)
    console.log(`  • 开发者工具从 ${outdir} 导入项目`.black)
    console.log(`  • 从开发者工具构建npm： 工具 --> 构建npm`.black)
    console.log(`    • 由于构建npm在导入项目之后，可能会出现找不到包的错误，此时需要重启开发者工具，或者重新导入项目`.info)
    console.log('')
}

function successCompLog() {
    const {outdir} = global.execArgs
    console.log('')
    console.log('编译完成:'.info)
    console.log(`  • cd ${outdir}`.black)
    console.log(`  • npm publish`.black)
    console.log(`  • 其他项目要使用这个npm包的时候， 需要正确配置其 alita.config.js`.black)
    console.log('')
}

