import {getModuleInfo} from '../util/cacheModuleInfos'
import {getRootPathPrefix, miscNameToJSName} from "../util/util"


export const handleChanged = (info, finalJSPath) => {
    const newWxOutFiles = {}

    const {isPageComp, outComp} = info.RFInfo

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


        newWxOutFiles[wxssFilepath] = wxssCode
    }



    return newWxOutFiles
}
