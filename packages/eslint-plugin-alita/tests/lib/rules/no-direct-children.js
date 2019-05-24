/**
 * @fileoverview should this.props.children, props.children
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-direct-children"),

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
ruleTester.run("no-direct-children", rule, {

    valid: [
        'x.children',
        'props.children'
    ],

    invalid: [
        {
            code: "children",
            errors: [{
                messageId: "unexpected",
            }]
        },

        {
            code: "const a = children",
            errors: [{
                messageId: "unexpected",
            }]
        }
    ]
});
