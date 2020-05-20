/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

Component(wx.__bridge.reactCompHelper({
    properties: {
        disabled: {
            type: Boolean,
            value: false,
        },
        color: {
            type: String,
            value: "",
        },
        title: {
            type: String,
            value: '',
        },
    },


    methods: {
        innerPress: function () {
            if(this.data.disabled) return
            this.data.onPress && this.data.onPress()
        }
    },
}))