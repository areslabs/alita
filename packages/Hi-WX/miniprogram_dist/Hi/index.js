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
        name: null,
        textStyle: null,
        diuu: null,
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu)
    },

    methods: {
        handlePress: function () {
            console.log('Hi ', this.data.name, ' !')
            const method = getPropsMethod(this, 'textPress')
            method && method()
        }
    }
});