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

    it('箭头函数组件转化为类组件声明', () => {
        const code = `
        export default () => <View/> 
        `
        const ast = parseCode(code)
        const newAst = funcCompToClassComp(ast, {filepath: '/a/b/MyFunc.js'})
        const newCode = geneCode(newAst)
        const expectCode = `
        export default class MyFunc extends React.FuncComponent {
          render() {
            return <View />;
          }
        
        }
        `
        expect(newCode).JSEqual(expectCode)
    })

    it('普通函数组件转化为类组件声明', () => {
        const code = `
        export default function(props) {
           const {a, b} = props
           return (
              <View>
                  <Text>
                     {a}
                     {b}
                  </Text>
              </View>
           )  
        } 
        `
        const ast = parseCode(code)
        const newAst = funcCompToClassComp(ast, {filepath: '/a/b/MyFunc.js'})
        const newCode = geneCode(newAst)
        const expectCode = `
        export default class MyFunc extends React.FuncComponent {
          render() {
            const props = this.props
            const {
              a,
              b
            } = props;
            return (<View>
                       <Text>
                          {a}
                          {b}
                       </Text>
                 </View>)
          }
        
        }
       `
        expect(newCode).JSEqual(expectCode)
    })

})