var _class

import React, { Component, h } from "@areslabs/wx-react"
import { View, WXTextInput, Text } from "@areslabs/wx-react-native"
import { observer } from "@areslabs/wx-mobx-react"

let Room =
    observer(
        (_class = class Room extends Component {
            render() {
                const { style, data, autoFocus } = this.props
                console.log(data.label, " update!")
                return h(
                    "block",
                    {
                        style: style,
                        original: "View",
                        diuu: "DIUU00001",
                        tempName: "ITNP00005"
                    },
                    h(
                        "view",
                        {
                            original: "OuterText",
                            diuu: "DIUU00002"
                        },
                        h("template", {
                            datakey: "CTDK00001",
                            tempVnode: data.label
                        }),
                        "\uFF1A"
                    ),
                    h(WXTextInput, {
                        autoFocus: autoFocus,
                        value: data.price + "",
                        style: {
                            borderBottomWidth: 2,
                            width: 40
                        },
                        onChangeText: price => {
                            data.price = Number(price)
                        },
                        diuu: "DIUU00003"
                    }),
                    h(
                        "view",
                        {
                            original: "OuterText",
                            diuu: "DIUU00004"
                        },
                        " \u5143"
                    )
                )
            }
        })
    ) || _class

export default Room
