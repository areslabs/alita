import React, { Component, h } from "@areslabs/wx-react"
import PropTypes from "@areslabs/wx-prop-types"
import { View, Text } from "@areslabs/wx-react-native"
import styles from "./styles"
export default class MyContext extends Component {
    static contextTypes = {
        color: PropTypes.string
    }

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
                    datakey: "CTDK00002",
                    tempVnode: this.context.color,
                    "wx:if": "{{CTDK00002}}",
                    is: "CTNP00001",
                    data: "{{...CTDK00002}}"
                }),
                h("template", {
                    datakey: "CTDK00003",
                    tempVnode: this.props.name,
                    "wx:if": "{{CTDK00003}}",
                    is: "CTNP00001",
                    data: "{{...CTDK00003}}"
                }),
                h("template", {
                    datakey: "CTDK00004",
                    tempVnode: this.props.age,
                    "wx:if": "{{CTDK00004}}",
                    is: "CTNP00001",
                    data: "{{...CTDK00004}}"
                })
            )
        )
    }

    __stateless__ = true
}
