var _dec, _class, _temp

import React, { Component, h } from "@areslabs/wx-react"
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
                (_class =
                    ((_temp = class TotalInfo extends Component {
                        constructor(...args) {
                            super(...args)
                            this.__stateless__ = true
                        }

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
                                        datakey: "CTDK00002",
                                        tempVnode: bedRoom1.label,
                                        "wx:if": "{{CTDK00002}}",
                                        is: "CTNP00001",
                                        data: "{{...CTDK00002}}"
                                    }),
                                    "\uFF1A",
                                    h("template", {
                                        datakey: "CTDK00003",
                                        tempVnode: bedRoom1.price,
                                        "wx:if": "{{CTDK00003}}",
                                        is: "CTNP00001",
                                        data: "{{...CTDK00003}}"
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
                                        datakey: "CTDK00005",
                                        tempVnode: bedRoom2.label,
                                        "wx:if": "{{CTDK00005}}",
                                        is: "CTNP00004",
                                        data: "{{...CTDK00005}}"
                                    }),
                                    "\uFF1A",
                                    h("template", {
                                        datakey: "CTDK00006",
                                        tempVnode: bedRoom2.price,
                                        "wx:if": "{{CTDK00006}}",
                                        is: "CTNP00004",
                                        data: "{{...CTDK00006}}"
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
                                        datakey: "CTDK00008",
                                        tempVnode: kitchen.label,
                                        "wx:if": "{{CTDK00008}}",
                                        is: "CTNP00007",
                                        data: "{{...CTDK00008}}"
                                    }),
                                    "\uFF1A",
                                    h("template", {
                                        datakey: "CTDK00009",
                                        tempVnode: kitchen.price,
                                        "wx:if": "{{CTDK00009}}",
                                        is: "CTNP00007",
                                        data: "{{...CTDK00009}}"
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
                                        datakey: "CTDK00011",
                                        tempVnode: bookroom.label,
                                        "wx:if": "{{CTDK00011}}",
                                        is: "CTNP00010",
                                        data: "{{...CTDK00011}}"
                                    }),
                                    "\uFF1A",
                                    h("template", {
                                        datakey: "CTDK00012",
                                        tempVnode: bookroom.price,
                                        "wx:if": "{{CTDK00012}}",
                                        is: "CTNP00010",
                                        data: "{{...CTDK00012}}"
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
                                        datakey: "CTDK00014",
                                        tempVnode: total,
                                        "wx:if": "{{CTDK00014}}",
                                        is: "CTNP00013",
                                        data: "{{...CTDK00014}}"
                                    }),
                                    "\xA5"
                                )
                            )
                        }
                    }),
                    _temp))
            ) || _class)
    ) || _class)
export { TotalInfo as default }
