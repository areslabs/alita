/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path'
import * as webpack from 'webpack'
import * as fse from 'fs-extra'
import {geneReactCode} from '../util/uast'
import jsxTran from '../tran/index'
import {miscNameToJSName} from "../util/util";
import {LoaderTmpResult} from './interfaces'

import configure from '../configure'

import {getFiles, setFiles} from '../util/cacheCompExtraFiles'


export default function (this: webpack.loader.LoaderContext,
                         {ast, isEntry, isRF, isFuncComp} : LoaderTmpResult ): string {

    const filepath = this.resourcePath
    const {entryFullpath, allCompSet, dev} = configure

    let finalCode: string = null
    let allGeneFiles: Set<string> = null

    if (filepath === entryFullpath) {
        // nothing
        finalCode = geneReactCode(ast)

        allGeneFiles = new Set<string>()
    } else if (isRF) {
        const jsxResult = jsxTran(ast, filepath, isFuncComp, isPageComp(filepath, allCompSet), this)
        finalCode = jsxResult.code
        allGeneFiles = jsxResult.allFiles
    } else {
        finalCode = geneReactCode(ast)

        allGeneFiles = new Set<string>()
    }

    console.log(`处理完成：${filepath.replace(configure.inputFullpath, '')} !`.info)

    if (dev) {
        removeUselessFiles(filepath, allGeneFiles)
    }

    return finalCode
}

function isPageComp(filepath:string, allCompSet: Set<any>): boolean {
    const originPath = miscNameToJSName(filepath)
        .replace(configure.inputFullpath + path.sep, '')
        .replace('.js', '')
        .replace(/\\/g, '/') // 考虑win平台
    return allCompSet.has(originPath)
}

/**
 * dev watch 模式下，删除无用小程序文件
 * @param filepath
 * @param allGeneFiles
 */
function removeUselessFiles(filepath, allGeneFiles) {
    const oldFiles = getFiles(filepath)
    setFiles(filepath, allGeneFiles)

    if (!oldFiles || oldFiles.size === 0) {
        return
    }

    oldFiles.forEach(item => {
        if (!allGeneFiles.has(item)) {
            fse.removeSync(item)
        }
    })
}
