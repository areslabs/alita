/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import { RNBaseComponent} from '@areslabs/wx-react'

export default class WXScrollView extends RNBaseComponent{
    scrollTo(position) {
        const wxInst = this.getWxInst()
        wxInst.scrollTo(position)
    }

    scrollToEnd() {
        const wxInst = this.getWxInst()
        wxInst.scrollTo({
            x: 9999999,
            y: 9999999
        })
    }


    getStyle(props) {
        return {
            style: this.transformScrollViewStyle(props.style),
            contentContainerStyle: this.transformStyle(props.contentContainerStyle)
        }
    }
}