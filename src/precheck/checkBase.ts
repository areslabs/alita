/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import traverse from "@babel/traverse";
import {printError} from './util'


export default function checkBase(ast, filepath, rawCode) {


    let checkPass = true


    traverse(ast, {

        enter: path => {


        },

        exit: path => {

        },

        Identifier(path) {
            if (path.node.name === "global") {
                printError(filepath, path, rawCode, `小程序不支持使用global变量`)
                checkPass = false
            }
        },
    })

    return checkPass
}