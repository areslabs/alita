/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from 'fs-extra'
import {getFileInfo, parseCode} from '../util/uast'
import {isStaticRes, base64Encode} from '../util/util'
import handleEntry from './handleEntry'
import handleRF from './handleRF'
import handleBF from './handleBF'

const path = require('path')
const colors = require('colors');


const RFFileList = []
let allCompSet = null
let entryFilePath = null
export default async function (srcpath, targetpath) {
    if (srcpath.indexOf('innerTmpComponent') !== -1) return

    const fsStat = await fse.stat(srcpath)
    if (fsStat.isDirectory()) {
        return
    }

    if (srcpath.endsWith('.js') || srcpath.endsWith('.jsx')) { // js 文件需要处理
        const code = fse.readFileSync(srcpath).toString()
        const ast = parseCode(code)
        //TODO

        const {isEntry, isRF, isFuncComp, isRNEntry, isStatelessComp} = getFileInfo(ast)
        if (isRNEntry) return

        if (isEntry && isRF) { // 入口文件 保证入口文件一定最先处理
            const entryResult  = await handleEntry(ast, targetpath)
            entryFilePath = entryResult.filepath
            allCompSet = entryResult.allCompSet
            for(let i = 0; i<RFFileList.length; i++ ) {
                const {ast, targetpath, srcpath, isFuncComp, isStatelessComp} = RFFileList[i]
                try {
                    await handleRF(ast, targetpath, isFuncComp, entryFilePath, isPageComp(targetpath, allCompSet), isStatelessComp)
                } catch (e) {
                    console.log(colors.error(`tran ${srcpath} error ! reason: `), e)
                }
            }
        } else if (isRF) {
            if (entryFilePath) {
                try {
                    await handleRF(ast, targetpath, isFuncComp, entryFilePath, isPageComp(targetpath, allCompSet), isStatelessComp)
                } catch (e) {
                    console.log(colors.error(`tran ${srcpath} error ! reason: `), e)
                }

            } else {
                RFFileList.push({
                    ast,
                    targetpath,
                    srcpath,
                    isFuncComp,
                    isStatelessComp
                })
            }
        } else {
            await handleBF(ast, targetpath)
        }
    } else { // 其他文件直接copy
        await fse.copy(srcpath, targetpath)
    }
}


export async function geneWXFileStruc(targetpath) {
    const mptempDir = path.resolve(__dirname, '..', '..', 'mptemp')
    await fse.copy(mptempDir, targetpath)
}

/**
 * 程序退出之前的操作
 */
export async function exitStruc() {
    // 没有入口文件
    if (!entryFilePath) {
        for(let i = 0; i< RFFileList.length; i++ ) {
            const {ast, targetpath, srcpath, isFuncComp, isStatelessComp} = RFFileList[i]
            try {
                await handleRF(ast, targetpath, isFuncComp, entryFilePath, false, isStatelessComp)
            } catch (e) {
                console.log(colors.error(`tran ${srcpath} error ! reason: `), e)
            }
        }
        // 以免再次触发 exitStruc
        entryFilePath = "DONE"
    }
}


function isPageComp(targetpath, allCompSet) {
    const originPath = targetpath
        .replace(global.execArgs.OUT_DIR + path.sep, '')
        .replace('.js', '')
        .replace(/\\/g, '/') // 考虑win平台
    return allCompSet.has(originPath)
}