/**
 * @fileoverview 转化小程序高阶组件规则
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/wx-hoc"),

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
ruleTester.run("wx-hoc", rule, {

    valid: [
        'function f(){class A {}}',
        'const f = () => {class A {}}',
        'const f = () => {class A extends C {}}'
    ],

    invalid: [
        {
            code: "const f = () => {class A extends Component {}}",
            errors: [{
                messageId: "unexpected",
            }]
        }
    ]
});
