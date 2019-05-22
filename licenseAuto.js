
const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')

const watcher = chokidar.watch('./packages',
    {
        persistent: false,
        ignored: /node_modules|doc|mptemp|examples|lib|static/
    })
watcher.on('add', (filepath) => {
    if (!filepath.endsWith('.js')) return
    if (filepath === '.eslintrc.js' || filepath === 'jest.config.js' || filepath === 'licenseAuto.js') return

    if (filepath.indexOf('miniprogram_dist') === -1) return
    console.log('filepath:', filepath)
    //return


    path.resolve(filepath)
    fs.readFile(filepath, (err, data) => {
        if (err) {
            return console.error(err);
        }

        const newCode = `/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
${data.toString()}`

       fs.writeFile(filepath, newCode, () => {

       })
    })

})



