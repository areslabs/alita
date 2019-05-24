/**
 * @fileoverview 不支持的组件属性
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const notSupportCommonAttris = new Set([
    'onLayout',
    'onStartShouldSetResponder',
    'onMoveShouldSetResponder',
    'onResponderGrant',
    'onResponderReject',
    'onResponderMove',
    'onResponderRelease',
    'onResponderTerminationRequest',
    'onResponderTerminate'
])
const notSupportJSXElementAttris = {
    FlatList: new Set([
        'ItemSeparatorComponent',
        'columnWrapperStyle',
        'extraData',
        'inverted',
        'onViewableItemsChanged',
        'progressViewOffset',
        'legacyImplementation',
    ]),
    ScrollView: new Set([
        'onContentSizeChange',
        'onMomentumScrollBegin',
        'onMomentumScrollEnd',
        'pagingEnabled',
        'scrollEnabled',
    ])
    //TODO 补充。。。
}

module.exports = {
    meta: {
        docs: {
            description: "不支持的组件属性",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            commonUnexpected: `小程序不支持{{attrname}}属性`,
            unexpected: `小程序{{elementname}}组件不支持{{attrname}}属性`,
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

            JSXAttribute: (node) => {
                const name = node.name.name
                if (notSupportCommonAttris.has(name)) {
                    context.report({
                        node,
                        messageId: "commonUnexpected",
                        data: {
                            attrname: name,
                        },
                    });
                } else {
                    const jop = node.parent
                    const elementName = jop.name.name

                    const jsxEleAttr = notSupportJSXElementAttris[elementName]
                    if (jsxEleAttr && jsxEleAttr.has(name)) {
                        context.report({
                            node,
                            messageId: "unexpected",
                            data: {
                                attrname: name,
                                elementname: elementName
                            },
                        });
                    }
                }
            }

        };
    }
};
