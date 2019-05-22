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
        source: null,
        diuu: null,
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu)
    },

    methods: {
        onMyMessage: function(e) {
            const method = getPropsMethod(this, 'onMessage');
            method && method(e);
        },
        onMyLoad: function (e) {
            const method = getPropsMethod(this, 'onLoad')
            method && method(e)
        },
        onMyError: function (e) {
            const method = getPropsMethod(this, 'onError')
            method && method(e);
        }
    }
});