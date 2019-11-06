/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from "fs-extra";
import {getRootPathPrefix, miscNameToJSName} from '../util/util'

export default function geneWxss(info) {
    const {filepath, isPageComp, outComp} = info
    const finalJSPath = miscNameToJSName(filepath)

    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        const wxssFilepath = (name === "render"
                ? finalJSPath.replace(".js", ".wxss")
                : finalJSPath.replace(".js", `${name}.wxss`)
        );

        const pageCommonPath = getRootPathPrefix(finalJSPath) + "/pageCommon.wxss"
        const compCommonPath = getRootPathPrefix(finalJSPath) + "/compCommon.wxss"

        let wxssCode = null
        if (name === 'render' && isPageComp) {
            wxssCode = `@import '${pageCommonPath}';
@import '${compCommonPath}';`
        } else {
            wxssCode =  `@import '${compCommonPath}';`
        }

        fse.writeFileSync(
            wxssFilepath,
            wxssCode,
            {
                flag: "w+"
            }
        );
    }
}