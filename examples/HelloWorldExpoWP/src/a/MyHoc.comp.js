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
import { View, Text, WXButton } from "@areslabs/wx-react-native"
import Hoc1 from "./Hoc1"
import Hoc2 from "./Hoc2"
import styles from "./styles"
let i = 6

class MyHoc extends Component {
    constructor(...args) {
        super(...args)

        _defineProperty(this, "__stateless__", true)
    }

    componentDidMount() {
        console.log("MyHoc componentDidMount")
    }

    render() {
        return h(
            "block",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00006"
            },
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00002"
                },
                h(WXButton, {
                    title: "Change Name",
                    color: "#333",
                    onPress: () => {
                        this.props.changeName(`y${i++}g`)
                    },
                    diuu: "DIUU00003"
                })
            ),
            h(
                "view",
                {
                    style: styles.item,
                    original: "View",
                    diuu: "DIUU00004"
                },
                h(
                    "view",
                    {
                        style: styles.itemText,
                        original: "OuterText",
                        diuu: "DIUU00005"
                    },
                    h("template", {
                        datakey: "CTDK00004",
                        tempVnode: this.props.txt,
                        "wx:if": "{{CTDK00004}}",
                        is: "CTNP00003",
                        data: "{{...CTDK00004}}"
                    }),
                    ": name=",
                    h("template", {
                        datakey: "CTDK00005",
                        tempVnode: this.props.name,
                        "wx:if": "{{CTDK00005}}",
                        is: "CTNP00003",
                        data: "{{...CTDK00005}}"
                    }),
                    ", age=",
                    h("template", {
                        datakey: "CTDK00006",
                        tempVnode: this.props.age,
                        "wx:if": "{{CTDK00006}}",
                        is: "CTNP00003",
                        data: "{{...CTDK00006}}"
                    })
                )
            )
        )
    }
}

export default Hoc1(Hoc2(MyHoc))
