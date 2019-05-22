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
        disabled:{
            type:Boolean,
            value:false,
        },

        tintColor:{
            type:String,
            value:"",
        },
        value:{
            type:Boolean,
            value:false,
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
        onValueChange() {
            const method = getPropsMethod(this, 'onValueChange')
            method && method(!this.data.value)
        },
    }
})