/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import { judgeJSXElement, parseCode } from "../../src/util/uast";
import traverse from "@babel/traverse";
import '../help/customExpect'
describe("检测返回JSXElement",()=>{
  it("logical judgeElement 1",()=>{
    const code="a&&<View/>"
    const ast=parseCode(code)
    traverse(ast,{
      enter:(path)=>{
        const node=path.node
        if(node.type==='LogicalExpression'){
          console.log(judgeJSXElement(node,new Set([]))===true)
        }
      }
    })
  });
  it("logical judgeElement 2",()=>{
    const code="a || b&&<View/>"
    const ast=parseCode(code)
    traverse(ast,{
      enter:(path)=>{
        const node=path.node
        if(node.type==='LogicalExpression'){
          console.log(judgeJSXElement(node,new Set([]))===true)
        }
      }
    })
  });

  it("method call",()=>{
    const code="a && this.getEle()"
    const ast=parseCode(code)
    traverse(ast,{
      enter:(path)=>{
        const node=path.node
        if(node.type==='LogicalExpression'){
          console.log(judgeJSXElement(node,new Set(["getEle"]))===true)
        }
      }
    })
  });

  it("map call",()=>{
    const code="[1,2,3].map(e=>{return getEle()})"
    const ast=parseCode(code)
    traverse(ast,{
      enter:(path)=>{
        const node=path.node
        if(node.type==='CallExpression'){
          console.log(judgeJSXElement(node,new Set(["getEle"]))===true)
        }
      }
    })
  });
})