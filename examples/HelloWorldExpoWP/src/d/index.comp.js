import React, { Component, h } from "@areslabs/wx-react"
import { StyleSheet, Text, View, Dimensions } from "@areslabs/wx-react-native"
import {
    AnimatedText,
    createAnimation,
    AnimatedView
} from "@areslabs/wx-animated"
const { width } = Dimensions.get("window")
import MyAni from "./MyAni.comp"
export default class C extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            ani1: null,
            ani2: null,
            ani3: null,
            ani4: null,
            ani5: null,
            ani6: null,
            ani7: null,
            ani8: null
        }

        this.handleAni1 = () => {
            if (this.unfocus) return
            const ani = createAnimation({
                duration: 1000,
                timingFunction: "ease"
            })
            ani.opacity(0.5)
                .step()
                .opacity(1)
                .step()
            this.setState({
                ani1: ani.export(() => {
                    this.handleAni1()
                })
            })
        }

        this.handleAni2 = () => {
            if (this.unfocus) return
            const ani = createAnimation({
                duration: 1500,
                timingFunction: "linear"
            })
            ani.translateX(width - 100)
                .rotateZ(180)
                .scale(0.5, 0.5)
                .step()
                .translateX(0)
                .rotateZ(0)
                .scale(1, 1)
                .step()
            console.log("handleAni2")
            this.setState({
                ani2: ani.export(() => {
                    this.handleAni2()
                })
            })
        }

        this.count = 0

        this.handleLoading1 = () => {
            if (this.unfocus) return
            const ani = createAnimation({
                duration: 800,
                timingFunction: "linear"
            })
            ani.rotateZ(360 * this.count++).step()
            this.setState({
                ani3: ani.export(() => {
                    this.handleLoading1()
                })
            })
        }

        this.handleLoading2 = () => {
            if (this.unfocus) return
            const ani = createAnimation({
                duration: 150,
                timingFunction: "linear"
            })
            ani.scale(1.5, 1.5)
                .step({
                    delay: 0
                })
                .scale(1, 1)
                .step()
            const ani4 = ani.export()
            ani.scale(1.5, 1.5)
                .step({
                    delay: 400
                })
                .scale(1, 1)
                .step()
            const ani5 = ani.export()
            ani.scale(1.5, 1.5)
                .step({
                    delay: 800
                })
                .scale(1, 1)
                .step()
            const ani6 = ani.export(() => {
                this.handleLoading2()
            })
            this.setState({
                ani4,
                ani5,
                ani6
            })
        }

        this.handleAni7 = () => {
            if (this.unfocus) return
            const ani = createAnimation({
                duration: 800,
                timingFunction: "ease"
            })
            ani.scale(0, 0)
                .step()
                .scale(1, 1)
                .step()
            this.setState({
                ani7: ani.export(() => {
                    this.handleAni7()
                })
            })
        }

        this.handleAni8 = () => {
            if (this.unfocus) return
            const ani = createAnimation({
                duration: 800,
                timingFunction: "ease"
            })
            ani.backgroundColor("#EEDC82").step()
            this.setState({
                ani8: ani.export(() => {
                    ani.backgroundColor("#fff").step()
                    this.setState({
                        ani8: ani.export(() => {
                            this.handleAni8()
                        })
                    })
                })
            })
        }

        this.__stateless__ = false
    }

    componentDidFocus() {
        console.log("C componentDidFocus")
        this.unfocus = false
        this.handleAni1()
        this.handleAni2()
        this.handleLoading1()
        this.handleLoading2()
        this.handleAni7()
        this.handleAni8()
    }

    componentWillUnfocus() {
        this.unfocus = true
    }

    render() {
        return h(
            "view",
            {
                style: {
                    flex: 1
                },
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00020"
            },
            h(
                "view",
                {
                    style: styles.section,
                    original: "View",
                    diuu: "DIUU00002"
                },
                h(
                    "view",
                    {
                        style: styles.txt,
                        animation: this.state.ani1,
                        original: "AnimatedText",
                        diuu: "DIUU00003"
                    },
                    "\u6587\u5B57\u6E10\u9690"
                )
            ),
            h("view", {
                style: styles.bcg,
                animation: this.state.ani8,
                original: "AnimatedView",
                diuu: "DIUU00004"
            }),
            h(
                "view",
                {
                    style: styles.section,
                    original: "View",
                    diuu: "DIUU00005"
                },
                h(
                    "view",
                    {
                        style: styles.title,
                        original: "OuterText",
                        diuu: "DIUU00006"
                    },
                    "\u79FB\u52A8\u65CB\u8F6C\u7F29\u653E"
                ),
                h(
                    "view",
                    {
                        animation: this.state.ani2,
                        style: {
                            width: 80,
                            height: 80,
                            backgroundColor: "#EEDC82",
                            justifyContent: "center",
                            alignItems: "center",
                            left: 0,
                            top: 0
                        },
                        original: "AnimatedView",
                        diuu: "DIUU00007"
                    },
                    h(
                        "view",
                        {
                            original: "OuterText",
                            diuu: "DIUU00008"
                        },
                        "A"
                    )
                )
            ),
            h(
                "view",
                {
                    style: styles.section,
                    original: "View",
                    diuu: "DIUU00009"
                },
                h(
                    "view",
                    {
                        style: styles.title,
                        original: "OuterText",
                        diuu: "DIUU00010"
                    },
                    "Loading..."
                ),
                h(
                    "view",
                    {
                        style: {
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center"
                        },
                        original: "View",
                        diuu: "DIUU00011"
                    },
                    h("view", {
                        style: styles.curve,
                        animation: this.state.ani3,
                        original: "AnimatedView",
                        diuu: "DIUU00012"
                    }),
                    h(
                        "view",
                        {
                            style: styles.wxloading,
                            original: "View",
                            diuu: "DIUU00013"
                        },
                        h("view", {
                            style: styles.squBlock,
                            animation: this.state.ani4,
                            original: "AnimatedView",
                            diuu: "DIUU00014"
                        }),
                        h("view", {
                            style: styles.squBlock,
                            animation: this.state.ani5,
                            original: "AnimatedView",
                            diuu: "DIUU00015"
                        }),
                        h("view", {
                            style: styles.squBlock,
                            animation: this.state.ani6,
                            original: "AnimatedView",
                            diuu: "DIUU00016"
                        })
                    )
                )
            ),
            h(
                "view",
                {
                    style: styles.section,
                    original: "View",
                    diuu: "DIUU00017"
                },
                h(
                    "view",
                    {
                        style: styles.title,
                        original: "OuterText",
                        diuu: "DIUU00018"
                    },
                    "\u81EA\u5B9A\u4E49\u7EC4\u4EF6"
                ),
                h(MyAni, {
                    animation: this.state.ani7,
                    diuu: "DIUU00019"
                })
            )
        )
    }
}
const styles = StyleSheet.create({
    section: {
        marginBottom: 10,
        backgroundColor: "#fff",
        padding: 15
    },
    txt: {
        height: 40,
        textAlign: "center",
        lineHeight: 40
    },
    title: {
        paddingBottom: 10,
        textAlign: "center"
    },
    curve: {
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderRadius: 15,
        borderColor: "red",
        height: 30,
        width: 30
    },
    wxloading: {
        flexDirection: "row",
        width: 40,
        justifyContent: "space-around"
    },
    squBlock: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "green"
    },
    bcg: {
        height: 50,
        marginBottom: 10,
        backgroundColor: "#fff"
    }
})
