/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import "../help/customExpect";
import handleImportAndGlobalApi from '../../src/basetran/handleImportAndGlobalApi'
import {parseCode, geneCode} from '../../src/util/uast'

describe('basetran handleImportAndGlobalApi', () => {
    beforeEach(() => {
        global.execArgs = {
            INPUT_DIR: '/a',
            OUT_DIR: '/b',
            watchMode: false
        }
    })

    it('全局函数 加上import', () => {
        const code = `
        class A {
            f() {
                fetch()
            }
        }
        
        alert()
        `
        const ast = parseCode(code)
        const newAst = handleImportAndGlobalApi(ast, {filepath: '/b/x.js'})
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
        expect(newCode).JSEqual(expectCode)

        const ast2 = parseCode(code)
        const newAst2 =  handleImportAndGlobalApi(ast2, {filepath: '/b/c/d/x.js'})
        const newCode2 = geneCode(newAst2)
        const expectCode2 = `
        import { fetch, alert } from "../../rnext/api/index";
    
        class A {
          f() {
            fetch();
          }
        
        }
        
        alert();
        
        `
        expect(newCode2).JSEqual(expectCode2)
    })

    it('import/ require 图片处理', () => {
        const code = `
        import a from './x/y.png'
        const b = require('./b.png')
        `

        const ast = parseCode(code)
        const newAst = handleImportAndGlobalApi(ast, {filepath: '/b/c/d/x.js'})
        const newCode = geneCode(newAst)

        const expectCode = `
        const a = "/c/d/x/y.png";
        const b = "/c/d/b.png";
        `
        expect(newCode).JSEqual(expectCode)
    })

    it('import 目录', () => {
        const code = `
        import x from './x'
        import y from './y.js'
        import z from './z.json'
        `
        const ast = parseCode(code)
        const newAst = handleImportAndGlobalApi(ast, {filepath: '/b/c/d.js'})
        const newCode = geneCode(newAst)

        const expectCode = `
        import x from "./x/index";
        import y from './y.js';
        import z from './z.json';
        `

        expect(newCode).JSEqual(expectCode)
    })


    it('import react/react-redux/react-native 库代码', () => {
        const code = `
        import connect from 'react-redux'
        import {Platform} from 'react-native'
        import {Component} from 'react'
        `
        const ast = parseCode(code)
        const newAst = handleImportAndGlobalApi(ast, {filepath: '/b/d.js'})
        const newCode = geneCode(newAst)
        const expectCode = `
        import { Platform } from "./rnext/api/index"
        import connect from "./libext/react-redux/index"
        
        `
        expect(newCode).JSEqual(expectCode)
    })
})