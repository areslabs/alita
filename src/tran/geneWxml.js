/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import { geneJSXCode } from "../util/uast";

import {getRootPathPrefix} from '../util/util'

const fs = require("fs");
const nodepath = require("path")

/**
 * 生成wxml代码
 * @param info
 */
export default function(info) {
    let { templates, filepath, outComp, childTemplates} = info;
    filepath = filepath.replace(".wx.js", ".js");

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
                && path.node.expression.type === "JSXEmptyExpression"
            ) {
                path.remove();
                return;
            }
        }
    });


    let templateWxml = geneJSXCode(ast);
    templateWxml = templateWxml.replace("<InnerTmpOpeningElement>", "");
    templateWxml = templateWxml.replace("</InnerTmpOpeningElement>", "");

    for (let i = 0; i < childTemplates.length; i++) {
        const name = childTemplates[i];
        // 如果只使用一个child 小程序会报递归， 然后就不渲染了
        const subT = `
<template name="${name}"><block wx:if="{{t.a(d)}}"><block wx:for="{{t.c(d)}}" wx:key="key"><block wx:if="{{t.l(item)}}">{{item}}</block><template wx:else is="{{item.tempName}}" data="{{...item}}"></template></block></block><template wx:elif="{{d.tempName}}" is="{{d.tempName}}" data="{{...d}}"></template></template>
        `;

        templateWxml = subT + templateWxml;
    }

    const utilWxsPath = getRootPathPrefix(filepath) + '/commonwxs.wxs'

    templateWxml = `<wxs src="${utilWxsPath}" module="t" />
    ${templateWxml}
    `

    fs.writeFileSync(
        filepath.replace(".js", "Template.wxml"),
        templateWxml,
        {
            flag: "w+"
        }
    );


    // gene all outComp
    geneAllOutComp(outComp, filepath);
}


function geneAllOutComp(outComp, filepath) {
    const basename = nodepath.basename(filepath);
    const temppath = basename.replace(".js", "Template.wxml");

    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        const wxmlFilepath = (name === "render"
                ? filepath.replace(".js", ".wxml")
                : filepath.replace(".js", `${name}.wxml`)
        );

        const wxmlAst = [];
        wxmlAst.push(t.jsxText(`<import src="./${temppath}"/>`))
        wxmlAst.push(t.jsxText("\n"));
        wxmlAst.push(t.jsxText(`<template wx:if="{{(_r && _r.tempName) || (R && R.tempName)}}" is="{{_r.tempName || R.tempName}}" data="{{...(_r || R)}}"/>`))
        let tmpWxmlAst = t.jsxElement(
            t.jsxOpeningElement(
                t.jsxIdentifier("InnerTmpOpeningElement"),
                []
            ),
            t.jsxClosingElement(t.jsxIdentifier("InnerTmpOpeningElement")),
            wxmlAst,
            false
        );

        let WXMLCode = geneJSXCode(tmpWxmlAst);
        WXMLCode = WXMLCode.replace("<InnerTmpOpeningElement>", "");
        WXMLCode = WXMLCode.replace("</InnerTmpOpeningElement>", "");


        fs.writeFileSync(
            wxmlFilepath,
            WXMLCode,
            {
                flag: "w+"
            }
        );
    }
}