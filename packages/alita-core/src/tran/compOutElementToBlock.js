/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import errorLogTraverse from '../util/ErrorLogTraverse'


export default function addTempName (ast, info) {
    if (info.isPageComp) return ast

    errorLogTraverse(ast, {
        exit: path => {
            if (path.type === 'JSXOpeningElement'
                && path.node.name.name === 'view'
                && isRenderReturn(path)
            ) {
                path.node.name.name = 'block'

                if (path.parentPath.node.closingElement) {
                    path.parentPath.node.closingElement.name.name = 'block'
                }
            }

        }
    })

    return ast

}


function isRenderReturn(path) {

    const  pp = path.parentPath.parentPath
    if (pp.type !== 'ReturnStatement') return false


    if (pp.parentPath.parentPath) {
        const pppp = pp.parentPath.parentPath

        if (pppp.type === 'ClassMethod'
            && pppp.node.key.name === 'render'
        ) {
            return true
        }
    }
}