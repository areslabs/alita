/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
Component(wx.__bridge.reactCompHelper({
    properties: {
        visible: {
            type: Boolean,
            value: false,
            observer: function (nv) {
                if (nv) {
                    this.data.onShow && this.data.onShow()
                } else {
                    this.data.onDismiss && this.data.onDismiss()
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
    },
}))
