/**
 *  match the syntax like
 *    `import a from 'a'`
 *    `import { b, c } from 'a'`
 */

import * as t from '@babel/types'
import { defaultIgnoreImportList } from '.';

/**
 * get identifiers from the code, as follows
 *
 *  input:  `import { b, c } from 'a'`
 *  output: ['b', 'c']
 *
 *  input:  `import a from 'a'`
 *  output: ['a']
 */
function getSpecifierIdentifiers(specifiers = [], withPath = false) {
  	const collection = [];
  	function loop(path, index) {
    		const node = path.node
    		const item = !withPath ? node.local.name : { path, name: node.local.name }
    		switch (node.type) {
      			case 'ImportDefaultSpecifier':
      			case 'ImportSpecifier':
      			case 'ImportNamespaceSpecifier':
        				collection.push(item);
        				break;
   		 	}
  }
  specifiers.forEach(loop);

  return collection;
}

/**
 * input: `import a, {b, c as d} from 'where'`
 * output: [a, b, d]
 *
 * input: `import 'where'`
 * output: undefined
 */
export default function getSpecImport(path, opts = {}) {
  	const source = path.get('source')
  	const specifiers = path.get('specifiers')
  	const ignore = defaultIgnoreImportList
  	if (t.isImportDeclaration(path))  {
    	if (t.isStringLiteral(source) && (!ignore || !match(ignore, source.node.value))) {
      		if (specifiers && specifiers.length > 0) {
        	return getSpecifierIdentifiers(specifiers, true);
      		}
    	}
  	}
}

function match (rule, value) {
  	if (typeof rule === 'string') {
    	return rule === value
  	}
  	if (rule instanceof RegExp) {
    	return rule.test(value)
  	}
  	if (typeof rule === 'function') {
    	return rule(value)
  	}
  	if (Array.isArray(rule)) {
    	return rule.some(r => match(r, value))
  	}
}
