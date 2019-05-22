/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {geneCode} from '../util/uast'
import funcCompToClassComp from './funcCompToClassComp'
import childrenToTemplate from './childrenToTemplate'
import compPreHandle from './compPreHandle'
import addTempName from './addTempName'
import handleImportExpre from './handleImportExpre'
import geneReactJS from './geneReactJS'
import geneJS from './geneJS'
import geneWxml from './geneWxml'
import geneWxss from './geneWxss'
import geneJSON from './geneJSON'
import geneAllTemplate from "./geneAllTemplate";
import compOutElementToBlock from './compOutElementToBlock'
import addEventHandler from './addEventHandler'
import addWXPrefixHandler from './addWXPrefixHandler'
import cptCompHandler from './cptCompHandler'

export default async function (ast, filepath, isFuncComp, entryFilePath, isPageComp, isStatelessComp) {
    const info = {
        filepath: filepath,
        templates: [],
        childTemplates: [],
        outComp: [
            'render'
        ],
        json: {
            component: true,
            usingComponents: {},
            componentGenerics: {},
            disableScroll: true
        },

        entryFilePath,
        isPageComp,
        isFuncComp,
        isStatelessComp,
    }

    if (isFuncComp) {
        ast = funcCompToClassComp(ast, info)
    }

    ast = compPreHandle(ast, info)

    ast = addWXPrefixHandler(ast, info)

    ast = cptCompHandler(ast, info)

    ast = compOutElementToBlock(ast, info)

    ast = addTempName(ast, info)

    ast = handleImportExpre(ast, info)

    ast = childrenToTemplate(ast, info)

    await geneReactJS(ast, info)

    ast = addEventHandler(ast, info)

    ast = geneAllTemplate(ast, info)

    geneWxml(info)
    geneJSON(info)
    geneJS(geneCode(ast), info)
    geneWxss(info)
}