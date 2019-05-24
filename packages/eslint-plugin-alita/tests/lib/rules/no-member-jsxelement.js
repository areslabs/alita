/**
 * @fileoverview 转化小程序不允许存在形如&lt;A.B/&gt;
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-member-jsxelement"),

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
ruleTester.run("no-member-jsxelement", rule, {

    valid: [

        "const a = <A/>"
    ],

    invalid: [
        {
            code: "const a = <A.B/>",
            errors: [{
                messageId: "unexpected"
            }]
        }
    ]
});
