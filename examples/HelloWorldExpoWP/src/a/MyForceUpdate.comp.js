function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}

import React, { Component, h } from "@areslabs/wx-react"
import { TouchableOpacity, View } from "@areslabs/wx-react-native"
import MyForceUpdateInner from "./MyForceUpdateInner.comp"
export default class MyForceUpdate extends Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", false)
    }

    shouldComponentUpdate() {
        console.log("MyForceUpdate shouldComponentUpdate")
        return true
    }

    componentWillUpdate() {
        console.log("MyForceUpdate componentWillUpdate")
    }

    render() {
        return h(
            "block",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00004"
            },
            h(
                "view",
                {
                    onPress: () => {
                        this.forceUpdate(() => {
                            console.log("end forceUpdate")
                        })
                    },
                    original: "TouchableOpacity",
                    diuu: "DIUU00002"
                },
                h(MyForceUpdateInner, {
                    diuu: "DIUU00003"
                })
            )
        )
    }
}
