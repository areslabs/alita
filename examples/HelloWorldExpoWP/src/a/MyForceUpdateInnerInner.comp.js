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
import { View, Text } from "@areslabs/wx-react-native"
import styles from "./styles"
export default class MyForceUpdateInnerInner extends Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", true)
    }

    shouldComponentUpdate() {
        console.log("MyForceUpdateInnerInner shouldComponentUpdate")
        return true
    }

    render() {
        console.log("xxx:", new Date().getTime(), this)
        return h(
            "block",
            {
                style: styles.item,
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00003"
            },
            h(
                "view",
                {
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                "forceUpdate: ",
                h("template", {
                    datakey: "CTDK00002",
                    tempVnode: new Date().getTime(),
                    "wx:if": "{{CTDK00002}}",
                    is: "CTNP00001",
                    data: "{{...CTDK00002}}"
                })
            )
        )
    }
}
