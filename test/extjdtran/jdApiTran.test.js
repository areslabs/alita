/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import "../help/customExpect";
import jdApiTran from '../../src/extjdtran/jdApiTran'
import {parseCode, geneCode} from '../../src/util/uast'

describe('exitjdtran', () => {
    beforeEach(() => {
        global.execArgs = {
            INPUT_DIR: '/a',
            OUT_DIR: '/b',
            watchMode: false
        }
    })

    it('jdApiTran', () => {
        const code = `
        import { JDJumping, JDLogin, JDShare, JDImage } from '@jdreact/jdreact-core-lib'
        import {AnimatedView, createAnimation, AnimatedImage} from '../innerTmpComponent/JDAnimated/index'
        `

        const ast = parseCode(code )
        const newAst = jdApiTran(ast, {
            filepath: '/b/c/d/x.js'
        })

        const newCode = geneCode(newAst)
        const expectCode = `
        import { JDImage, AnimatedView, AnimatedImage } from "../../rnext/jdcomponent/index";
        import { JDJumping, JDLogin, JDShare, createAnimation } from "../../rnext/jdapi/index";
        `
        expect(newCode).JSEqual(expectCode)
    })



})