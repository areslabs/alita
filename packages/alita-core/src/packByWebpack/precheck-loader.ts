/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as webpack from 'webpack'
import {LoaderTmpResult} from "./interfaces"

import precheck from '../precheck/index'

/**
 * 由于alita 并不能对所有JSX写法兼容，所以这里需要预检测
 * @param {string} context
 * @returns {LoaderTmpResult}
 */
export default function (this: webpack.loader.LoaderContext, context: LoaderTmpResult): LoaderTmpResult {
    const filepath = this.resourcePath
    const {isEntry, isRF, isFuncComp, ast, rawCode} = context

    precheck(ast, isEntry, isRF, filepath, rawCode)

    return {
        ast,
        isEntry,
        isRF,
        isFuncComp,
    }
}