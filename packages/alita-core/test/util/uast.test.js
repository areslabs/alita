/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {parseCode, geneReactCode} from '../../src/util/uast'

describe('uast', () => {


    it("parseCode geneReactCode: flow语法支持", () => {
        const code = `
        function foo(one: any, two: number, three?): string {}
        `

        const ast = parseCode(code)
        const newcode = geneReactCode(ast)

        const expectCode = `function foo(one, two, three) {}`
        expect(newcode).toBe(expectCode)
    })

})