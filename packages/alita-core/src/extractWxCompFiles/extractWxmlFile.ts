import {RootPrefixPlaceHolader} from "../util/util"
import prettierWxml from '../util/prettierWxml'
import * as nodepath from "path";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import {geneReactCode} from "../util/uast";
import {wxBaseComp, genericCompDiuu, genericCompName} from "../constants"


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
            if (path.type === 'JSXElement'
                && (path.node as t.JSXElement).openingElement
            ) {
                const openingElement = (path.node as t.JSXElement).openingElement
                const name = (openingElement.name as t.JSXIdentifier).name
                if (name && wxBaseComp.has(name.toLocaleLowerCase())
                    && (
                        info.im[name]
                        || (info.RFInfo.outComp && info.RFInfo.outComp.includes(name))
                    )
                ) {
                    const aliasName = `WX${name}`;
                    (openingElement.name as t.JSXIdentifier).name = aliasName
                    if ((path.node as t.JSXElement).closingElement) {
                        const closingElement = (path.node as t.JSXElement).closingElement;
                        (closingElement.name as t.JSXIdentifier).name = aliasName
                    }
                }
            }
        }
    });


    const templateWxmlPath = finalJSPath.replace(".js", ".wxml")

    let templateWxml = geneReactCode(ast);
    templateWxml = templateWxml.replace("<InnerTmpOpeningElement>", "");
    templateWxml = templateWxml.replace("</InnerTmpOpeningElement>", "");

    for (let i = 0; i < childTemplates.length; i++) {
        const name = childTemplates[i];
        // 如果只使用一个child 小程序会报递归， 然后就不渲染了
        const subT = `
<template name="${name}">
   <block wx:if="{{_t.l(d)}}">{{d}}</block>
   <${genericCompName} wx:elif="{{d.${genericCompDiuu}}}" diuu="{{d.${genericCompDiuu}}}" style="{{_t.s(d.${genericCompDiuu}style)}}"/>
   <template wx:elif="{{d.tempName}}" is="{{d.tempName}}" data="{{...d}}"/>
   <block wx:else>
       <block wx:for="{{d}}" wx:key="key">
           <block wx:if="{{_t.l(item)}}">{{item}}</block>
           <${genericCompName} wx:elif="{{item.${genericCompDiuu}}}" diuu="{{item.${genericCompDiuu}}}" style="{{_t.s(item.${genericCompDiuu}style)}}"/>
           <template wx:else is="{{item.tempName}}" data="{{...item}}"/>
       </block>
   </block>
</template>
        `;

        templateWxml = subT + templateWxml;
    }


    const utilWxsPath = `${RootPrefixPlaceHolader}/commonwxs.wxs`

    templateWxml = `<wxs src="${utilWxsPath}" module="_t" />

${templateWxml}


<template wx:if="{{(_r && _r.tempName)}}" is="{{_r.tempName}}" data="{{..._r}}"/>
    `

    newWxOutFiles[templateWxmlPath] = prettierWxml(templateWxml)
    return newWxOutFiles
}

