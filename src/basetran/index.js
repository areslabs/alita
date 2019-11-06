/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import path from 'path'
import handleModules from './handleModules'
import handleGlobalApi from './handleGlobalApi'
import handleMisc from './handleMisc'
import geneJS from './geneJS'
import {geneReactCode} from "../util/uast";

export default function (ast, filepath, justTran, isFuncComp) {
    const info = {
        filepath,
        isFuncComp
    }

    ast = handleMisc(ast, info)
    ast = handleModules(ast, info)
    ast = handleGlobalApi(ast, info)

    if (justTran) {
        return
    } else {
        const extname = path.extname(filepath)
        geneJS(geneReactCode(ast, extname), info)
    }
}