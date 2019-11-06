var _dec, _class

import React, { Component } from "@areslabs/wx-react"
const h = React.h
import { View, Text } from "@areslabs/wx-react-native"
import { inject, observer } from "@areslabs/wx-mobx-react"
let TotalInfo =
    ((_dec = inject(allStores => {
        return Object.assign({}, allStores.room, {
            total: allStores.room.total
        })
    })),
    _dec(
        (_class =
            observer(
                (_class = class TotalInfo extends Component {
                    render() {
                        const {
                            bedRoom1,
                            bedRoom2,
                            kitchen,
                            bookroom,
                            total
                        } = this.props
                        return h(
                            "block",
                            {
                                original: "View",
                                diuu: "DIUU00001",
                                tempName: "ITNP00007"
                            },
                            h(
                                "view",
                                {
                                    original: "OuterText",
                                    diuu: "DIUU00002"
                                },
                                h("template", {
                                    datakey: "CTDK00001",
                                    tempVnode: bedRoom1.label
                                }),
                                "\uFF1A",
                                h("template", {
                                    datakey: "CTDK00002",
                                    tempVnode: bedRoom1.price
                                }),
                                "\xA5"
                            ),
                            h(
                                "view",
                                {
                                    original: "OuterText",
                                    diuu: "DIUU00003"
                                },
                                h("template", {
                                    datakey: "CTDK00003",
                                    tempVnode: bedRoom2.label
                                }),
                                "\uFF1A",
                                h("template", {
                                    datakey: "CTDK00004",
                                    tempVnode: bedRoom2.price
                                }),
                                "\xA5"
                            ),
                            h(
                                "view",
                                {
                                    original: "OuterText",
                                    diuu: "DIUU00004"
                                },
                                h("template", {
                                    datakey: "CTDK00005",
                                    tempVnode: kitchen.label
                                }),
                                "\uFF1A",
                                h("template", {
                                    datakey: "CTDK00006",
                                    tempVnode: kitchen.price
                                }),
                                "\xA5"
                            ),
                            h(
                                "view",
                                {
                                    original: "OuterText",
                                    diuu: "DIUU00005"
                                },
                                h("template", {
                                    datakey: "CTDK00007",
                                    tempVnode: bookroom.label
                                }),
                                "\uFF1A",
                                h("template", {
                                    datakey: "CTDK00008",
                                    tempVnode: bookroom.price
                                }),
                                "\xA5"
                            ),
                            h(
                                "view",
                                {
                                    original: "OuterText",
                                    diuu: "DIUU00006"
                                },
                                "\u603B\u4EF7\uFF1A",
                                h("template", {
                                    datakey: "CTDK00009",
                                    tempVnode: total
                                }),
                                "\xA5"
                            )
                        )
                    }
                })
            ) || _class)
    ) || _class)
export { TotalInfo as default }
