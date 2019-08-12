/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { h } from "@areslabs/wx-react"
import { View, Text } from "@areslabs/wx-react-native"
export default class Hello extends React.Component {
    render() {
        return h(
            "block",
            {
                style: this.props.style,
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00003"
            },
            h(
                "view",
                {
                    style: this.props.textStyle,
                    onPress: () => {
                        console.log("Hi ", this.props.name, " !")
                        this.props.textPress && this.props.textPress()
                    },
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                "Hi ",
                h("template", {
                    datakey: "CTDK00002",
                    tempVnode: this.props.name,
                    "wx:if": "{{CTDK00002}}",
                    is: "CTNP00001",
                    data: "{{...CTDK00002}}"
                }),
                "!"
            )
        )
    }
}
