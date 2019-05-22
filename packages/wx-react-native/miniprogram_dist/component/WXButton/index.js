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

        diuu: null
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu)
    },

    methods: {
        innerPress: function () {
            if(this.data.disabled) return
            const method = getPropsMethod(this, 'onPress')
            method && method()
        }
    },
})