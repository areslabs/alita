/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as t from "@babel/types"
import * as webpack from 'webpack'

import handleModules from './handleModules'
import handleGlobalApi from './handleGlobalApi'
import handleMisc from './handleMisc'


export default function (ast: t.Node, filepath: string, webpackContext: webpack.loader.LoaderContext): t.Node {
    const info = {
        filepath,
        webpackContext,
    }

    ast = handleMisc(ast, info)
    ast = handleModules(ast, info)
    ast = handleGlobalApi(ast, info)

    return ast
}