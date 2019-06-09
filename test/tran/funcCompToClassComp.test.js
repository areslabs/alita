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
import {expectNewCode} from '../help/utils'
import compPreHandle from "../../src/tran/compPreHandle";

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
        const expectCode = `
        export default class MyFunc extends React.FuncComponent {
          render() {
            return <View />;
          }
        
        }
        `
        expectNewCode(code, expectCode, {filepath: '/a/b/MyFunc.js'}, funcCompToClassComp)
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
        expectNewCode(code, expectCode, {filepath: '/a/b/MyFunc.js'}, funcCompToClassComp)
    })

})