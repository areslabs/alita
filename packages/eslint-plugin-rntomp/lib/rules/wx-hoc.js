/**
 * @fileoverview 转化小程序高阶组件规则
 * @author y5g
 */
"use strict";
const {isReactComp} = require('../util')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------


module.exports = {
    meta: {
        docs: {
            description: "转化小程序高阶组件规则",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: "转化小程序高阶组件需要分平台处理，组件继承HocComponent."
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
            ":function > BlockStatement > ClassDeclaration": (node) => {
                const superClass = node.superClass
                if (isReactComp(superClass)) {
                    context.report({
                        node,
                        messageId: "unexpected",
                    });
                }
            }

        };
    }
};