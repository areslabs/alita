/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { codeFrameColumns } from '@babel/code-frame'

export function printError(filepath, path, rawCode, message) {
    const loc = path.node.loc
    console.log(`${filepath} 行${loc.start.line}: ${message}`.error)

    const result = codeFrameColumns(rawCode, loc, {
        highlightCode: true,
        linesAbove: 2,
        linesBelow: 2,
    });
    console.log(result)
}