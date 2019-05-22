/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {RNBaseComponent, tackleWithStyleObj, styleType} from '@areslabs/wx-react'
const {VIEW} = styleType

export default class Hi extends RNBaseComponent{
    getStyle(props) {
        return {
            style: tackleWithStyleObj(props.style, VIEW),
            textStyle: tackleWithStyleObj(props.textStyle),
        }
    }
}