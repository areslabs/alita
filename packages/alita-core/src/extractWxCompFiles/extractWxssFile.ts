import {RootPrefixPlaceHolader} from "../util/util"


export const handleChanged = (info, finalJSPath) => {
    const newWxOutFiles = {}

    const wxssFilepath = finalJSPath.replace(".js", ".wxss")

    const pageCommonPath = `${RootPrefixPlaceHolader}/pageCommon.wxss`
    const compCommonPath = `${RootPrefixPlaceHolader}/compCommon.wxss`;

    const wxssCode = `@import '${pageCommonPath}';
@import '${compCommonPath}';`

    newWxOutFiles[wxssFilepath] = wxssCode

    return newWxOutFiles
}
