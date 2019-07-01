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
import MyForceUpdateInnerInner from "./MyForceUpdateInnerInner.comp"
export default class MyForceUpdateInner extends Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", true)
    }

    shouldComponentUpdate() {
        console.log("MyForceUpdateInner shouldComponentUpdate")
        return true
    }

    render() {
        return h(MyForceUpdateInnerInner, {
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        })
    }
}
