import React, { Component, h } from "@areslabs/wx-react"
import MyStyleCompComp from "./MyStyleCompComp.comp"
export default class MyStyleComp extends Component {
    constructor(...args) {
        super(...args)
        this.__stateless__ = true
    }

    render() {
        return h(MyStyleCompComp, {
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        })
    }
}
