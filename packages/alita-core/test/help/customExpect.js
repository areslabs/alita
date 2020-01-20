/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
const prettier = require("prettier");

expect.extend({
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