import React, { PureComponent, h } from "@areslabs/wx-react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "@areslabs/wx-react-native"
export default class Todo extends PureComponent {
    render() {
        const { onClick, completed, text } = this.props
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
                    style: styles.item,
                    onPress: onClick,
                    original: "TouchableOpacity",
                    diuu: "DIUU00002"
                },
                h(
                    "view",
                    {
                        style: [
                            styles.todo,
                            {
                                color: completed ? "#FF8077" : "#777"
                            }
                        ],
                        original: "OuterText",
                        diuu: "DIUU00003"
                    },
                    h("template", {
                        datakey: "CTDK00002",
                        tempVnode: text,
                        "wx:if": "{{CTDK00002}}",
                        is: "CTNP00001",
                        data: "{{...CTDK00002}}"
                    })
                )
            )
        )
    }

    __stateless__ = true
}
const styles = StyleSheet.create({
    item: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },
    todo: {
        color: "#555",
        fontSize: 18,
        lineHeight: 44,
        paddingLeft: 10
    }
})
