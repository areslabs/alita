/**
 * @fileoverview 小程序webview占满全屏，和RN不同
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "小程序webview占满全屏，和RN不同",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],

        messages: {
            unexpected: `小程序webview占满全屏，和RN不同, 避免使用`
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
            JSXOpeningElement: (node) => {
                const tagname = node.name.name
                if (tagname === 'WebView') {
                    context.report({
                        node,
                        messageId: "unexpected",
                    });
                }
            }
        };
    }
};
