/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {geneReactCode} from '../util/uast'
import onLayoutHandler from './onLayoutHandler'
import funcCompToClassComp from './funcCompToClassComp'
import childrenToTemplate from './childrenToTemplate'
import compPreHandle from './compPreHandle'
import addTempName from './addTempName'
import geneAllTemplate from "./geneAllTemplate";
import compOutElementToBlock from './compOutElementToBlock'
import addEventHandler from './addEventHandler'
import RNCompHandler from './RNCompHandler'
import cptCompHandler from './cptCompHandler'
import literalTemplate from './literalTemplate'
import classNameHandler from './classNameHandler'


import {setRFModuleInfo} from '../util/cacheModuleInfos'

export default function (ast, filepath, isFuncComp, isPageComp, webpackContext) {
    const info = {
        filepath: filepath,
        templates: [],
        childTemplates: [],
        outComp: [],
        json: {
            component: true,
            usingComponents: {},
            componentGenerics: {},
            disableScroll: true
        },

        isPageComp,
        isFuncComp,

        //webpackContext,
    }

    ast = onLayoutHandler(ast, info)

    ast = funcCompToClassComp(ast, info)

    ast = compPreHandle(ast, info)

    ast = RNCompHandler(ast, info)

    ast = cptCompHandler(ast, info)

    ast = compOutElementToBlock(ast, info)

    ast = addTempName(ast, info)

    ast = childrenToTemplate(ast, info)

    const reactCode = geneReactCode(ast)

    ast = literalTemplate(ast, info)

    ast = addEventHandler(ast, info)

    ast = classNameHandler(ast, info)

    ast = geneAllTemplate(ast, info)

    // 设置React 组件信息
    setRFModuleInfo(filepath, info)

    return reactCode
}