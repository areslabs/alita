/**
 * @fileoverview 转化小程序不允许存在形如<A.B/>
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: `转化小程序不允许存在形如<A.B/>`,
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: `转化小程序不允许存在形如<A.B/>`
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
            "JSXOpeningElement > JSXMemberExpression": (node) => {
                context.report({
                    node,
                    messageId: "unexpected",
                });
            }
        };
    }
};
