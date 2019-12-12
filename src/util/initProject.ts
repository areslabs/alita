/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path'
import fse from 'fs-extra'
import child_process from 'child_process'

import chalk from 'chalk'

import configure from '../configure'


export default function initProject(operands, typescript) {
    console.log(`  alita init ${typescript ? 'typescript': ''} ...`.info)
    const initIndex = operands.indexOf('init')
    const projectName = operands[initIndex + 1]

    if (!projectName) {
        console.log('alita初始化 请指定项目名！'.error)
        return
    }

    const targetpath = path.resolve(projectName)

    const tempDir = path.resolve(__dirname, '..', '..', typescript ? 'rn-typescript-template' : 'rn-template')
    fse.copySync(tempDir, targetpath)

    const appJSPath = path.resolve(targetpath, 'App.js')
    if (fse.existsSync(appJSPath)) {
        fse.unlinkSync(appJSPath)
    }


    const initProPackages = ` @areslabs/router @areslabs/wx-animated `
    const initProDevPackages = ` ${typescript ? '@types/react-native': ''} @areslabs/alita-weixin-runtime `

    if (fse.existsSync(path.resolve(targetpath, 'yarn.lock'))) {
        child_process.execSync(`yarn add ${initProPackages}`, {
            cwd: targetpath,
            stdio: "ignore",
        })
        child_process.execSync(`yarn add ${initProDevPackages} --dev`, {
            cwd: targetpath,
            stdio: "ignore",
        })
    } else {
        child_process.execSync(`npm install --save ${initProPackages}`, {
            cwd: targetpath,
            stdio: "ignore",
        })
        child_process.execSync(`npm install --save-dev ${initProDevPackages}`, {
            cwd: targetpath,
            stdio: "ignore",
        })
    }

    console.log(`${chalk.blue(`  Run instructions for ${chalk.bold('小程序')}`)}:
    • cd ${projectName}
    • alita --dev [--dev 指定开发模式]
    • 微信开发者工具从 wx-dist 导入项目
`)
}