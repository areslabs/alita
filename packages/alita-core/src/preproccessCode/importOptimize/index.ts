import getSpecImport from './getSpecImport'
import traverse from "@babel/traverse"
import * as t from '@babel/types'

export const defaultIgnoreImportList = ['react']

//移除无用的的Import，减少 import不支持的转化的模块导致转化错误
export default function optimizeImports(ast) {
	let runtimeData ={}
	//移除无用的Import
	traverse(ast, {
		Program(path) {
			path.traverse(importTraverseObject, {runtimeData: runtimeData});
        	handleRemovePath(runtimeData)
		}
	})
	return ast
}

const idTraverseObject = {
  	JSXIdentifier(path, {runtimeData}) {
      	const { parentPath } = path
      	const { name } = path.node

    	if ( parentPath.isJSXOpeningElement() && parentPath.get('name') === path
      			|| parentPath.isJSXMemberExpression() && parentPath.get('object') === path) {
			if (runtimeData[name]) {
				delete runtimeData[name]
			}
		}
	},
  	Identifier(path, {runtimeData}) {
    	const { parentPath } = path
    	const { name } = path.node
    	// const ID = 'value';
    	if (parentPath.isVariableDeclarator() && parentPath.get('id') === path) {}
		// const x = { Tabs: 'value' }
		else if (parentPath.isObjectProperty() && parentPath.get('key') === path) {}
		// { Tabs: 'value' }
		else if (parentPath.isLabeledStatement() && parentPath.get('label') === path) {}
		// ref.ID
		else if (parentPath.isMemberExpression()&& parentPath.get('property') === path && parentPath.node.computed === false) {}
		// class A { ID() {} }
		else if ((parentPath.isClassProperty() || parentPath.isClassMethod()) && parentPath.get('key') === path) {}
		else {
			// used
			if (runtimeData[name]) {
				delete runtimeData[name]
			}
		}
  }
}

const importTraverseObject = {
	ImportDeclaration(path, data) {
		const { opts = {}, runtimeData } = data
		path.skip()
		const locals = getSpecImport(path, { withPath: true, ignore: opts.ignore });
		if (locals) {
			locals.forEach((pathData, index, all) => {
				const { name } = pathData
				if (runtimeData[name]) {
					return
				}
				runtimeData[name] = {
					parent: path,
					children: all,
					data: pathData
				}
			})
		}
	},
	...idTraverseObject
}

function handleRemovePath(runtimeData, opts = {}) {
	/*
	{
	parent: path,
	children: [ { path, name } ],
	data: { path, name }
	}
	*/
	const allNames = Object.keys(runtimeData)
	allNames.forEach(name => {
		const {children, data, parent} = runtimeData[name]
		const childNames = children.map(x => x.name)
		// every imported identifier is unused
		if (childNames.every(cName => allNames.includes(cName))) {
			!parent.__removed && parent.remove();
			parent.__removed = true
		} else {
			const path = data.path
			path.remove();
		}
	})
}


