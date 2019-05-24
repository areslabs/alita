/**
 * @fileoverview unsupport rn  component 
 * @author yankang
 */
"use strict";

const unsupportRNComponents = new Set([
    'DatePickerIOS',
    'ViewPagerAndroid',
    'StatusBar',
    'DatePickerAndroid',
    'DrawerAndroid',
    'MaskedView',
    'ProgressBarAndroid',
    'ProgressViewIOS',
    'SegmentedControlIOS',
    'TabBarIOS',
    'TimePickerAndroid',
    'ToastAndroid',
    'ToolbarAndroid',
    'ViewPager',
    'ImageBackground'
])

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "unsupport rn  component ",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],

        messages: {
            unexpectedImported: "React Native 组件{{ name }}尚未支持.",
            unexpectedUsed: "React Native 组件{{ name }}尚未支持，且不允许定义名为{{ name }}的组件"
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
            JSXIdentifier(node) {
                const name = node.name
                if (unsupportRNComponents.has(name)) {
                    context.report({
                        node,
                        messageId: "unexpectedUsed",
                        data: {
                            name,
                        }
                    });
                }
            },

            ImportSpecifier(node) {
                const name = node.imported.name
                const ancestors = context.getAncestors()
                const parentNode = ancestors[ancestors.length - 1]
                const source = parentNode.source.value

                if (source === 'react-native' && unsupportRNComponents.has(name)) {
                    context.report({
                        node,
                        messageId: "unexpectedImported",
                        data: {
                            name,
                        }
                    });
                }
            }
        };
    }
};
