/**
 * @fileoverview no as in rncomponent
 * @author yankang
 */
"use strict";
const {RNCOMPSET} = require('../util/index')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "no as in rncomponent",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: "导入RN组件的时候，不能使用import {xx as yy} 写法",
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
            ImportSpecifier(node) {
                const importedName = node.imported.name
                const localName = node.local.name
                const ancestors = context.getAncestors()
                const parentNode = ancestors[ancestors.length - 1]
                const source = parentNode.source.value

                if (source === 'react-native' && RNCOMPSET.has(importedName) && importedName !== localName) {
                    context.report({
                        node,
                        messageId: "unexpected",
                    });
                }
            }
        };
    }
};
