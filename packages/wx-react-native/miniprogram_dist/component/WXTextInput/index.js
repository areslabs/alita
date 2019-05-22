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

        diuu: null
    },

    data: {
        focusFlag: false
    },

    attached() {
        instanceManager.setWxCompInst(this.data.diuu, this)
    },

    detached() {
        instanceManager.removeUUID(this.data.diuu)
    },

    methods: {
        inneronblur: function(val) {
            this.__isFocused = false

            const onEndEditing = getPropsMethod(this, 'onEndEditing')
            onEndEditing && onEndEditing(val.detail.value)

            const onBlur = getPropsMethod(this, 'onBlur')
            onBlur && onBlur(val.detail.value)
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
            const onEndEditing = getPropsMethod(this, 'onKeyPress')
            onEndEditing && onEndEditing(val.detail.keyCode)

            const onChange = getPropsMethod(this, 'onChange')
            onChange && onChange(val.detail.keyCode)

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
            const onChangeText = getPropsMethod(this, 'onChangeText')
            onChangeText && onChangeText(val.detail.value)
        },
        inneronFocus: function() {
            this.__isFocused = true
            const onFocus = getPropsMethod(this, 'onFocus')
            onFocus && onFocus()
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
});