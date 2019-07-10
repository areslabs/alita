import React, { Component, h } from "@areslabs/wx-react"
import MyStyleCompCompComp from "./MyStyleCompCompComp.comp"
export default class MyStyleCompComp extends Component {
    constructor(...args) {
        super(...args)
        this.__stateless__ = true
    }

    render() {
        return h(MyStyleCompCompComp, {
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        })
    }
}
