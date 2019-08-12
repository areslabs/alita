import React, { h } from "@areslabs/wx-react"
import { View } from "@areslabs/wx-react-native"
export default class MyChildComp extends React.Component {
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
