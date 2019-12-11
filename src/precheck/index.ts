import checkJSX from './checkJSX'
import checkBase from './checkBase'
import checkEntry from './checkEntry'

import configure from '../configure'

export default function precheck(ast, isEntry, isR, filepath, rawCode) {

    const relativePath = filepath.replace(configure.inputFullpath, '')


    if (isEntry) {
        checkBase(ast, relativePath, rawCode)
        checkEntry(ast, relativePath, rawCode)
    } else if (isR) {
        checkBase(ast, relativePath, rawCode)
        checkJSX(ast, relativePath, rawCode)
    } else {
        checkBase(ast, relativePath, rawCode)
    }
}


