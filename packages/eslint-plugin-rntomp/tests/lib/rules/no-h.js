/**
 * @fileoverview no variable named h
 * @author yankang
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-h"),

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
ruleTester.run("no-h", rule, {

    valid: [
        ""
    ],

    invalid: [
        {
            code: "h()",
            errors: [{
                messageId: "unexpected",
                data: {
                    name: "h",
                },
            }]
        },
        {
            code: "const h = 1;",
            errors: [{
                messageId: "unexpected",
                data: { name: "h" },
            }]
        },
        {
            code: "import h from 'h'",
            errors: [{
                messageId: "unexpected",
                data: { name: "h" },
            }]
        },
        {
            code: "import { h } from 'x'",
            errors: [
                {
                    messageId: "unexpected",
                    data: { name: "h" },
                },
                {
                    messageId: "unexpected",
                    data: { name: "h" },
                }
            ]
        }
    ]
});
