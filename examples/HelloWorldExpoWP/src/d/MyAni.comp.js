import React, { Component, h } from "@areslabs/wx-react"
import { View, Image, Text } from "@areslabs/wx-react-native"
import { AnimationEnable } from "@areslabs/wx-animated"

class MyAni extends Component {
    render() {
        return h(
            "block",
            {
                style: [
                    {
                        alignItems: "center"
                    },
                    this.props.style
                ],
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00004"
            },
            h("image", {
                style: {
                    width: 60,
                    height: 60
                },
                src: "/src/d/alita.jpg",
                mode: "cover",
                diuu: "DIUU00002"
            }),
            h(
                "view",
                {
                    original: "OuterText",
                    diuu: "DIUU00003"
                },
                "Alita"
            )
        )
    }

    __stateless__ = true
}

export default AnimationEnable(MyAni)
