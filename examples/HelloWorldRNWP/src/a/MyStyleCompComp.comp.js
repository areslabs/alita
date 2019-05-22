import React, { Component, h } from "@areslabs/wx-react"
import MyStyleCompCompComp from "./MyStyleCompCompComp.comp"
export default class MyStyleCompComp extends Component {
    render() {
        return h(MyStyleCompCompComp, {
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        })
    }

    __stateless__ = true
}
