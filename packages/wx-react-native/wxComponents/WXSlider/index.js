/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 

Component(wx.__bridge.reactCompHelper({
    properties: {
        maximumValue: {
            type: Number,
            value: 100
        },
        minimumValue: {
            type: Number,
            value: 0
        },
        value: {
            type: Number,
            value: 0
        },
        step: {
            type: Number,
            value: 0
        },
        disabled: {
            type: Boolean,
            value: false
        },
        minimumTrackTintColor: {
            type: null
        },
        maximumTrackTintColor: {
            type: null
        },
    },


    methods: {
        onValueChange(val) {
            this.data.onValueChange && this.data.onValueChange(val.detail.value / 100)
        },
        onSlidingComplete(val) {
            this.data.onValueChange && this.data.onSlidingComplete(val.detail.value / 100)
        }
    }
}))