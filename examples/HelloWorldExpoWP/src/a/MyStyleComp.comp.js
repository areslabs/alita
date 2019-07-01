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
import MyStyleCompComp from "./MyStyleCompComp.comp"
export default class MyStyleComp extends Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", true)
    }

    render() {
        return h(MyStyleCompComp, {
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        })
    }
}
