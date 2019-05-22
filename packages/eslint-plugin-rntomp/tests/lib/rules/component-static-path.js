/**
 * @fileoverview 组件的导入，需要在import/require语句就写明， 转化引擎需要静态的获取组件路径
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/component-static-path"),

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
ruleTester.run("component-static-path", rule, {

    valid: [
        `import A from 'A';const Ac = A.c;`,
        `import A from 'A'; const x = <A/>`,
        `import {A} from 'A'; const x = <A/>`,
        `const A = require('A'); const x = <A/>`,
        `const {A} = require('A'); const x = <A/>`
    ],

    invalid: [
        {
            code: `import A from 'A';const Ac = A.c;const x = <Ac/>;`,
            errors: [{
                messageId: "unexpected",
            }]
        },
        {
            code: `const B = require('B');const Bd = B.d;const y = <Bd/>;`,
            errors: [{
                messageId: "unexpected",
            }]
        }
    ]
});
