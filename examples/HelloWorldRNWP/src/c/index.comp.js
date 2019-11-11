import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { Text, View, WXButton } from "@areslabs/wx-react-native"
import { history } from "@areslabs/wx-router"
import styles from "../a/styles"
export default class C extends Component {
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
                        datakey: "CTDK00001",
                        tempVnode: this.props.routerParams.text,
                        isTextElement: true
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
                        history.push("HelloWorldRN", "E", {
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
                        history.replace("HelloWorldRN", "E", {
                            type: "REPLACE"
                        })
                    },
                    diuu: "DIUU00009"
                })
            )
        )
    }
}
