/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
const prettier = require("prettier");
var minify = require('html-minifier').minify

expect.extend({
    WXMLEqual(received, argument) {
        const rec = minify(received, {
            caseSensitive: true,
            collapseWhitespace: true,
        })

        const exp = minify(argument, {
            caseSensitive: true,
            collapseWhitespace: true,
        })

        const pass = exp === rec
        if (pass) {
            return {
                message: () =>
                    `JSXEqual`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected \n ${rec} to be JSXEqual with \n ${exp}`,
                pass: false,
            };
        }
    },

    JSEqual(received, argument) {
        const frec = prettier.format(received, { semi: false, parser: "babylon" })
        const expe = prettier.format(argument, { semi: false, parser: "babylon" })

        const pass = expe === frec
        if (pass) {
            return {
                message: () =>
                    `JSEqual`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected \n ${frec} to be JSEqual with  \n ${expe}`,
                pass: false,
            };
        }
    }
});