/**
 * @fileoverview 可转化为小程序的HOC，有限制， 可以分平台文件来处理RN/小程序平台
 * @author no-jsxelement-inhoc
 */
"use strict";
const {isHocComponent} = require('../util')
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "转化小程序的HOC，需要使用React.createElement创建元素",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: "转化小程序的HOC，需要使用React.createElement创建元素"
        }
    },

    create: function(context) {
        let isHoc = false
        return {
            ":function > BlockStatement > ClassDeclaration": (node) => {
                const superClass = node.superClass
                if (isHocComponent(superClass)) {
                    isHoc = true
                }
            },

            JSXElement: (node => {
                if (!isHoc) return

                context.report({
                    node,
                    messageId: "unexpected",
                });
            })
        };
    }
};
