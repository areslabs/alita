/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {geneReactCode} from '../util/uast'
import {exportGenericCompName, genericCompName} from '../constants'
import funcCompToClassComp from './funcCompToClassComp'
import compPreHandle from './compPreHandle'
import addTempName from './addTempName'
import geneAllTemplate from "./geneAllTemplate";
import compOutElementToBlock from './compOutElementToBlock'
import addEventHandler from './addEventHandler'
import RNCompHandler from './RNCompHandler'
import literalTemplate from './literalTemplate'
import classNameHandler from './classNameHandler'
import onLayoutHandler from './onLayoutHandler'
import fragmentHadnler  from './fragmentHadnler'
import contextHandler from './contextHandler'


import {setRFModuleInfo} from '../util/cacheModuleInfos'

export default function (ast, filepath, isFuncComp, isPageComp, webpackContext) {
    const info = {
        filepath: filepath,
        templates: [],
        childTemplates: [],
        outComp: [
            exportGenericCompName
        ],
        json: {
            component: true,
            usingComponents: {},
            componentGenerics: {
                [genericCompName]: true
            },
            disableScroll: true
        },

        isPageComp,
        isFuncComp,

        //webpackContext,
    }
    // 必须放在第一个处理，否则下面处理方法会由于<>写法导致报错
    ast = fragmentHadnler(ast, info)

    ast = contextHandler(ast, info)

    ast = funcCompToClassComp(ast, info)

    ast = compPreHandle(ast, info)

    ast = RNCompHandler(ast, info)

    ast = compOutElementToBlock(ast, info)

    ast = addTempName(ast, info)

    const reactCode = geneReactCode(ast)

    ast = literalTemplate(ast, info)

    ast = addEventHandler(ast, info)

    ast = classNameHandler(ast, info)

    ast = onLayoutHandler(ast, info)

    ast = geneAllTemplate(ast, info)

    // 设置React 组件信息
    setRFModuleInfo(filepath, info)

    return reactCode
}