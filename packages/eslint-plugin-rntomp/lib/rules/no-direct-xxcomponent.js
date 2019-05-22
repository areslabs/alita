/**
 * @fileoverview 禁止直接使用xxComponent，使用this.props.xxComponent / props,xxComponent 替换
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const ignoreCompSet = new Set([
    'PureComponent',
    'HocComponent',
    'WrappedComponent',
    'Component'
])

module.exports = {
    meta: {
        docs: {
            description: "禁止直接使用xxComponent，使用this.props.xxComponent / props,xxComponent 替换",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: "禁止直接使用xxComponent，使用this.props.xxComponent / props,xxComponent 替换"
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
            Identifier(node) {
                if (node.name.endsWith('Component')) {
                    const name = node.name

                    if (ignoreCompSet.has(name)) {
                        return
                    }

                    const p = node.parent
                    if (p.type !== 'MemberExpression') {
                        context.report({
                            node,
                            messageId: "unexpected",
                        });
                    }
                }
            },
        };
    }
};
