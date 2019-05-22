/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import handleModules from './handleModules'
import handleGlobalApi from './handleGlobalApi'
import handleMisc from './handleMisc'
import geneJS from './geneJS'
import {geneCode} from "../util/uast";

export default async function (ast, filepath, justTran) {
    const info = {
        filepath
    }

    ast = handleMisc(ast, info)
    ast = handleModules(ast, info)
    ast = handleGlobalApi(ast, info)

    if (justTran) {
        return
    } else {
        await geneJS(geneCode(ast), info)
    }
}