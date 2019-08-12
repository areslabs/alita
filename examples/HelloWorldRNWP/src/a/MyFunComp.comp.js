import React, { h } from "@areslabs/wx-react"
import PropTypes from "@areslabs/wx-prop-types"
import { View, Text } from "@areslabs/wx-react-native"
import styles from "./styles"
export default class MyFunComp extends React.FuncComponent {
    render() {
        const { color } = this.context
        const { name, age } = this.props
        return h(
            "block",
            {
                style: styles.item,
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00003"
            },
            h(
                "view",
                {
                    style: styles.itemText,
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                h("template", {
                    datakey: "CTDK00001",
                    tempVnode: name
                }),
                h("template", {
                    datakey: "CTDK00002",
                    tempVnode: age
                }),
                h("template", {
                    datakey: "CTDK00003",
                    tempVnode: color
                })
            )
        )
    }
}
MyFunComp.contextTypes = {
    color: PropTypes.string
}
