/**
 * @fileoverview no variable named h
 * @author yankang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/not-support-component"),

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
ruleTester.run("not-support-component", rule, {

    valid: [
        "import {View} from 'react-native'",
        "import {ToolbarAndroid} from 'h'"
    ],

    invalid: [
        {
            code: "import {ToolbarAndroid} from 'react-native'",
            errors: [{
                messageId: "unexpectedImported",
                data: {
                    name: "ToolbarAndroid"
                }
            }]
        },
        {
            code: `const A = <ToolbarAndroid/>`,
            errors: [{
                messageId: "unexpectedUsed",
                data: {
                    name: "ToolbarAndroid"
                }
            }]
        }
    ]
});
