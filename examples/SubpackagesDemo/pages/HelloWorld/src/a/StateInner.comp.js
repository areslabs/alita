import React from "@areslabs/wx-react"
const h = React.h
import { View, Text } from "@areslabs/wx-react-native"
export default class StatelessTest extends React.Component {
    render() {
        const { label, name } = this.props
        return h(
            "block",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00004"
            },
            h(
                "view",
                {
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                h("template", {
                    datakey: "CTDK00001",
                    tempVnode: label
                })
            ),
            h(StateInner, {
                name: name,
                diuu: "DIUU00003"
            })
        )
    }
}
