import React, { Component, h } from "@areslabs/wx-react"
import { View, Text, WXButton, StyleSheet } from "@areslabs/wx-react-native"
export default class MyStyleCompCompComp extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            bw: 2
        }
    }

    render() {
        return h(
            "block",
            {
                style: {
                    borderWidth: this.state.bw,
                    borderColor: "#89abcd"
                },
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00005"
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
                    "MyStyleCompCompComp"
                )
            ),
            h(WXButton, {
                title: "Change Boder Width",
                onPress: () => {
                    this.setState({
                        bw: this.state.bw * 2
                    })
                },
                diuu: "DIUU00004"
            })
        )
    }
}
const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 38
    },
    itemText: {
        color: "#444",
        fontSize: 14
    }
})
