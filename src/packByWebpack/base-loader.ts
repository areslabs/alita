/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as webpack from 'webpack'
import basetran from '../basetran'

import {LoaderTmpResult} from './interfaces'

/**
 * 基本js文件的loader，处理小程序和RN环境的一些差异
 * @param context
 */

export default function (this: webpack.loader.LoaderContext,  context : LoaderTmpResult): LoaderTmpResult {
    const filepath = this.resourcePath
    context.ast = basetran(context.ast, filepath, this)

    return context
}
