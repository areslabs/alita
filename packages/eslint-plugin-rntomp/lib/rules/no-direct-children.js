/**
 * @fileoverview should this.props.children, props.children
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "should this.props.children, props.children",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpected: "禁止直接使用children，使用x.children替代，比如this.props.children/props.children"
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
                if (node.name === "children") {
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
