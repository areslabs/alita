import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { Text, View, WXButton } from "@areslabs/wx-react-native"
import { history } from "@areslabs/wx-router"
export default class C extends Component {
    getPush() {
        return h(
            "view",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00008"
            },
            h(WXButton, {
                title: "POP",
                onPress: () => {
                    history.pop(1)
                },
                diuu: "DIUU00002"
            }),
            h(WXButton, {
                title: "BACK",
                onPress: () => {
                    history.back(1)
                },
                diuu: "DIUU00003"
            }),
            h(WXButton, {
                title: "POP TO TOP",
                onPress: () => {
                    history.popToTop(1)
                },
                diuu: "DIUU00004"
            }),
            h(WXButton, {
                title: "POP TO A",
                onPress: () => {
                    history.popTo("HelloWorldRN", "A")
                },
                diuu: "DIUU00005"
            }),
            h(WXButton, {
                title: "POP TO C WithProps",
                onPress: () => {
                    history.popToWithProps("HelloWorldRN", "C", {
                        text: "newnew"
                    })
                },
                diuu: "DIUU00006"
            }),
            h(WXButton, {
                title: "switchTab to B",
                onPress: () => {
                    history.switchTab("HelloWorldRN", "B")
                },
                diuu: "DIUU00007"
            })
        )
    }

    getReplace() {
        return h(
            "view",
            {
                original: "View",
                diuu: "DIUU00009",
                tempName: "ITNP00011"
            },
            h(WXButton, {
                title: "BACK",
                onPress: () => {
                    history.back(1)
                },
                diuu: "DIUU00010"
            })
        )
    }

    render() {
        const type = this.props.routerParams.type
        return h(
            "view",
            {
                style: {
                    flex: 1
                },
                original: "View",
                diuu: "DIUU00012",
                tempName: "ITNP00014"
            },
            h(
                "view",
                {
                    original: "OuterText",
                    diuu: "DIUU00013"
                },
                "type: ",
                h("template", {
                    datakey: "CTDK00001",
                    tempVnode: type,
                    isTextElement: true
                })
            ),
            h("template", {
                datakey: "CTDK00002",
                tempVnode: type === "PUSH" && this.getPush()
            }),
            h("template", {
                datakey: "CTDK00003",
                tempVnode: type === "REPLACE" && this.getReplace()
            })
        )
    }
}
