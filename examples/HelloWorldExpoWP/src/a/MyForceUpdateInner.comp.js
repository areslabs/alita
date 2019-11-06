import React, { Component } from "@areslabs/wx-react"
const h = React.h
import MyForceUpdateInnerInner from "./MyForceUpdateInnerInner.comp"
export default class MyForceUpdateInner extends Component {
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
