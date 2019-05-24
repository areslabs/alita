/**
 * @fileoverview 小程序webview占满全屏，和RN不同
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-webview"),

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
ruleTester.run("no-webview", rule, {

    valid: [

        `const a = <V/>`
    ],

    invalid: [
        {
            code: "<WebView/>",
            errors: [{
                messageId: "unexpected"
            }]
        }
    ]
});
