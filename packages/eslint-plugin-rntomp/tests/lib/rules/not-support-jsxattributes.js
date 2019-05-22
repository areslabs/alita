/**
 * @fileoverview 不支持的组件属性
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/not-support-jsxattributes"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 6,
        ecmaFeatures: {
            jsx: true
        }
    },
});
ruleTester.run("not-support-jsxattributes", rule, {

    valid: [
    ],

    invalid: [
        {
            code:  `const a = <View onLayout={() => 1}/>`,
            errors: [{
                messageId: "commonUnexpected",
                data: {
                    attrname: "onLayout"
                }
            }]
        },

        {
            code:  `const a = <FlatList ItemSeparatorComponent={1}/>`,
            errors: [{
                messageId: "unexpected",
                data: {
                    attrname: "ItemSeparatorComponent",
                    elementname: "FlatList"
                }
            }]
        }
    ]
});
