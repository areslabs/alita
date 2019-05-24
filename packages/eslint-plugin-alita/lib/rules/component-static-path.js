/**
 * @fileoverview 组件的导入，需要在import/require语句就写明， 转化引擎需要静态的获取组件路径
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "组件的导入，需要在import/require语句就写明， 转化引擎需要静态的获取组件路径",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],

        messages: {
            unexpected: "组件{{name}}的导入，需要在import/require语句"
        }
    },

    create: function(context) {
        const allModuleVarSet = new Set([])
        return {
            ImportDeclaration: (node) => {
                node.specifiers.forEach(item => {
                    allModuleVarSet.add(item.local.name)
                })
            },

            "CallExpression > Identifier[name='require']": (node) => {
                const ances = context.getAncestors()
                const id = ances[ances.length - 2].id
                if (!id) return

                if (id.type === 'Identifier') {
                    allModuleVarSet.add(id.name)
                }

                if (id.type === 'ObjectPattern') {
                    id.properties.forEach(pro => {
                        if (pro.type === 'Property') {
                            allModuleVarSet.add(pro.value.name)
                        }
                    })
                }

            },

            JSXOpeningElement: (node) => {
                if (node.name.type === 'JSXIdentifier') {
                    const name = node.name.name
                    if (!allModuleVarSet.has(name)) {
                        context.report({
                            node,
                            messageId: "unexpected",
                            data: {
                                name
                            }
                        });
                    }
                }

            }

        };
    }
};
