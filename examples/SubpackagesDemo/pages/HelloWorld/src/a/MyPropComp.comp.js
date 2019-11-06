import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { View } from "@areslabs/wx-react-native"
export default class MyPropComp extends Component {
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
