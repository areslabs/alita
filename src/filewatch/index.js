/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import addFile from './addFile'
const chokidar = require('chokidar')

export default (ignored) => {
    const {INPUT_DIR, watchMode} = global.execArgs
    console.log('watchMode:', watchMode)

    const watcher = chokidar.watch(INPUT_DIR,
        {
            persistent: false,
            ignored,
        })

    watcher.on('add', async (path) => {
        const files = await addFile(path)
        console.log(path, ' ok! 生成:', files)
    })
}