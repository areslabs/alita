/**
 * @fileoverview base component did not suport jsxspreadattribute
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-jsxspreadattribute-basecomponent"),

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
ruleTester.run("no-jsxspreadattribute-basecomponent", rule, {

    valid: [
        `<A {...props}/>`
    ],

    invalid: [
        {
            code: "<View {...props}/>",
            errors: [{
                messageId: "unexpected"
            }]
        }
    ]
});
