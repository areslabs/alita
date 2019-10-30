/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {reactCompHelper} from '@areslabs/wx-react'

Component(reactCompHelper({
    properties: {
        name: null,
        textStyle: null,
    },

    data: {
        ani: {}
    },

    ready() {
        var ani =  wx.createAnimation({
            duration: 5000,
            timingFunction: 'linear'
        })
        ani
            .opacity(0)
            .step()

        this.setData({
            ani: ani,
        })
    },

    methods: {
        handlePress: function () {
            console.log('Hi ', this.data.name, ' !')
            this.data.textPress && this.data.textPress()
        }
    }
}));