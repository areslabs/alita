import React, { Component, h } from "@areslabs/wx-react"
import { StyleSheet, Text, View } from "@areslabs/wx-react-native"
export default class LoadingView extends Component {
    constructor(...args) {
        super(...args)
        this.__stateless__ = true
    }

    render() {
        return h(
            "block",
            {
                style: styles.loading,
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
                "Loading..."
            )
        )
    }
}
const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center"
    }
})
