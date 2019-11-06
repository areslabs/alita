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

    it('声明变量，变量是函数组件', () => {
        const code = `
        const f = (props) => <View/> 
        
        const h = function() {
             return <View/>
        }
        
        const v = function v() {
             return <View/>
        }
        
        const g = (props) => {
             return <View/>
        }
        `
        const expectCode = `
        const f = class extends React.FuncComponent {
          render() {
            const props = this.props
            return <View />
          }
        }
        const h = class extends React.FuncComponent {
          render() {
            return <View />
          }
        }
        const v = class v extends React.FuncComponent {
          render() {
            return <View />
          }
        }
        const g = class extends React.FuncComponent {
          render() {
            const props = this.props
            return <View />
          }
        }
        `
        expectNewCode(code, expectCode, {filepath: '/a/b/MyFunc.js'}, funcCompToClassComp)
    })


    it('导出变量，变量是函数组件', () => {
        const code = `
        export const f = (props) => <View/> 
        
        export const h = function() {
             return <View/>
        }
        
        export const v = function v() {
             return <View/>
        }
        
        export const g = (props) => {
             return <View/>
        }
        `
        const expectCode = `
        export const f = class extends React.FuncComponent {
          render() {
            const props = this.props
            return <View />
          }
        }
        export const h = class extends React.FuncComponent {
          render() {
            return <View />
          }
        }
        export const v = class v extends React.FuncComponent {
          render() {
            return <View />
          }
        }
        export const g = class extends React.FuncComponent {
          render() {
            const props = this.props
            return <View />
          }
        }
        `
        expectNewCode(code, expectCode, {filepath: '/a/b/MyFunc.js'}, funcCompToClassComp)
    })


    it('默认导出 箭头函数组件', () => {
        const code = `
        export default (props) => <View/> 
        `
        const expectCode = `
        export default (class extends React.FuncComponent {
          render() {
            const props = this.props
            return <View />
          }
        })
        `
        expectNewCode(code, expectCode, {filepath: '/a/b/MyFunc.js'}, funcCompToClassComp)
    })

    it('默认导出 函数组件', () => {
        const code = `
        export default function h() {return <View/>} 
        `
        const expectCode = `
        export default class h extends React.FuncComponent {
          render() {
            return <View />
          }
        }
        `
        expectNewCode(code, expectCode, {filepath: '/a/b/MyFunc.js'}, funcCompToClassComp)
    })

    it('props, context 声明', () => {
        const code = `
        export default function h({a, b}, {c, d}) {return <View/>} 
        `
        const expectCode = `
        export default class h extends React.FuncComponent {
          render() {
            const { c, d } = this.context
            const { a, b } = this.props
            return <View />
          }
        }
        `
        expectNewCode(code, expectCode, {filepath: '/a/b/MyFunc.js'}, funcCompToClassComp)
    })
})

