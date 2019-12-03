/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as webpack from 'webpack'
import basetran from '../basetran'
import {getCompInfos} from '../util/getAndStorecompInfos'

import {LoaderTmpResult} from './interfaces'

/**
 * 基本js文件的loader，处理小程序和RN环境的一些差异
 * @param context
 */

export default function (this: webpack.loader.LoaderContext,  context : LoaderTmpResult): LoaderTmpResult {
    if (!context.checkPass) {
        return context
    }

    const filepath = this.resourcePath

    if (context.isRF && !context.isEntry) {
        // 处理小程序组件信息
        getCompInfos(context.ast, filepath)
    }

    const newAst = basetran(context.ast, filepath, this)
    context.ast = newAst

    return context
}
