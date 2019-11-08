import checkJSX from './checkJSX'
import checkBase from './checkBase'
import checkEntry from './checkEntry'

export default function precheck(ast, isEntry, isR, filepath, rawCode) {

    const relativePath = filepath.replace(global.execArgs.INPUT_DIR, '')


    if (isEntry) {
        const basePass = checkBase(ast, relativePath, rawCode)
        const entryPass = checkEntry(ast, relativePath, rawCode)
        return basePass && entryPass
    } else if (isR) {
        const basePass = checkBase(ast, relativePath, rawCode)
        const jsxPass = checkJSX(ast, relativePath, rawCode)
        return basePass && jsxPass
    } else {
        return checkBase(ast, relativePath, rawCode)
    }
}


