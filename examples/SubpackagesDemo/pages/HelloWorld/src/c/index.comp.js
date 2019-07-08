import React, { Component, h } from "@areslabs/wx-react"
import { Text, View, WXButton } from "@areslabs/wx-react-native"
import { history } from "@areslabs/wx-router"
import styles from "../a/styles"
export default class C extends Component {
    constructor(...args) {
        super(...args)
        this.__stateless__ = true
    }

    render() {
        return h(
            "view",
            {
                style: {
                    flex: 1,
                    backgroundColor: "#fff"
                },
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00010"
            },
            h(
                "view",
                {
                    style: styles.item,
                    original: "View",
                    diuu: "DIUU00002"
                },
                h(
                    "view",
                    {
                        style: styles.itemText,
                        original: "OuterText",
                        diuu: "DIUU00003"
                    },
                    "Hello"
                )
            ),
            h(
                "view",
                {
                    style: [
                        styles.item,
                        {
                            borderBottomWidth: 0
                        }
                    ],
                    original: "View",
                    diuu: "DIUU00004"
                },
                h(
                    "view",
                    {
                        style: styles.itemText,
                        original: "OuterText",
                        diuu: "DIUU00005"
                    },
                    h("template", {
                        datakey: "CTDK00004",
                        tempVnode: this.props.routerParams.text,
                        "wx:if": "{{CTDK00004}}",
                        is: "CTNP00003",
                        data: "{{...CTDK00004}}"
                    })
                )
            ),
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00006"
                },
                h(WXButton, {
                    title: "PUSH E PAGE",
                    color: "#FFF",
                    onPress: () => {
                        history.push("", "E", {
                            type: "PUSH"
                        })
                    },
                    diuu: "DIUU00007"
                })
            ),
            h(
                "view",
                {
                    style: [
                        styles.button,
                        {
                            borderTopWidth: 0
                        }
                    ],
                    original: "View",
                    diuu: "DIUU00008"
                },
                h(WXButton, {
                    color: "#fff",
                    title: "REPLACE E PAGE",
                    onPress: () => {
                        history.replace("", "E", {
                            type: "REPLACE"
                        })
                    },
                    diuu: "DIUU00009"
                })
            )
        )
    }
}
