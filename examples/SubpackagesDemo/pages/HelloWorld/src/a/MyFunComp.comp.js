import React from "@areslabs/wx-react"
const h = React.h
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
                    tempVnode: name,
                    isTextElement: true
                }),
                h("template", {
                    datakey: "CTDK00002",
                    tempVnode: age,
                    isTextElement: true
                }),
                h("template", {
                    datakey: "CTDK00003",
                    tempVnode: color,
                    isTextElement: true
                })
            )
        )
    }
}
MyFunComp.contextTypes = {
    color: PropTypes.string
}
