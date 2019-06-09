/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "../help/customExpect";
import addWXPrefixHandler from '../../src/tran/addWXPrefixHandler'
import {expectNewCode} from '../help/utils'


describe('addWXPrefixHandler', () => {

    beforeEach(() => {
        global.execArgs = {
            INPUT_DIR: '/a',
            OUT_DIR: '/b',
            watchMode: false
        }
    })

    it('View等基本组件特殊转化', () => {
        let code = `<View/>`
        let expectCode = `<view original="View" />`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)


        code = `<Text/>`
        expectCode = `<view original="OuterText" />`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)

        code = `<Text><Text/></Text>`
        expectCode =
            `import { WXTextInner } from "@areslabs/wx-react-native"
            <view original="OuterText">
              <view original="InnerText" />
            </view>`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)

        code = `<Image/>`
        expectCode =
            `<image mode={"cover"} />`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)

        code = `<TouchableWithoutFeedback/>`
        expectCode =
            `<view original="TouchableWithoutFeedback"/>`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)

        code = `<AnimatedView/>`
        expectCode =
            `<view original="AnimatedView"/>`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)

        code = `<AnimatedText/>`
        expectCode =
            `<view original="AnimatedText"/>`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)
    })

    it('Button等基本组件，添加WX前缀', () => {
        const code = `<Button/>`
        const expectCode = `<WXButton/>`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)
    })

    it('基本组件Image 属性处理', () => {
        let code = `<Image source={{uri: "http://123.jpg"}}/>`
        let expectCode = `<image
                              src={{
                                uri: "http://123.jpg"
                              }}
                              mode={"cover"}
                            />`
        expectNewCode(code, expectCode, {}, addWXPrefixHandler)
    })
})

