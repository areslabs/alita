/**
 * @fileoverview no as in rncomponent
 * @author yankang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-as-in-rncomponent"),

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
ruleTester.run("no-as-in-rncomponent", rule, {

    valid: [
        `import {View} from 'react-native'`,
        `import {View as MyView} from 'h'`,
    ],

    invalid: [
        {
            code: `import {View as RNView, Text as RNText, Dimensions as RNDimensions} from 'react-native'`,
            errors: [
                {
                    messageId: "unexpected",
                },
                {
                    messageId: "unexpected",
                }
            ]
        }
    ]
});
