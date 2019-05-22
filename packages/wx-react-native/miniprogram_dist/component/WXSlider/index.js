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
        diuu: null,
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu)
    },
    methods: {
        onValueChange(val) {
            const method = getPropsMethod(this, 'onValueChange')
            method && method(val.detail.value / 100)
        },
        onSlidingComplete(val) {
            const method = getPropsMethod(this, 'onSlidingComplete')
            method && method(val.detail.value / 100)
        }
    }
})