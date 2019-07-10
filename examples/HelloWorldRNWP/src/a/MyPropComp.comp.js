import React, { Component, h } from "@areslabs/wx-react"
import { View } from "@areslabs/wx-react-native"
export default class MyPropComp extends Component {
    constructor(...args) {
        super(...args)
        this.__stateless__ = true
    }

    render() {
        return h(
            "block",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00004"
            },
            h("headerComponentCPT", {
                CPTVnode: this.props.headerComponent,
                diuu: "DIUU00002"
            }),
            h("footerComponentCPT", {
                CPTVnode: this.props.footerComponent(),
                diuu: "DIUU00003"
            })
        )
    }
}
