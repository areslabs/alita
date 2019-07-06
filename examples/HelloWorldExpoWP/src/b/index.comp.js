import React, { Component, h } from "@areslabs/wx-react"
import {
    View,
    Text,
    Image,
    WXSwitch,
    WXSlider,
    WXFlatList,
    WXScrollView,
    WXTextInput,
    TouchableOpacity,
    Dimensions
} from "@areslabs/wx-react-native"
import styles from "../a/styles"
import base64Img from "./img"
export default class B extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            sv: true,
            users: [
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                }
            ],
            scrollList: [
                {
                    id: 1,
                    img: "/src/b/imgs/001.jpg"
                },
                {
                    id: 2,
                    img: "/src/b/imgs/002.jpg"
                },
                {
                    id: 3,
                    img: "/src/b/imgs/003.jpg"
                },
                {
                    id: 4,
                    img: "/src/b/imgs/004.jpg"
                },
                {
                    id: 5,
                    img: "/src/b/imgs/005.jpg"
                },
                {
                    id: 6,
                    img: "/src/b/imgs/006.jpg"
                }
            ],
            refreshing: false,
            value: "1"
        }

        this.renderItem = ({ item }) => {
            return h(
                "view",
                {
                    style: styles.item,
                    original: "View",
                    diuu: "DIUU00001",
                    tempName: "ITNP00003"
                },
                h(
                    "view",
                    {
                        style: styles.itemText,
                        original: "OuterText",
                        diuu: "DIUU00002"
                    },
                    h("template", {
                        datakey: "CTDK00002",
                        tempVnode: item.name,
                        "wx:if": "{{CTDK00002}}",
                        is: "CTNP00001",
                        data: "{{...CTDK00002}}"
                    })
                )
            )
        }

        this.keyExtractor = item => {
            return item.name + ""
        }

        this.__stateless__ = false
    }

    componentDidMount() {
        console.log("B componentDidMount:")
    }

    _onEndReached() {
        console.log("_onEndReached:")

        if (this.state.users.length > 30) {
            return
        }

        this.setState({
            users: this.state.users.concat([
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                },
                {
                    name: parseInt(Math.random() * 10000000)
                }
            ])
        })
    }

    render() {
        return h(
            WXScrollView,
            {
                style: {
                    flex: 1
                },
                contentContainerStyle: {
                    backgroundColor: "#fff"
                },
                diuu: "DIUU00004",
                tempName: "ITNP00039"
            },
            h(
                "view",
                {
                    style: styles.button,
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
                    "\u56FE\u7247"
                )
            ),
            h(
                "view",
                {
                    style: {
                        flexDirection: "row"
                    },
                    original: "View",
                    diuu: "DIUU00007"
                },
                h("image", {
                    src: "/src/b/local.png",
                    mode: "aspectFit",
                    style: {
                        width: 200,
                        height: 200
                    },
                    diuu: "DIUU00008"
                }),
                h("image", {
                    style: {
                        width: 150,
                        height: 200
                    },
                    src: {
                        uri: base64Img
                    },
                    mode: "aspectFill",
                    diuu: "DIUU00009"
                })
            ),
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00010"
                },
                h(
                    "view",
                    {
                        style: styles.title,
                        original: "OuterText",
                        diuu: "DIUU00011"
                    },
                    "FlatList \u5217\u8868"
                )
            ),
            h(WXFlatList, {
                style: {
                    width: "100%",
                    height: 200
                },
                refreshing: this.state.refreshing,
                onRefresh: () => {
                    this.setState({
                        refreshing: true
                    })
                    setTimeout(() => {
                        this.setState({
                            refreshing: false
                        })
                    }, 2000)
                },
                data: this.state.users,
                keyExtractor: this.keyExtractor,
                renderItem: this.renderItem,
                contentContainerStyle: {
                    minHeight: 450
                },
                ListFooterComponent: h(
                    "view",
                    {
                        style: [
                            styles.item,
                            {
                                borderBottomWidth: 0
                            }
                        ],
                        original: "View",
                        diuu: "DIUU00012",
                        tempName: "ITNP00015"
                    },
                    h("view", {
                        style: styles.itemText,
                        original: "OuterText",
                        diuu: "DIUU00013"
                    }),
                    h(
                        "view",
                        {
                            original: "OuterText",
                            diuu: "DIUU00014"
                        },
                        "ListFooterComponent"
                    )
                ),
                ListHeaderComponent: () =>
                    h(
                        "view",
                        {
                            style: styles.item,
                            original: "View",
                            diuu: "DIUU00016",
                            tempName: "ITNP00018"
                        },
                        h(
                            "view",
                            {
                                style: styles.itemText,
                                original: "OuterText",
                                diuu: "DIUU00017"
                            },
                            "ListHeaderComponent"
                        )
                    ),
                ListEmptyComponent: () =>
                    h(
                        "view",
                        {
                            style: styles.item,
                            original: "View",
                            diuu: "DIUU00019",
                            tempName: "ITNP00021"
                        },
                        h(
                            "view",
                            {
                                style: styles.itemText,
                                original: "OuterText",
                                diuu: "DIUU00020"
                            },
                            "ListEmptyComponent"
                        )
                    ),
                onEndReachedThreshold: 0.1,
                onEndReached: () => {
                    this._onEndReached()
                },
                "generic:renderItemCPT": "ICNPaaaaa",
                "generic:ListFooterComponentCPT": "ICNPaaaab",
                "generic:ListHeaderComponentCPT": "ICNPaaaac",
                "generic:ListEmptyComponentCPT": "ICNPaaaad",
                diuu: "DIUU00022"
            }),
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00023"
                },
                h(
                    "view",
                    {
                        style: styles.title,
                        original: "OuterText",
                        diuu: "DIUU00024"
                    },
                    "\u6A2A\u5411ScrollView"
                )
            ),
            h(
                WXScrollView,
                {
                    horizontal: true,
                    style: {
                        width: "100%"
                    },
                    diuu: "DIUU00025"
                },
                h("template", {
                    datakey: "CTDK00024",
                    tempVnode: this.state.scrollList.map(item => {
                        return h(
                            "view",
                            {
                                key: item.id,
                                style: {
                                    justifyContent: "center",
                                    alignItems: "center"
                                },
                                original: "View",
                                diuu: "DIUU00026",
                                tempName: "ITNP00028"
                            },
                            h("image", {
                                src: item.img,
                                style: {
                                    width: Dimensions.get("window").width / 2,
                                    height: 160
                                },
                                mode: "scaleToFill",
                                diuu: "DIUU00027"
                            })
                        )
                    }),
                    "wx:if": "{{CTDK00024}}",
                    is: "CTNP00023",
                    data: "{{...CTDK00024}}"
                })
            ),
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00029"
                },
                h(
                    "view",
                    {
                        style: styles.title,
                        original: "OuterText",
                        diuu: "DIUU00030"
                    },
                    "\u8F93\u5165\u6846"
                )
            ),
            h(WXTextInput, {
                style: {
                    borderWidth: 1,
                    height: 40,
                    borderColor: "#bbb",
                    paddingLeft: 10
                },
                value: this.state.value,
                onChangeText: value => {
                    this.setState({
                        value
                    })
                },
                diuu: "DIUU00031"
            }),
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00032"
                },
                h(
                    "view",
                    {
                        style: styles.title,
                        original: "OuterText",
                        diuu: "DIUU00033"
                    },
                    "\u5176\u5B83"
                )
            ),
            h(WXSwitch, {
                value: this.state.sv,
                style: {
                    margin: 10
                },
                onValueChange: sv => {
                    this.setState({
                        sv
                    })
                },
                diuu: "DIUU00034"
            }),
            h(WXSlider, {
                value: 0.2,
                style: {
                    width: "100%"
                },
                diuu: "DIUU00035"
            }),
            h(
                "view",
                {
                    onPress: () => {
                        console.log("click TouchableOpacity")
                    },
                    original: "TouchableOpacity",
                    diuu: "DIUU00036"
                },
                h(
                    "view",
                    {
                        style: styles.button,
                        original: "View",
                        diuu: "DIUU00037"
                    },
                    h(
                        "view",
                        {
                            style: {
                                fontSize: 18,
                                color: "#fff"
                            },
                            original: "OuterText",
                            diuu: "DIUU00038"
                        },
                        "TouchableOpacity"
                    )
                )
            )
        )
    }
}
