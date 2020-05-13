/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 

Component(wx.__bridge.reactCompHelper({
    properties: {
        source: null,
    },

    methods: {
        onMyMessage: function(e) {
            this.data.onMessage && this.data.onMessage(e)
        },
        onMyLoad: function (e) {
            this.data.onLoad && this.data.onLoad(e)
        },
        onMyError: function (e) {
            this.data.onError && this.data.onError(e)
        }
    }
}))