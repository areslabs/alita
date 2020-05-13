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
        imageStyle: null,
        resizeMode: null
    },

    methods: {
        onLoad: function () {
            this.data.onLoad && this.data.onLoad()
        },

        onError: function () {
            this.data.onError && this.data.onError()
        }
    },
}))