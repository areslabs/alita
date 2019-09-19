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

export default (ignored) => {
    const {INPUT_DIR, watchMode} = global.execArgs

    const fileSet = new Set([])
    const watcher = chokidar.watch(INPUT_DIR,
        {
            persistent: watchMode,
            ignored,
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
                if (watchMode) {
                    successLog()
                    console.log(`监听文件修改...`.info)
                } else {
                    successLog()
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
    console.log(`    • 由于构建npm在导入项目之后，可能会出现找不到包的错误，此时需要重启开发者工具，或者重新导入项目`.warn)
    console.log('')
}