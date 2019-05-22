/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import fse from "fs-extra";
const path = require('path')

/**
 */
export default function(info) {
    let {json, filepath, outComp} = info
    filepath = filepath.replace('.wx.js', '.js')

    const renderUsingComponents = {
        ...json.usingComponents
    }

    for(let i = 0; i < outComp.length; i ++) {
        const name = outComp[i]
        if (name === 'render') {
            continue
        } else {
            renderUsingComponents[name] = path.basename(filepath).replace('.js', `${name}`)
        }
    }


    const renderJSON = {
        ...json,
        usingComponents: renderUsingComponents
    }

    let renderJSONStr =  JSON.stringify(renderJSON, null, '\t')

    //TODO 微信在npm自定义组件和componentGenerics 同用的时候有bug， 这里如果componentGenerics 里如果设置为true 会报错， 故设置为"true"
    //TODO 详情在https://developers.weixin.qq.com/community/develop/doc/00008850dfc788ac9a774294b5b400?highLine=Path%2520must%2520be%2520a%2520string.%2520Received%2520true

    for(let i = 0; i < outComp.length; i ++) {
        const name = outComp[i]

        const comppath = (name === 'render' ? filepath.replace('.js', `.json`) : filepath.replace('.js', `${name}.json`))
        fse.writeFileSync(
            comppath,
            renderJSONStr,
            {
                flag: 'w+'
            }
        )
    }

}