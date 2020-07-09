/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import errorLogTraverse from '../util/ErrorLogTraverse'
import * as t from "@babel/types"

import {isJSXChild, isChildCompChild, isChildComp, isTextElement} from "../util/uast";
import {geneOrder} from '../util/util'
export default function addTempName (ast, info) {

	let tempNameCount = geneOrder()
	let diuuCount = geneOrder('_') // _的传递，防止是 "diuu + 属性" 和 "diuu自增" 重复
	let datakeyCount = geneOrder()

	errorLogTraverse(ast, {
        exit: path => {
					if (path.type === 'JSXElement'
							&& (!isJSXChild(path) || isChildCompChild(path, info.filepath))
					) {
							const jsxOp = path.node.openingElement

							const tempName = tempNameCount.next
							jsxOp.attributes.push(t.jsxAttribute(t.jsxIdentifier('tempName'), t.stringLiteral(tempName)))
					}


					// 如果只使用一个child 小程序会报递归， 然后就不渲染了
					if (path.type === 'JSXElement'
						&& !isChildComp(path.node.openingElement.name.name, info.filepath)
					) {
						const children = path.node.children
						let tempName = null

						const isTextEle = isTextElement(path.node.openingElement)

						path.node.children = children.map(ele => {
							if (ele.type === 'JSXExpressionContainer') {
								ele.isJsxExpress = false

								// 以下几种情况，不用生成动态wxml来判断当前节点类型
								// 1. 如果JSXExpressionContainer为{this.xxx()}，且xxx()方法返回的类型
								// 		都为JSXElement，则直接生成对应的template
								if (ele.expression && ele.expression.type === 'CallExpression') {
									const expression = ele.expression
									ele.isJsxExpress = checkFuncIsJsx(expression, ast)
								} 
								// 2. 如果JSXExpressionContainer为{<xxx></xxx>}，则直接生成对应的template
								else if (ele.expression && ele.expression.type === 'JSXElement') {
									ele.isJsxExpress = true
								}
								// 3. 如果JSXExpressionContainer为{a}，且a类型为JSXElement，则直接生成对应
								//    的template
								else if (ele.expression && ele.expression.type === 'Identifier') {
									const varnName = ele.expression.name
									ele.isJsxExpress = checkVarnIsJsx(varnName, ast)
								}
								// 4. 如果JSXExpressionContainer为{yyy && <xxx></xxx>}，且则直接生成对应的
								//    template
								else if (ele.expression && ele.expression.type === 'LogicalExpression') {
									ele.isJsxExpress = checkLogiIsJsx(ele.expression, ast)
								}
								// 5. 如果JSXExpressionContainer为{aaa ? <xxx></xxx> : <yyy></yyy>}，且则直
								// 		接生成对应的template
								else if (ele.expression && ele.expression.type === 'ConditionalExpression') {
									if (checkExpressionIsJsx(ele.expression.consequent, ast)
										&& checkExpressionIsJsx(ele.expression.alternate, ast)
									) {
										ele.isJsxExpress = true
									}
								}

								let templateAttris = []
								const datakey = datakeyCount.next
								templateAttris = [
									t.jsxAttribute(t.jsxIdentifier('datakey'), t.stringLiteral(datakey)),
									t.jsxAttribute(t.jsxIdentifier('tempVnode'), ele),
								]

								if (ele.isJsxExpress) {
									templateAttris.push(
										t.jsxAttribute(t.jsxIdentifier('wx:if'), t.stringLiteral(`{{${datakey} && ${datakey}.tempName}}`))
									)
									templateAttris.push(
										t.jsxAttribute(t.jsxIdentifier('is'), t.stringLiteral(`{{${datakey}.tempName}}`))
									)
									templateAttris.push(
										t.jsxAttribute(t.jsxIdentifier('data'), t.stringLiteral(`{{...${datakey}}}`))
									)
								} else {
									if (!tempName) {
										tempName = tempNameCount.next
									}
									templateAttris.push(
										t.jsxAttribute(t.jsxIdentifier('wx:if'), t.stringLiteral(`{{${datakey}}} !== undefined`))
									)
									templateAttris.push(
										t.jsxAttribute(t.jsxIdentifier('is'), t.stringLiteral(tempName))
									)
									templateAttris.push(
										t.jsxAttribute(t.jsxIdentifier('data'), t.stringLiteral(`{{d: ${datakey}}}`))
									)
								}
								
								ele.isJsxExpress = false

								if (isTextEle) {
									templateAttris.push(t.jsxAttribute(t.jsxIdentifier('isTextElement')))
								}

								return t.jsxElement(
									t.jsxOpeningElement(
										t.jsxIdentifier('template'),
										templateAttris
									),
									t.jsxClosingElement(
										t.jsxIdentifier('template')
									),
									[],
									true
								)
							}
							return ele
						})

						if (tempName && !isTextEle) {
							info.childTemplates.push(tempName)
						}
					}


					if (path.type === 'JSXOpeningElement') {
							const jsxOp = path.node

							const key = diuuCount.next

							jsxOp.attributes.push(
									t.jsxAttribute(t.jsxIdentifier('diuu'), t.stringLiteral(key))
							)
					}
        }
    })
    return ast
}


