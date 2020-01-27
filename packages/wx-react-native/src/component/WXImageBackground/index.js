/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {RNBaseComponent} from '@areslabs/wx-react'

export default class WXImageBackground extends RNBaseComponent{


    getStyle(props) {
        return {
            style: this.transformViewStyle(props.style),
            imageStyle: this.transformStyle(props.imageStyle),

            //TODO 这里的getStyle应该重构为 getMpProps ... 更加合适
            resizeMode: resizeMode(props.resizeMode)
        }
    }
}

function resizeMode(newVal){
    if(newVal === 'cover'){
        return 'aspectFill';
    } else if (newVal === 'contain'){
        return 'aspectFit';
    } else if (newVal === 'stretch'){
        return 'scaleToFill';
    } else if (newVal === 'repeat') {
        console.warn('Image的resizeMode属性小程序端不支持repeat')
        return 'aspectFill'
    } else if (newVal === 'center') {
        return 'aspectFill'
    } else{
        return 'aspectFill';
    }
}

