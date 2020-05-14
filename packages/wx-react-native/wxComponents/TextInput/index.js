/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

Component(wx.__bridge.reactCompHelper({
    properties: {
        disabled: {
            type: Boolean,
            value: false
        },
        placeholder: {
            type: String,
            value: ''
        },
        autoFocus: {
            type: Boolean,
            value: false
        },

        defaultValue: {
            type: String,
            value: ''
        },

        value: {
            type: String,
            value: ''
        },


        autoCapitalize: {
            type: String,
            value: 'none'
        },
        placeholderTextColor: null,
        multiline: {
            type: Boolean,
            value: false
        },
        editable: {
            type: Boolean,
            value: true
        },
        keyboardType: {
            type: String,
            value: 'default'
        },
        maxLength: {
            type: Number,
            value: -1
        },

    },

    data: {
        focusFlag: false
    },


    methods: {
        inneronblur: function(val) {
            this.__isFocused = false

            this.data.onEndEditing && this.data.onEndEditing(val.detail.value)

            this.data.onBlur && this.data.onBlur(val.detail.value)
        },
        zoomFirst: function(str) {
            const arr = [...str]
            if (arr.length) {
                for (let k = 0; k < arr.length; k++) {
                    if ((arr[k] >= 'a' && arr[k] <= 'z') || (arr[k] >= 'A' && arr[k] <= 'Z')) {
                        arr[k] = arr[k].toUpperCase()
                        break
                    }
                }
            }
            return arr.join('')
        },
        inneronInput: function(val) {
            this.data.onKeyPress && this.data.onKeyPress(val.detail.keyCode)

            this.data.onChange && this.data.onChange(val.detail.keyCode)

            var str = val.detail.value
            let setencs;
            let out = ''
            switch (this.data.autoCapitalize) {
                case 'characters': {
                    out = str.toUpperCase()
                    break
                }
                case 'sentences': {
                    setencs = str.split(/[.;]/g);
                    setencs = setencs.map(e => this.zoomFirst(e))
                    out = setencs.join('.')
                    break
                }
                case 'words': {
                    setencs = str.split(' ');
                    setencs = setencs.map(e => this.zoomFirst(e))
                    out = setencs.join(' ')
                    break
                }
                default: {
                    out = str
                    break
                }
            }

            this.data.onChangeText && this.data.onChangeText(val.detail.value)
        },
        inneronFocus: function() {
            this.__isFocused = true

            this.data.onFocus && this.data.onFocus()
        },
        clear: function() {
            this.setData({
                value: ''
            });
        },

        isFocused: function() {
            return this.__isFocused
        },

        focus: function () {
            this.setData({
                focusFlag: true
            })
        }
    }
}))