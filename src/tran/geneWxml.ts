/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as nodepath from 'path'
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import { geneReactCode } from "../util/uast";
import {miscNameToJSName, getRootPathPrefix} from '../util/util'

import configure from '../configure'

/**
 * 生成wxml代码
 * @param info
 */
export default function(info) {
    const { templates, filepath, outComp, childTemplates, webpackContext} = info;
    const finalJSPath = miscNameToJSName(filepath)

    const newTemp = [];
    for (let i = 0; i < templates.length; i++) {
        newTemp.push(t.jsxText("\n "));
        newTemp.push(templates[i]);
        newTemp.push(t.jsxText("\n "));
    }
    newTemp.push(t.jsxText("\n "));


    const ast = t.jsxElement(
        t.jsxOpeningElement(
            t.jsxIdentifier("InnerTmpOpeningElement"),
            []
        ),
        t.jsxClosingElement(t.jsxIdentifier("InnerTmpOpeningElement")),
        newTemp,
        false
    );

    const past = t.program([
        t.expressionStatement(ast)
    ]);

    traverse(past, {
        exit: path => {
            if (path.type === "JSXExpressionContainer"
                && (path.node as t.JSXExpressionContainer).expression.type === "JSXEmptyExpression"
            ) {
                path.remove();
                return;
            }
        }
    });


    let templateWxml = geneReactCode(ast);
    templateWxml = templateWxml.replace("<InnerTmpOpeningElement>", "");
    templateWxml = templateWxml.replace("</InnerTmpOpeningElement>", "");

    for (let i = 0; i < childTemplates.length; i++) {
        const name = childTemplates[i];
        // 如果只使用一个child 小程序会报递归， 然后就不渲染了
        const subT = `
<template name="${name}">
   <block wx:if="{{t.l(d)}}">{{d}}</block>
   <template wx:elif="{{d.tempName}}" is="{{d.tempName}}" data="{{...d}}"/>
   <block wx:else>
       <block wx:for="{{d}}" wx:key="key">
           <block wx:if="{{t.l(item)}}">{{item}}</block>
           <template wx:else is="{{item.tempName}}" data="{{...item}}"/>
       </block>
   </block>
</template>
        `;

        templateWxml = subT + templateWxml;
    }

    const utilWxsPath = getRootPathPrefix(finalJSPath) + '/commonwxs.wxs'

    templateWxml = `<wxs src="${utilWxsPath}" module="t" />
    ${templateWxml}
    `

    const relativeJSPath = finalJSPath
        .replace(configure.inputFullpath, '')

    webpackContext.emitFile(
        relativeJSPath.replace(".js", "Template.wxml"),
        templateWxml,
    );


    // gene all outComp
    geneAllOutComp(outComp, relativeJSPath, webpackContext);
}


function geneAllOutComp(outComp, relativeJSPath, webpackContext) {
    const basename = nodepath.basename(relativeJSPath);
    const temppath = basename.replace(".js", "Template.wxml");

    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        const wxmlFilepath = (name === "render"
                ? relativeJSPath.replace(".js", ".wxml")
                : relativeJSPath.replace(".js", `${name}.wxml`)
        );

        const wxmlAst = [];
        wxmlAst.push(t.jsxText(`<import src="./${temppath}"/>`))
        wxmlAst.push(t.jsxText("\n"));
        wxmlAst.push(t.jsxText(`<template wx:if="{{(_r && _r.tempName)}}" is="{{_r.tempName}}" data="{{..._r}}"/>`))
        let tmpWxmlAst = t.jsxElement(
            t.jsxOpeningElement(
                t.jsxIdentifier("InnerTmpOpeningElement"),
                []
            ),
            t.jsxClosingElement(t.jsxIdentifier("InnerTmpOpeningElement")),
            wxmlAst,
            false
        );

        let WXMLCode = geneReactCode(tmpWxmlAst);
        WXMLCode = WXMLCode.replace("<InnerTmpOpeningElement>", "");
        WXMLCode = WXMLCode.replace("</InnerTmpOpeningElement>", "");


        webpackContext.emitFile(
            wxmlFilepath,
            WXMLCode,
        );
    }
}
