import React, { Component, h } from "@areslabs/wx-react"
import { View, Text, WXButton } from "@areslabs/wx-react-native"
import Hoc1 from "./Hoc1"
import Hoc2 from "./Hoc2"
import styles from "./styles"
let i = 6

class MyHoc extends Component {
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
                        datakey: "CTDK00001",
                        tempVnode: this.props.txt
                    }),
                    ": name=",
                    h("template", {
                        datakey: "CTDK00002",
                        tempVnode: this.props.name
                    }),
                    ", age=",
                    h("template", {
                        datakey: "CTDK00003",
                        tempVnode: this.props.age
                    })
                )
            )
        )
    }
}

export default Hoc1(Hoc2(MyHoc))
