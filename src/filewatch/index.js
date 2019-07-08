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
                    console.log(`转化完成！监听文件修改...`.info)
                } else {
                    console.log('转化完成!'.info)
                }
            })
        })
}