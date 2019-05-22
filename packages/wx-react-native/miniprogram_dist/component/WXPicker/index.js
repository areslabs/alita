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
        _r: null
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    ready() {
        instanceManager.setWxCompInst(this.data.diuu, this)
        const compInst = instanceManager.getCompInstByUUID(this.data.diuu)
        if (!compInst.firstRender) {
            compInst.firstUpdateUI()
        }
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu)
    },

    methods: {
        onValueChange: function (e) {
            const index = e.detail.value[0];
            const value = this.data._r.pickData[index].value

            const method = getPropsMethod(this, 'onValueChange')
            method && method(value, index)
        }
    },
})