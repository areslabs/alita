var _class, _temp

import React, { Component, h } from "@areslabs/wx-react"
import { View, WXTextInput, Text } from "@areslabs/wx-react-native"
import { observer } from "@areslabs/wx-mobx-react"

let Room =
    observer(
        (_class =
            ((_temp = class Room extends Component {
                constructor(...args) {
                    super(...args)
                    this.__stateless__ = true
                }

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
                                datakey: "CTDK00002",
                                tempVnode: data.label,
                                "wx:if": "{{CTDK00002}}",
                                is: "CTNP00001",
                                data: "{{...CTDK00002}}"
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
            }),
            _temp))
    ) || _class

export default Room