/**
 * 判断方法返回的结果是否是JSX类型
 * @param {*} expression 
 * @param {*} ast 
 */
function checkFuncIsJsx(expression, ast) {
	let isJsxExpress = false
	if (expression.callee
		&&expression.callee.type === 'MemberExpression'
		&& expression.callee.object
		&& expression.callee.object.type === 'ThisExpression'
		&& expression.callee.property
		&& expression.callee.property.type === 'Identifier'
	) {
		const funcName = expression.callee.property.name
	
		errorLogTraverse(ast, {
			exit: path => {
				if ((path.node.type === 'ClassMethod'
					&& path.node.key
					&& path.node.key.type === 'Identifier'
					&& path.node.key.name === funcName
					&& path.node.body.type === 'BlockStatement')
					|| (
						path.node.type === 'ClassProperty'
						&& path.node.key
						&& path.node.key.type === 'Identifier'
						&& path.node.key.name === funcName
						&& path.node.value
						&& path.node.value.type === 'ArrowFunctionExpression'
					)
				) {
					let runturnIsJsx = true
					let runturnCount = 0

					path.traverse({
						ReturnStatement(path) {
							runturnCount++
							if (path.node.argument
								&& path.node.argument.type !== 'NullLiteral'
								&& !checkExpressionIsJsx(path.node.argument, ast)
							) {
								runturnIsJsx = false
								path.skip()
							}
						}
					})

					if (!runturnIsJsx || (runturnIsJsx && runturnCount === 0)) {
						isJsxExpress = false
					} else {
						isJsxExpress = true
					}
				}
			}
		})
	}
	return isJsxExpress
}

/**
 * 判断变量是否是JSX类型
 * @param {*} varnName 
 * @param {*} ast 
 */
function checkVarnIsJsx(varnName, ast) {
	let isJsxExpress = false
	let varnNameCount = 0
	errorLogTraverse(ast, {
		exit: (path) => {
			if ((
					path.node.type === 'VariableDeclarator'
					&& path.node.id
					&& path.node.id.type === 'Identifier'
					&& path.node.id.name === varnName
				)
					|| (
					path.node.type === 'AssignmentExpression'
					&& path.node.operator === '='
					&& path.node.left 
					&& path.node.left.type === 'Identifier'
					&& path.node.left.name === varnName
				)
			) {
				varnNameCount++
			}
		}
	})
	if (varnNameCount === 1) {
			errorLogTraverse(ast, {
				exit: (path) => {
					if (path.node.type === 'VariableDeclarator'
						&& path.node.id
						&& path.node.id.type === 'Identifier'
						&& path.node.id.name === varnName
						&& path.node.init
						&& checkEquationIsJSX(path.node.init, ast)
					) {
						isJsxExpress = true
					}
				}
			})
	} else if (varnNameCount > 1) {
		let declCount = 0
		errorLogTraverse(ast, {
			exit: (path) => {
				if (path.node.type === 'VariableDeclarator'
					&& path.node.id
					&& path.node.id.type === 'Identifier'
					&& path.node.id.name === varnName
				) {
					declCount++
				}
			}
		})
		if (declCount === 1) {
			let varnIsJsx = true
			errorLogTraverse(ast, {
				exit: (path) => {
					if (path.node.type === 'AssignmentExpression'
						&& path.node.operator === '='
						&& path.node.left 
						&& path.node.left.type === 'Identifier'
						&& path.node.left.name === varnName
						&& path.node.right
						&& !checkEquationIsJSX(path.node.right, ast)
					) {
						varnIsJsx = false
					}
				}
			})
			if (varnIsJsx) {
				isJsxExpress = true
			}
		}
	}
	return isJsxExpress
}

/**
 * 判断 xx && yy 的结果是否为JSX类型
 * @param {*} node 
 * @param {*} ast 
 */
function checkLogiIsJsx(node, ast) {
	if (node.left
		&& checkExpressionIsJsx(node.right, ast)
	) {
		return true
	}
	return false
}

/**
 * 判断等式右边结果是否为JSX类型
 * @param {*} node
 * @param {*} ast
 */
function checkEquationIsJSX(node, ast) {
	if (
		node.type === 'JSXElement'
		|| (
			node.type === 'CallExpression'
			&& checkFuncIsJsx(node, ast)
		)
		|| (
			node.type === 'LogicalExpression'
			&& checkLogiIsJsx(node, ast)
		)
		|| (
			node.type === 'ConditionalExpression'
			&& checkExpressionIsJsx(node.consequent, ast)
			&& checkExpressionIsJsx(node.alternate, ast)
		)
	) {
		return true
	}
	return false
}

/**
 * 判断式子是否是JSX类型，分别判断以下三种情况
 * 1. 如果为<xxx></xxx>，则是JSX类型
 * 2. 如果是方法，如this.xx()，判断this.xx()方法返回的是否是JSX类型
 * 3. 如果是变量，如 x ，判断 x 变量是否是JSX类型
 * @param {*} node 
 * @param {*} ast 
 */
function checkExpressionIsJsx(node, ast) {
	if (node.type === 'JSXElement'
		|| checkFuncIsJsx(node, ast)
		|| (
			node.type === 'Identifier'
			&& checkVarnIsJsx(node.name, ast)
		)
	) {
		return true
	}
	return false
}
