/**
 * @fileoverview no variable named h
 * @author yankang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "no variable named h",
            category: "Best Practices",
            recommended: true,
        },

        schema: [],

        messages: {
            unexpected: "转化引擎保留字，不允许声明/导入 名字为{{ name }}的变量."
        }
    },

    create(context) {
        return {
            Identifier(node) {
                if (node.name === "h") {
                    context.report({
                        node,
                        messageId: "unexpected",
                        data: {
                            name: "h",
                        }
                    });
                }
            },
        };

    }
};
