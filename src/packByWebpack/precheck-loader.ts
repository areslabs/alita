/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as webpack from 'webpack'
import * as npath from "path"
import {LoaderTmpResult} from "./interfaces"
import {getFileInfo, parseCode} from "../util/uast"

import precheck from '../precheck/index'
import configure from "../configure";

/**
 * 由于alita 并不能对所有JSX写法兼容，所以这里需要预检测
 * @param {string} context
 * @returns {LoaderTmpResult}
 */
export default function (this: webpack.loader.LoaderContext, context: string): LoaderTmpResult {

    const filepath = this.resourcePath

    console.log(`开始处理：${filepath.replace(configure.inputFullpath, '')} ...`.info)
    const ast = parseCode(context, npath.extname(filepath))
    const {isEntry, isRF, isFuncComp} = getFileInfo(ast)

    const checkPass = precheck(ast, isEntry, isRF, filepath, context)

    return {
        ast,
        isEntry,
        isRF,
        isFuncComp,
        checkPass,
    }
}