import traverse from "@babel/traverse"
import * as t from '@babel/types'

/**
 * 删除调非wx平台的代码
 * if (Platform.OS === 'wx) { ... } else { ... } ===> if (Platform.OS === 'wx) { ... }  ('wx' === Platform.OS) 同理）
 * if (Platform.OS !== 'wx) { ... } else { ... } ===> if (Platform.OS !== 'wx) {  } else { ... }
 * let value = Platform.OS === 'wx? value1 : value2 ===> let value = value1
 * let value = Platform.OS !== 'wx? value2 : value1 ===> let value = value2
 */
export default function deleteNoWxCode(ast) {
    traverse(ast, {
      	IfStatement(path) {
        	try {
				checkAndRemoveCode(path, true, false)
          	} catch(e) {
            console.log(e)
          }
        }
	})

	traverse(ast, {
		ConditionalExpression(path) {
			try {
				checkAndRemoveCode(path, false, true)
			} catch (e) {
				console.log(e);
			}
		}
	});
	
    return ast
}

function checkAndRemoveCode(path,isIfStatement,isConditionalExpression){
  	let hasPlatformOS = false; //条件语句存在 Platform.OS
  	path.traverse({
		MemberExpression(path) {
			if (t.isIdentifier(path.node.object, { name: "Platform"}) 
					&& t.isIdentifier(path.node.property, { name: "OS" })) {
				hasPlatformOS = true;
			}
		}
  	});

	if (hasPlatformOS && t.isBinaryExpression(path.node.test, { operator: "===" }) 
			&& (t.isStringLiteral(path.node.test.right, { value: "wx"}) || t.isStringLiteral(path.node.test.left, { value: "wx"}))) {
		if (isIfStatement && path.node.alternate) {
			path.node.alternate = null;
		} else if(isConditionalExpression && path.node.consequent){
			path.parent.right = path.node.consequent
		} 
	}

  	if (hasPlatformOS && t.isBinaryExpression(path.node.test, { operator: "!==" }) 
			&& (t.isStringLiteral(path.node.test.right, { value: "wx" }) || t.isStringLiteral(path.node.test.left, { value: "wx"}))) {
		if (isIfStatement && path.node.consequent) {
			path.node.consequent.body= [];
		} else if(isConditionalExpression && path.node.alternate){
			path.parent.right = path.node.alternate
		}
  	}
}