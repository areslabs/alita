/**
 * @fileoverview 一个文件最多只运行存在一个组件
 * @author y5g
 */
"use strict";

const {isReactComp} = require('../util/index')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "一个文件最多只运行存在一个组件",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: `一个文件最多只允许存在一个组件`
        }
    },

    create: function(context) {

        let alreadyHas = false
        return {
            ClassDeclaration: (node) => {
                if (isReactComp(node.superClass)) {
                    if (alreadyHas) {
                        context.report({
                            node,
                            messageId: "unexpected",
                        });
                    }

                    alreadyHas = true
                }
            }

        };
    }
};
