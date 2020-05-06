import {RootPrefixPlaceHolader} from "../util/util"
import prettierWxml from '../util/prettierWxml'
import * as nodepath from "path";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import {geneReactCode} from "../util/uast";


export const handleChanged = (info, finalJSPath) => {
    const newWxOutFiles = {}


    const { templates, outComp, childTemplates} = info.RFInfo;

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


    const templateWxmlPath = finalJSPath.replace(".js", "$.wxml")
    const templateWxmlFilename = nodepath.basename(templateWxmlPath)

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


    const utilWxsPath = `${RootPrefixPlaceHolader}/commonwxs.wxs`

    templateWxml = `<wxs src="${utilWxsPath}" module="t" />

${templateWxml}
    `

    newWxOutFiles[templateWxmlPath] = prettierWxml(templateWxml)


    // gene all outComp
    geneAllOutComp(outComp, finalJSPath, newWxOutFiles, templateWxmlFilename);


    return newWxOutFiles
}


function geneAllOutComp(outComp, finalJSPath, newWxOutFiles, templateWxmlFilename) {

    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        const wxmlFilepath = (name === "default"
                ? finalJSPath.replace(".js", ".wxml")
                : finalJSPath.replace(".js", `${name}.wxml`)
        );

        const wxmlAst = [];
        wxmlAst.push(t.jsxText(`<import src="./${templateWxmlFilename}"/>`))
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


        newWxOutFiles[wxmlFilepath] = prettierWxml(WXMLCode)
    }
}

