/**
 * @fileoverview 转化小程序不支持Animated组件， 需要使用wx-animated库替换
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-rn-animated"),

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
ruleTester.run("no-rn-animated", rule, {

    valid: [
        ''
    ],

    invalid: [
        {
            code: `import { Animated, Text, View } from 'react-native'`,
            errors: [{
                messageId: "unexpected"
            }]
        },

        {
            code: `const {Animated} = require('react-native')`,
            errors: [{
                messageId: "unexpected"
            }]
        }
    ]
});
