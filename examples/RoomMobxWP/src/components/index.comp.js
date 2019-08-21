var _dec, _class

import React, { Component, h } from "@areslabs/wx-react"
import { View, StyleSheet, Text, WXButton } from "@areslabs/wx-react-native"
import { inject } from "@areslabs/wx-mobx-react"
import TotalInfo from "./TotalInfo.comp"
import Room from "./Room.comp"
let Index = ((_dec = inject("room")),
_dec(
    (_class = class Index extends Component {
        render() {
            const {
                bedRoom1,
                bedRoom2,
                kitchen,
                bookroom,
                reset
            } = this.props.room
            return h(
                "view",
                {
                    style: styles.container,
                    original: "View",
                    diuu: "DIUU00001",
                    tempName: "ITNP00010"
                },
                h(
                    "view",
                    {
                        original: "OuterText",
                        diuu: "DIUU00002"
                    },
                    "\u4E00\u4E2A\u623F\u5B50"
                ),
                h(
                    "view",
                    {
                        style: styles.room,
                        original: "View",
                        diuu: "DIUU00003"
                    },
                    h(Room, {
                        autoFocus: true,
                        style: styles.bedRoom1,
                        data: bedRoom1,
                        diuu: "DIUU00004"
                    }),
                    h(Room, {
                        style: styles.bedRoom2,
                        data: bedRoom2,
                        diuu: "DIUU00005"
                    }),
                    h(Room, {
                        style: styles.kitchen,
                        data: kitchen,
                        diuu: "DIUU00006"
                    }),
                    h(Room, {
                        style: styles.bookroom,
                        data: bookroom,
                        diuu: "DIUU00007"
                    })
                ),
                h(TotalInfo, {
                    diuu: "DIUU00008"
                }),
                h(WXButton, {
                    title: "\u91CD\u7F6E",
                    onPress: () => {
                        this.props.room.reset()
                    },
                    diuu: "DIUU00009"
                })
            )
        }
    })
) || _class)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    room: {
        borderWidth: 2,
        height: 300,
        width: 300
    },
    bedRoom1: {
        width: 120,
        height: 120,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    bedRoom2: {
        width: 120,
        height: 120,
        borderWidth: 1,
        position: "absolute",
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    kitchen: {
        width: 120,
        height: 120,
        borderWidth: 1,
        position: "absolute",
        left: 0,
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    bookroom: {
        width: 120,
        height: 120,
        borderWidth: 1,
        position: "absolute",
        right: 0,
        bottom: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        borderBottomWidth: 2,
        width: 40
    }
})
export default Index
