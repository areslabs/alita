import React, { Component, h } from "@areslabs/wx-react"
import { StyleSheet } from "@areslabs/wx-react-native"
export default class MyModalComp extends Component {
    state = {
        count: 0
    }
    increCount = () => {
        this.setState({
            count: this.state.count + 1
        })
    }

    render() {
        return h(JDNetworkd, {
            style: true,
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        })
    }

    __stateless__ = false
}
const styles = StyleSheet.create({
    wrapper: {
        justifyContent: "center",
        alignItems: "center"
    }
})
