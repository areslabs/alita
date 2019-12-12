/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as path from 'path'
import * as webpack from 'webpack'
import {geneReactCode} from '../util/uast'
import jsxTran from '../tran/index'
import {miscNameToJSName} from "../util/util";
import {LoaderTmpResult} from './interfaces'

import configure from '../configure'



export default function (this: webpack.loader.LoaderContext,
                         {ast, isEntry, isRF, isFuncComp} : LoaderTmpResult ): string {
    const filepath = this.resourcePath
    const {entryFullpath, allCompSet} = configure

    let finalCode: string = null

    if (filepath === entryFullpath) {
        // nothing
        finalCode = geneReactCode(ast)
    } else if (isRF) {
        finalCode = jsxTran(ast, filepath, isFuncComp, isPageComp(filepath, allCompSet), this)
    } else {
        finalCode = geneReactCode(ast)
    }

    console.log(`处理完成：${filepath.replace(configure.inputFullpath, '')}`.info)


    return finalCode
}

function isPageComp(filepath:string, allCompSet: Set<any>): boolean {
    const originPath = miscNameToJSName(filepath)
        .replace(configure.inputFullpath + path.sep, '')
        .replace('.js', '')
        .replace(/\\/g, '/') // 考虑win平台
    return allCompSet.has(originPath)
}

