/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 

Component(wx.__bridge.reactCompHelper({
    properties: {
        selectedValue: null,
        onValueChange: null,
    },


    methods: {
        onValueChange: function (e) {
            const index = e.detail.value[0];

            const pickData = this.data._r.pickData
            const value = pickData[index].value

            this.data.onValueChange && this.data.onValueChange(value, index)
        }
    },
}))