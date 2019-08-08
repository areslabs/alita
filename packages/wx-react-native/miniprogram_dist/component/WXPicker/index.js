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
        selectedValue: {
            type: null
        },
        onValueChange: null,
        diuu: null,
        R: null
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },


    detached() {
        instanceManager.removeWxInst(this.data.diuu)
    },

    methods: {
        onValueChange: function (e) {
            const index = e.detail.value[0];

            const pickData = (this.data._r || this.data.R).pickData
            const value = pickData[index].value

            const method = getPropsMethod(this, 'onValueChange')
            method && method(value, index)
        }
    },
})