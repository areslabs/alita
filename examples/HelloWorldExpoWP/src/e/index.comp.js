import React, { Component, h } from "@areslabs/wx-react"
import { Text, View, WXButton } from "@areslabs/wx-react-native"
import { history } from "@areslabs/wx-router"
export default class C extends Component {
    getPush() {
        return h(
            "view",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00007"
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
                    history.popTo("", "A")
                },
                diuu: "DIUU00005"
            }),
            h(WXButton, {
                title: "POP TO C WithProps",
                onPress: () => {
                    history.popToWithProps("", "C", {
                        text: "newnew"
                    })
                },
                diuu: "DIUU00006"
            })
        )
    }

    getReplace() {
        return h(
            "view",
            {
                original: "View",
                diuu: "DIUU00008",
                tempName: "ITNP00010"
            },
            h(WXButton, {
                title: "BACK",
                onPress: () => {
                    history.back(1)
                },
                diuu: "DIUU00009"
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
                diuu: "DIUU00011",
                tempName: "ITNP00013"
            },
            h(
                "view",
                {
                    original: "OuterText",
                    diuu: "DIUU00012"
                },
                "type: ",
                h("template", {
                    datakey: "CTDK00010",
                    tempVnode: type,
                    "wx:if": "{{CTDK00010}}",
                    is: "CTNP00009",
                    data: "{{...CTDK00010}}"
                })
            ),
            h("template", {
                datakey: "CTDK00012",
                tempVnode: type === "PUSH" && this.getPush(),
                "wx:if": "{{CTDK00012}}",
                is: "CTNP00011",
                data: "{{...CTDK00012}}"
            }),
            h("template", {
                datakey: "CTDK00013",
                tempVnode: type === "REPLACE" && this.getReplace(),
                "wx:if": "{{CTDK00013}}",
                is: "CTNP00011",
                data: "{{...CTDK00013}}"
            })
        )
    }

    __stateless__ = true
}
