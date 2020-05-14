/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
Component(wx.__bridge.reactCompHelper({
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


    },

    methods: {
        onValueChange() {
            this.data.onValueChange && this.data.onValueChange(!this.data.value)
        },
    }
}))