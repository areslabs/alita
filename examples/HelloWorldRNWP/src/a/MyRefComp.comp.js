import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { View, Text } from "@areslabs/wx-react-native"
import styles from "./styles"
export default class MyRefComp extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            count: 0
        }

        this.increCount = () => {
            this.setState({
                count: this.state.count + 1
            })
        }
    }

    render() {
        return h(
            "block",
            {
                style: styles.item,
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00003"
            },
            h(
                "view",
                {
                    style: styles.itemText,
                    original: "OuterText",
                    diuu: "DIUU00002"
                },
                h("template", {
                    datakey: "CTDK00001",
                    tempVnode: this.state.count,
                    isTextElement: true
                })
            )
        )
    }
}
