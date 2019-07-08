import React, { h } from "@areslabs/wx-react"
import {
    View,
    WXTextInput,
    WXButton,
    StyleSheet
} from "@areslabs/wx-react-native"
import { addTodo } from "../actions/index"
import { connect } from "@areslabs/wx-react-redux"

class AddTodo extends React.Component {
    constructor(...args) {
        super(...args)
        this.state = {
            v: "What needs to be done?"
        }

        this.handleFocus = () => {
            this.setState({
                v: ""
            })
        }

        this.__stateless__ = false
    }

    render() {
        return h(
            "block",
            {
                style: {
                    flexDirection: "row",
                    alignItems: "center"
                },
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00004"
            },
            h(WXTextInput, {
                autoCapitalize: "none",
                autoFocus: true,
                ref: textInput => (this.textInput = textInput),
                value: this.state.v,
                onFocus: this.handleFocus,
                style: styles.textInput,
                onChangeText: v => {
                    this.setState({
                        v
                    })
                },
                diuu: "DIUU00002"
            }),
            h(WXButton, {
                style: {
                    flex: 1,
                    paddingLeft: 10
                },
                title: "ADD",
                onPress: () => {
                    if (
                        this.state.v === "" ||
                        this.state.v === "What needs to be done?"
                    ) {
                        return
                    } else {
                        const dispatch = this.props.dispatch
                        dispatch(addTodo(this.state.v))
                        this.setState({
                            v: ""
                        })
                        this.textInput.focus()
                    }
                },
                diuu: "DIUU00003"
            })
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        flex: 3,
        fontSize: 18,
        color: "#888",
        backgroundColor: "#fff",
        paddingLeft: 8,
        height: 48,
        marginBottom: 2,
        borderColor: "#eee",
        borderWidth: 1
    }
})
export default connect()(AddTodo)
