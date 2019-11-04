/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import path from 'path'
import fse from 'fs-extra'
import child_process from 'child_process'
import {successInfo} from './util'


export default function initProject(operands) {
    console.log(`alita init ...`.info)
    console.log('\n')
    const initIndex = operands.indexOf('init')
    const projectName = operands[initIndex + 1]

    if (!projectName) {
        console.log('alita初始化 请指定项目名！'.error)
        return
    }

    const targetpath = path.resolve(projectName)

    const tempDir = path.resolve(__dirname, '..', '..', 'rn-template')
    fse.copySync(tempDir, targetpath)

    const appJSPath = path.resolve(targetpath, 'App.js')
    if (fse.existsSync(appJSPath)) {
        fse.unlinkSync(appJSPath)
    }

    const pjsonPath = path.resolve(targetpath, 'package.json')
    const packageObj = fse.readJsonSync(pjsonPath)
    packageObj.dependencies = {
        "@areslabs/router": "^1.0.0",
        "@areslabs/wx-animated": "^1.0.0",
        ...packageObj.dependencies,
    }
    fse.outputJsonSync(pjsonPath, packageObj, {spaces: '  '})

    if (fse.existsSync(path.resolve(targetpath, 'yarn.lock'))) {
        child_process.execSync('yarn add @areslabs/router', {
            cwd: targetpath,
        })
        child_process.execSync('yarn add @areslabs/wx-animated', {
            cwd: targetpath,
        })
    } else {
        child_process.execSync('npm install --save @areslabs/router', {
            cwd: targetpath,
        })
        child_process.execSync('npm install --save @areslabs/wx-animated', {
            cwd: targetpath,
        })
    }

    console.log('  Run instructions for 小程序:'.blue)
    console.log(`    • alita -i ${projectName} -o [目标小程序目录]   （若需要监听文件修改添加参数：--watch）`.black)
}