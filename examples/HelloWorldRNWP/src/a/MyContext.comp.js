import React, { Component } from "@areslabs/wx-react"
const h = React.h
import PropTypes from "@areslabs/wx-prop-types"
import { View, Text } from "@areslabs/wx-react-native"
import styles from "./styles"
export default class MyContext extends Component {
    render() {
        return h(
            "block",
            {
                style: [
                    styles.item,
                    {
                        borderBottomWidth: 0
                    }
                ],
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
                    tempVnode: this.context.color,
                    isTextElement: true
                }),
                h("template", {
                    datakey: "CTDK00002",
                    tempVnode: this.props.name,
                    isTextElement: true
                }),
                h("template", {
                    datakey: "CTDK00003",
                    tempVnode: this.props.age,
                    isTextElement: true
                })
            )
        )
    }
}
MyContext.contextTypes = {
    color: PropTypes.string
}
