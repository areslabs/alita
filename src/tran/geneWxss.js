/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from "fs-extra";
import {getRootPathPrefix} from '../util/util'

export default function geneWxss(info) {
    let {filepath, isPageComp, outComp} = info
    filepath = filepath.replace(".wx.js", ".js");

    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        const wxssFilepath = (name === "render"
                ? filepath.replace(".js", ".wxss")
                : filepath.replace(".js", `${name}.wxss`)
        );

        const pageCommonPath = getRootPathPrefix(filepath) + "/pageCommon.wxss"
        const compCommonPath = getRootPathPrefix(filepath) + "/compCommon.wxss"

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