import React, { Component, h } from "@areslabs/wx-react"
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from "@areslabs/wx-react-native"
import { createAnimation, AnimatedImage } from "@areslabs/wx-animated"
import SecBody from "./SecBody.comp"
const down = "/src/assets/arrow_down.png"
export default class Detail extends Component {
    constructor(props) {
        super(props)
        const {
            stargazers_url,
            contributors_url,
            forks_url,
            subscribers_url
        } = this.props.routerParams
        this.state = {
            secDatas: [
                {
                    key: "Stargazers",
                    aniImage: null,
                    aniBody: null,
                    open: false,
                    apiUrl: stargazers_url
                },
                {
                    key: "Subscribers",
                    aniImage: null,
                    aniBody: null,
                    open: false,
                    apiUrl: subscribers_url
                },
                {
                    key: "Contributors",
                    aniImage: null,
                    aniBody: null,
                    open: false,
                    apiUrl: contributors_url
                }
            ]
        }
    }

    render() {
        const { description, owner } = this.props.routerParams
        return h(
            "view",
            {
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00011"
            },
            h(
                "view",
                {
                    style: styles.sections,
                    original: "View",
                    diuu: "DIUU00002"
                },
                h("image", {
                    style: {
                        height: 180,
                        width: 180,
                        alignSelf: "center",
                        marginTop: 10
                    },
                    src: {
                        uri: owner.avatar_url
                    },
                    mode: "aspectFill",
                    diuu: "DIUU00003"
                }),
                h(
                    "view",
                    {
                        style: styles.des,
                        original: "OuterText",
                        diuu: "DIUU00004"
                    },
                    h("template", {
                        datakey: "CTDK00001",
                        tempVnode: description
                    })
                )
            ),
            h("template", {
                datakey: "CTDK00003",
                tempVnode: this.state.secDatas.map((sec, index) => {
                    return h(
                        "view",
                        {
                            key: sec.key,
                            original: "View",
                            diuu: "DIUU00005",
                            tempName: "ITNP00010"
                        },
                        h(
                            "view",
                            {
                                style: styles.aniSections,
                                onPress: () => {
                                    const aniImage = createAnimation({
                                        duration: 300,
                                        timingFunction: "ease"
                                    })
                                    aniImage.rotateZ(sec.open ? 0 : 180).step()
                                    const aniBody = createAnimation({
                                        duration: 300,
                                        timingFunction: "ease"
                                    })
                                    aniBody.height(sec.open ? 0 : 200).step()
                                    const newSecDatas = [...this.state.secDatas]
                                    newSecDatas[
                                        index
                                    ].aniImage = aniImage.export()
                                    newSecDatas[
                                        index
                                    ].aniBody = aniBody.export()
                                    newSecDatas[index].open = !sec.open
                                    this.setState({
                                        secDatas: newSecDatas
                                    })
                                },
                                original: "TouchableOpacity",
                                diuu: "DIUU00006"
                            },
                            h(
                                "view",
                                {
                                    original: "OuterText",
                                    diuu: "DIUU00007"
                                },
                                h("template", {
                                    datakey: "CTDK00002",
                                    tempVnode: sec.key
                                })
                            ),
                            h("image", {
                                animation: sec.aniImage,
                                style: {
                                    height: 15,
                                    width: 15
                                },
                                src: down,
                                mode: "aspectFill",
                                diuu: "DIUU00008"
                            })
                        ),
                        h(SecBody, {
                            animation: sec.aniBody,
                            apiUrl: sec.apiUrl,
                            skey: sec.key,
                            diuu: "DIUU00009"
                        })
                    )
                })
            })
        )
    }
}
const styles = StyleSheet.create({
    sections: {
        backgroundColor: "#fff",
        padding: 10,
        marginBottom: 5
    },
    des: {
        fontSize: 18,
        lineHeight: 26,
        marginBottom: 10,
        marginTop: 10,
        color: "#333"
    },
    aniSections: {
        height: 40,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})
