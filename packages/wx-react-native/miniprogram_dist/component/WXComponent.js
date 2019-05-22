/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
    styleType,
    tackleWithStyleObj,
    RNBaseComponent
} from "@areslabs/wx-react"
const {VIEW} = styleType

export class WXBaseComponent extends RNBaseComponent {
    getStyle(props) {
        return {
            style: tackleWithStyleObj(props.style, VIEW),
        }
    }
}


export function getNotSupport(name) {
    return {
        notSupport() {
            console.error(`小程序不支持${name}`);
        }
    }
}