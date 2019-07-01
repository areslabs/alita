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
import { Text, View } from "@areslabs/wx-react-native"
export default class PlatformComp extends Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", true)
    }

    render() {
        return h(
            "block",
            {
                style: this.props.style,
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00003"
            },
            h(
                "view",
                {
                    style: {
                        color: "#444",
                        fontSize: 14
                    },
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                "WEIXIN PlatformComp"
            )
        )
    }
}
