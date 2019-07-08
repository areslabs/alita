import React, { Component, h } from "@areslabs/wx-react"
import MyForceUpdateInnerInner from "./MyForceUpdateInnerInner.comp"
export default class MyForceUpdateInner extends Component {
    constructor(...args) {
        super(...args)
        this.__stateless__ = true
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
