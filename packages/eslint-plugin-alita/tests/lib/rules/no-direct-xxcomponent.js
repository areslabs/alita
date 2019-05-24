/**
 * @fileoverview 禁止直接使用xxComponent，使用this.props.xxComponent / props,xxComponent 替换
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-direct-xxcomponent"),

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
ruleTester.run("no-direct-xxcomponent", rule, {

    valid: [
        'PureComponent',
        'HocComponent',
        'WrappedComponent',
        'Component'
    ],

    invalid: [
        {
            code: "xxComponent",
            errors: [{
                messageId: "unexpected",
            }]
        }
    ]
});
