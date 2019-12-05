/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as nodepath from 'path'
import { miscNameToJSName, getRootPathPrefix, wxCompoutPath} from '../util/util'

import configure from '../configure'

export default function geneWxss(info) {
    const {filepath, isPageComp, outComp, webpackContext} = info
    const finalJSPath = miscNameToJSName(filepath)

    const relativeJSPath = wxCompoutPath(finalJSPath)

    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        const wxssFilepath = (name === "render"
                ? relativeJSPath.replace(".js", ".wxss")
                : relativeJSPath.replace(".js", `${name}.wxss`)
        );

        const pageCommonPath = getRootPathPrefix(nodepath.resolve(relativeJSPath)) + "/pageCommon.wxss"
        const compCommonPath = getRootPathPrefix(nodepath.resolve(relativeJSPath)) + "/compCommon.wxss"

        let wxssCode = null
        if (name === 'render' && isPageComp) {
            wxssCode = `@import '${pageCommonPath}';
@import '${compCommonPath}';`
        } else {
            wxssCode =  `@import '${compCommonPath}';`
        }

        webpackContext.emitFile(
            wxssFilepath,
            wxssCode,
        );
    }
}
