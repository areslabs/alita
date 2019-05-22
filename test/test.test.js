/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import traverse from '@babel/traverse'
import {parseCode, geneCode} from '../src/util/uast'

describe('test', () => {
    it('just test', () => {

        const code = `
    class A extends Component{

            render() {
                return <V
                    //data="1"
                >
                   {/* <F></F>*/}
                </V>
            }
        }
        `

        const ast = parseCode(code)
        traverse(ast, {
            enter: path => {
                if (path.node.type === 'CommentLine') {
                    console.log('hihh:')
                }
            }
        })

        const newCode = geneCode(ast)
        console.log('newCode:', newCode)
    })
})

