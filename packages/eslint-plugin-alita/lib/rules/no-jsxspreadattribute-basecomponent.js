/**
 * @fileoverview base component did not suport jsxspreadattribute
 * @author y5g
 */
"use strict";
const {RNCOMPSET} = require('../util')
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "base component did not suport jsxspreadattribute",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: "转化小程序基本组件不支持属性展开，自定义组件可以"
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
            JSXSpreadAttribute: (node) => {
                const elementName = node.parent.name.name
                if (RNCOMPSET.has(elementName)) {
                    context.report({
                        node,
                        messageId: "unexpected",
                    });
                }
            }
        };
    }
};
