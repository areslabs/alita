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

import React, { h } from "@areslabs/wx-react"
import { View } from "@areslabs/wx-react-native"
export default class MyChildComp extends React.Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", true)
    }

    render() {
        return h(
            "block",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00005"
            },
            h("childrenCPT", {
                CPTVnode: this.props.children[2],
                diuu: "DIUU00002"
            }),
            h("childrenCPT", {
                CPTVnode: this.props.children[1],
                diuu: "DIUU00003"
            }),
            h("childrenCPT", {
                CPTVnode: this.props.children[0],
                diuu: "DIUU00004"
            })
        )
    }
}
