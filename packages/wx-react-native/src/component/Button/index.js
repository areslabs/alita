/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {RNBaseComponent} from '@areslabs/wx-react'

export default class WXButton extends RNBaseComponent{

    getStyle(props) {
        return {
            // Button 不接受style属性
            style: this.transformViewStyle('')
        }
    }
}