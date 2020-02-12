import traverse from "@babel/traverse"
import { codeFrameColumns } from '@babel/code-frame'

import configure from '../configure'

export default function myTraverse (ast, opts) {


    const newOpts = wrappCatchOpts(ast, opts)

    traverse(ast, newOpts)
}


function wrappCatchOpts(ast, opts) {

    const newOpts = {}

    const allKeys = Object.keys(opts)
    for(let i = 0; i < allKeys.length; i ++ ) {
        const k = allKeys[i]
        const v = opts[k]

        if (typeof v === 'function') {
            newOpts[k] = wrapperCatch(ast, v)
        } else {
            newOpts[k] = v
        }
    }

    return newOpts
}

function wrapperCatch(ast, func) {
    return function (...args) {
        try {
            return func(...args)
        } catch(e) {

            const relativeFilePath = ast.__filepath.replace(configure.inputFullpath, '')
            const code = ast.__sourceCode

            const loc = args[0].node.loc

            if (!loc) {
                console.log(`异常信息:\n`.error, e)
                throw e
            }


            const result = codeFrameColumns(code, loc, {
                highlightCode: true,
                linesAbove: 2,
                linesBelow: 2,
            });
            console.log(`${relativeFilePath} 转化出错，这可能是alita本身的bug，please submit an issue with below infomations。`.error)
            console.log(`代码片段:\n`.error, result)
            console.log(`异常信息:\n`.error, e)

            throw e
        }
    }
}

