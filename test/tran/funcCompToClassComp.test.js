/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../help/customExpect";
import funcCompToClassComp from '../../src/tran/funcCompToClassComp'
import {parseCode, geneCode} from '../../src/util/uast'

describe('function component to class component', () => {
    beforeEach(() => {
        global.execArgs = {
            INPUT_DIR: '/a',
            OUT_DIR: '/b',
            watchMode: false
        }
    })

    it('函数组件转化为类组件声明', () => {
        const code = `
        export default () => <View/> 
        `
        const ast = parseCode(code)
        const newAst = funcCompToClassComp(ast, {})
        const newCode = geneCode(newAst)
        const expectCode = `
        import { fetch, alert } from "./rnext/api/index";
    
        class A {
          f() {
            fetch();
          }
        
        }
        
        alert();
        `

        console.log('newCode:', newCode)
        //expect(newCode).JSEqual(expectCode)

    })

})