/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RNBaseComponent } from "@areslabs/wx-react"


export const BaseView = ""


export function getWXBaseComponent() {
    return class WXBaseComponent extends RNBaseComponent {
        getStyle(props) {
            return {
                style: this.transformViewStyle(props.style)
            }
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