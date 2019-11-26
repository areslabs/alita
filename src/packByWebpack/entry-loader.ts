/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as webpack from 'webpack'
import handleEntry from '../struc/handleEntry'
import configure from '../configure'

import {LoaderTmpResult} from './interfaces'

/**
 * 入口文件 特别处理，产生app.json ,app.js 等文件
 * @param {LoaderTmpResult} context
 * @returns {LoaderTmpResult}
 */
export default function (this: webpack.loader.LoaderContext, context: LoaderTmpResult) : LoaderTmpResult{
    const filepath = this.resourcePath
    const entryFullpath = configure.entryFullpath

    if (filepath === entryFullpath) {
        if (!context.isEntry) {
            console.log(`入口文件必须使用 @areslabs/router 定义页面!`.error)
        } else {
            const {entryAst, allCompSet} = handleEntry(context.ast, filepath, this)

            configure.allCompSet = allCompSet
            context.ast = entryAst
        }
    }

    return context
}
