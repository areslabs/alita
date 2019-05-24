/**
 * @fileoverview unsupport React Native API
 * @author yankang
 */
"use strict";

const unsupportRNAPI = new Set([
    'NativeModules',
    'Keyboard',
    'PanResponder',
    'Linking',
    'LayoutAnimation'
])
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "unsupport React Native API",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],

        messages: {
            unexpected: "React Native API {{ name }}尚未支持.",
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
                const name = node.imported.name
                const ancestors = context.getAncestors()
                const parentNode = ancestors[ancestors.length - 1]
                const source = parentNode.source.value

                if (source === 'react-native' && unsupportRNAPI.has(name)) {
                    context.report({
                        node,
                        messageId: "unexpected",
                        data: {
                            name,
                        }
                    });
                }
            }
        };
    }
};
