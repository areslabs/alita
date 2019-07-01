function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}

import React, { Component, h } from "@areslabs/wx-react"
import { View, Image, Text } from "@areslabs/wx-react-native"
import { AnimationEnable } from "@areslabs/wx-animated"

class MyAni extends Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", true)
    }

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
                mode: "aspectFill",
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
}

export default AnimationEnable(MyAni)
