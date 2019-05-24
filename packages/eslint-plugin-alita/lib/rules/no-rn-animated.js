/**
 * @fileoverview 转化小程序不支持Animated组件， 需要使用wx-animated库替换
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "转化小程序不支持Animated组件， 需要使用wx-animated库替换",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],

        messages: {
            unexpected: `转化小程序不支持Animated组件， 需要使用wx-animated库替换`
        }
    },

    create: function(context) {

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            ImportDeclaration: (node) => {
                if (node.source.value !== 'react-native') return

                node.specifiers.forEach(item => {
                    if (item.local.name === 'Animated')  {
                        context.report({
                            node,
                            messageId: "unexpected",
                        });
                    }
                })
            },

            "CallExpression": (node) => {
                const {callee, arguments : args} = node
                if (callee.name === 'require' && args[0].value  === 'react-native') {
                    const id = node.parent.id

                    if (id.type === 'ObjectPattern') {
                        id.properties.forEach(pro => {
                            if (pro.type === 'Property') {
                                if(pro.value.name === 'Animated') {
                                    context.report({
                                        node,
                                        messageId: "unexpected",
                                    });
                                }
                            }
                        })
                    }
                }
            },

        };
    }
};
