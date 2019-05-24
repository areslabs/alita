/**
 * @fileoverview 一个文件最多只运行存在一个组件
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/one-file-one-component"),

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
ruleTester.run("one-file-one-component", rule, {

    valid: [
        `class A extends Component{}`
    ],

    invalid: [
        {
            code: `
             class A extends Component{}
             class B extends React.Component{}
            `,
            errors: [{
                messageId: "unexpected"
            }]
        },

        {
            code: `
             class A extends PureComponent{}
             class B extends React.Component{}
            `,
            errors: [{
                messageId: "unexpected"
            }]
        }
    ]
});
