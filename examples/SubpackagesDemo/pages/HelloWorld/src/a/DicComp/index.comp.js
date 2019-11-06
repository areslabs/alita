import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { Text, View } from "@areslabs/wx-react-native"
export default class DicComp extends Component {
    render() {
        return h(
            "block",
            {
                style: this.props.style,
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00003"
            },
            h(
                "view",
                {
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                "\u6D4B\u8BD5\u5BFC\u5165\u76EE\u5F55"
            )
        )
    }
}
