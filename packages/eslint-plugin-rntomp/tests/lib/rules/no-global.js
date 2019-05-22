/**
 * @fileoverview do not use global!
 * @author y5g
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-global"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-global", rule, {

    valid: [
    ],

    invalid: [
        {
            code: "global.x = 1",
            errors: [{
                messageId: "unexpected",
            }]
        },

        {
            code: "global.x",
            errors: [{
                messageId: "unexpected",
            }]
        }
    ]
});
