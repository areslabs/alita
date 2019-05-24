/**
 * @fileoverview 可转化为小程序的HOC，有限制， 可以分平台文件来处理RN/小程序平台
 * @author no-jsxelement-inhoc
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-jsxelement-inhoc"),

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
ruleTester.run("no-jsxelement-inhoc", rule, {

    valid: [
        `function f(){class A extends HocComponent {
               render() {}
        }}`,
    ],

    invalid: [
        {
            code: `function f(){class A extends HocComponent {
               render() {return <V/>}
                  }}`,
            errors: [{
                messageId: "unexpected"
            }]
        }
    ]
});
