/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as t from "@babel/types"
import * as webpack from 'webpack'

import baseMisc from './baseMisc'

export default function (ast: t.Node, filepath: string, webpackContext: webpack.loader.LoaderContext): t.Node {
    const info = {
        filepath,
        webpackContext,
    }

    ast = baseMisc(ast, info)

    return ast
}