import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { TouchableOpacity, View } from "@areslabs/wx-react-native"
import MyForceUpdateInner from "./MyForceUpdateInner.comp"
export default class MyForceUpdate extends Component {
    shouldComponentUpdate() {
        console.log("MyForceUpdate shouldComponentUpdate")
        return true
    }

    componentWillUpdate() {
        console.log("MyForceUpdate componentWillUpdate")
    }

    render() {
        return h(
            "block",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00004"
            },
            h(
                "view",
                {
                    onPress: () => {
                        this.forceUpdate(() => {
                            console.log("end forceUpdate")
                        })
                    },
                    original: "TouchableOpacity",
                    diuu: "DIUU00002"
                },
                h(MyForceUpdateInner, {
                    diuu: "DIUU00003"
                })
            )
        )
    }
}
