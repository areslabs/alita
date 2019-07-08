import React, { h } from "@areslabs/wx-react"
import { View, Text } from "@areslabs/wx-react-native"
export default class StatelessTest extends React.Component {
    constructor(...args) {
        super(...args)
        this.__stateless__ = true
    }

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
                    datakey: "CTDK00002",
                    tempVnode: label,
                    "wx:if": "{{CTDK00002}}",
                    is: "CTNP00001",
                    data: "{{...CTDK00002}}"
                })
            ),
            h(StateInner, {
                name: name,
                diuu: "DIUU00003"
            })
        )
    }
}
