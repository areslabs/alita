/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as npath from 'path'
import * as webpack from 'webpack';
import basetran from '../basetran'
import {getFileInfo, parseCode} from '../util/uast'
import {getCompInfos} from '../util/getAndStorecompInfos'

import {LoaderTmpResult} from './interfaces'

/**
 * 基本js文件的loader，处理小程序和RN环境的一些差异
 * @param context
 */

export default function (this: webpack.loader.LoaderContext, context: string): LoaderTmpResult {

    const filepath = this.resourcePath

    const ast = parseCode(context, npath.extname(filepath))
    const {isEntry, isRF, isFuncComp} = getFileInfo(ast)

    if (isRF && !isEntry) {
        getCompInfos(ast, filepath)
    }

    const newAst = basetran(ast, filepath, this)


    return {
        ast: newAst,
        isEntry,
        isRF,
        isFuncComp,
    }
}
