import {RootPrefixPlaceHolader} from "../util/util"


export const handleChanged = (info, finalJSPath) => {
    const newWxOutFiles = {}

    const {isPageComp, outComp} = info.RFInfo

    for (let i = 0; i < outComp.length; i++) {
        const name = outComp[i];

        const wxssFilepath = (name === "default"
                ? finalJSPath.replace(".js", ".wxss")
                : finalJSPath.replace(".js", `${name}.wxss`)
        );


        const pageCommonPath = `${RootPrefixPlaceHolader}/pageCommon.wxss`
        const compCommonPath = `${RootPrefixPlaceHolader}/compCommon.wxss`;

        let wxssCode = null
        if (name === 'default' && isPageComp) {
            wxssCode = `@import '${pageCommonPath}';
@import '${compCommonPath}';`
        } else {
            wxssCode =  `@import '${compCommonPath}';`
        }


        newWxOutFiles[wxssFilepath] = wxssCode
    }



    return newWxOutFiles
}
