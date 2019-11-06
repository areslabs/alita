import React from "@areslabs/wx-react"
const h = React.h
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
