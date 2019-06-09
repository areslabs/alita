/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../help/customExpect";
import compPreHandle from '../../src/tran/compPreHandle'
import {expectNewCode} from '../help/utils'
import {parseCode} from '../../src/util/uast'

describe('comPreHandle', () => {
    beforeEach(() => {
        global.execArgs = {
            INPUT_DIR: '/a',
            OUT_DIR: '/b',
            watchMode: false
        }
    })

    it("添加stateless标志", () => {
        const code = `
        class A extends React.Component {}
        `
        const info = {
            isStatelessComp: true
        }
        const expectCode = `
        class A extends React.Component {
            __stateless__ = true;
        }
        `
        expectNewCode(code, expectCode, info, compPreHandle)


        const code2 = `
        class A extends React.Component {}
        `
        const info2 = {
            isStatelessComp: false
        }
        const expectCode2 = `
        class A extends React.Component {
            __stateless__ = false;
        }
        `
        expectNewCode(code2, expectCode2, info2, compPreHandle)
    })

    it("stateless标志只添加在组件类上", () => {
        const code = `class A {}`
        const info = {
            isStatelessComp: true
        }
        const expectCode = `class A {}`

        expectNewCode(code, expectCode, info, compPreHandle)
    })

    it("移除代码注释", () =>{
        const code = `
        class A extends React.Component {

            render() {
                // render method
        
                return (
                    <View>
                        {/*注释*/}
                        <Text>HW</Text>
                    </View>
                )
            }
        }
        `
        const expectCode = `
        class A extends React.Component {
            render() {
                return <View>
        
                    <Text>HW</Text>
                </View>;
            }
        
            __stateless__ = false;
        }
        `

        expectNewCode(code, expectCode, {
            isStatelessComp: false
        }, compPreHandle)
    })

    it("JSX表达式值为 字符串字面量 的时候，直接使用字符串字面量", () => {
        const code = `
        class A extends React.Component {
            render() {
                return (
                    <View name={"yk"}>{"HW"}</View>
                )
            }
        }
        `
        const info = {
            isStatelessComp: true
        }

        const expectCode = `
        class A extends React.Component {
            render() {
                return <View name="yk">HW</View>;
            }
        
            __stateless__ = true;
        }
        `
        expectNewCode(code, expectCode, info, compPreHandle)
    })

    it("wxNavigationOptions 设置到 小程序的页面配置上", () => {
        const code = `
        class A extends React.Component {
            static wxNavigationOptions = {
                navigationBarTitleText: "HelloWorld"
            }
        }
        `
        const info = {
            isStatelessComp: true,
            json: {}
        }

        const ast = parseCode(code)
        compPreHandle(ast, info)

        expect(info.json.navigationBarTitleText).toBe("HelloWorld")
    })

})


