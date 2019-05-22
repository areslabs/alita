/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {getPropsMethod, instanceManager} from '@areslabs/wx-react'

Component({
    properties: {
        visible: {
            type: Boolean,
            value: false,
            observer: function (nv) {
                if (nv) {
                    const onShow = getPropsMethod(this, 'onShow')
                    onShow && onShow()
                } else {
                    const onDismiss = getPropsMethod(this, 'onDismiss')
                    onDismiss && onDismiss()
                }
            }
        },
        transparent: {
            type: Boolean,
            value: false
        },
        animationType: {
            type: String,
            value: 'none'
        },
        diuu: null,
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu)
    },
})
