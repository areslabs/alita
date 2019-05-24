/**
 * @fileoverview unsupport React Native API
 * @author yankang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/not-support-api"),

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
ruleTester.run("not-support-api", rule, {

    valid: [
        `import {Dimensions} from 'react-native'`,
        `import {NativeModules} from 'h'`
    ],

    invalid: [
        {
            code: `import {NativeModules} from 'react-native'`,
            errors: [{
                messageId: "unexpected",
                data: {
                    name: 'NativeModules'
                }
            }]
        }
    ]
});
