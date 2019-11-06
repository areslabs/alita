import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { View, Text } from "@areslabs/wx-react-native"
import styles from "./styles"
export default class MyForceUpdateInnerInner extends Component {
    shouldComponentUpdate() {
        console.log("MyForceUpdateInnerInner shouldComponentUpdate")
        return true
    }

    render() {
        console.log("xxx:", new Date().getTime(), this)
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
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                "forceUpdate: ",
                h("template", {
                    datakey: "CTDK00001",
                    tempVnode: new Date().getTime()
                })
            )
        )
    }
}
