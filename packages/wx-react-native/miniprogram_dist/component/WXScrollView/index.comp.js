/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {
    RNBaseComponent,
    tackleWithStyleObj,
    instanceManager,
    styleType
} from '@areslabs/wx-react'
const {SCROLL} = styleType

export default class WXScrollView extends RNBaseComponent{
    scrollTo(position) {
        const wxInst = instanceManager.getWxInstByUUID(this.__diuu__)
        wxInst.scrollTo(position)
    }

    scrollToEnd() {
        const wxInst = instanceManager.getWxInstByUUID(this.__diuu__)
        wxInst.scrollTo({
            x: 9999999,
            y: 9999999
        })
    }


    getStyle(props) {
        return {
            style: tackleWithStyleObj(props.style, SCROLL),
            contentContainerStyle: tackleWithStyleObj(props.contentContainerStyle)
        }
    }
}