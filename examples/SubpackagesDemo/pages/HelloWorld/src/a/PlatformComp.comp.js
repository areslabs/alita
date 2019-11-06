import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { Text, View } from "@areslabs/wx-react-native"
export default class PlatformComp extends Component {
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
                    style: {
                        color: "#444",
                        fontSize: 14
                    },
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                "WEIXIN PlatformComp"
            )
        )
    }
}
