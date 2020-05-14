/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {RNBaseComponent} from '@areslabs/wx-react'

function getStyleStr(visible, transparent, animationType) {
    var ss = '';
    ss += (visible ? 'visibility: visible;' : 'visibility: hidden;');
    ss += (transparent ? 'background-color: transparent;' : 'background-color: white;');

    if (animationType === 'none') {

    } else if (animationType === 'slide') {
        ss += 'transition: all 0.3s;';

        if (!visible) {
            ss += 'top: 100vh;';
        } else {
            ss += 'top: 0;';
        }
    } else if (animationType === 'fade') {
        ss += 'transition: all 0.2s;';

        if (!visible) {
            ss += 'opacity: 0';
        } else {
            ss += 'opacity: 1'
        }
    }
    return ss
}
export default class WXModal extends RNBaseComponent{

    getStyle(props) {
        const {visible, transparent, animationType} = props
        return {
            style: `display: flex; position: fixed; top:0; bottom:0; left:0; right:0; z-index: 100000; ${getStyleStr(visible, transparent, animationType)}`,
        }
    }
}