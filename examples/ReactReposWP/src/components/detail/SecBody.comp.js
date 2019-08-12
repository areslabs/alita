import { fetch } from "@areslabs/wx-react-native/index"
import React, { Component, h } from "@areslabs/wx-react"
import { View, Image } from "@areslabs/wx-react-native"
import { AnimationEnable } from "@areslabs/wx-animated"
import { token } from "../../util/index"

class SecBody extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        fetch(`${this.props.apiUrl}?access_token=${token}`)
            .then(res => res.json())
            .then(r => {
                this.setState({
                    users: r.slice(0, 20)
                })
            })
    }

    render() {
        return h(
            "block",
            {
                style: [
                    {
                        height: 0,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        overflow: "hidden"
                    },
                    this.props.style
                ],
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00004"
            },
            h("template", {
                datakey: "CTDK00001",
                tempVnode: this.state.users.map(ele => {
                    return h("image", {
                        key: ele.id + "",
                        src: {
                            uri: ele.avatar_url
                        },
                        style: {
                            width: 70,
                            height: 70,
                            marginLeft: 5
                        },
                        mode: "aspectFill",
                        diuu: "DIUU00002",
                        tempName: "ITNP00003"
                    })
                })
            })
        )
    }
}

export default AnimationEnable(SecBody)
