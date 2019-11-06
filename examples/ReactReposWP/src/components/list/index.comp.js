import React, { Component } from "@areslabs/wx-react"
const h = React.h
import {
    StyleSheet,
    Text,
    View,
    WXFlatList,
    Image,
    Dimensions,
    TouchableOpacity
} from "@areslabs/wx-react-native"
import LoadingView from "./LoadingView.comp"
import { history } from "@areslabs/wx-router"
import { formatK, token, fetchRepos } from "../../util/index"
const { width } = Dimensions.get("window")
const reposUrl = `https://api.github.com/search/repositories?q=react&sort=stars&per_page=20&access_token=${token}`
export default class List extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            repos: [],
            refreshing: false
        }
        this.page = 1

        this.getReposUrl = (page = 1) => {
            return `${reposUrl}&page=${page}`
        }

        this.renderItem = ({ item }) => {
            return h(
                "view",
                {
                    style: styles.itemOut,
                    onPress: () => {
                        history.push("ReactRepos", "detail", item)
                    },
                    original: "TouchableOpacity",
                    diuu: "DIUU00001",
                    tempName: "ITNP00011"
                },
                h("image", {
                    style: styles.picStyle,
                    src: {
                        uri: item.owner.avatar_url
                    },
                    mode: "aspectFill",
                    diuu: "DIUU00002"
                }),
                h(
                    "view",
                    {
                        style: {
                            flex: 1
                        },
                        original: "View",
                        diuu: "DIUU00003"
                    },
                    h(
                        "view",
                        {
                            style: styles.intro,
                            original: "View",
                            diuu: "DIUU00004"
                        },
                        h(
                            "view",
                            {
                                numberOfLines: 1,
                                style: styles.name,
                                original: "OuterText",
                                diuu: "DIUU00005"
                            },
                            h("template", {
                                datakey: "CTDK00001",
                                tempVnode: item.name
                            })
                        ),
                        h(
                            "view",
                            {
                                style: styles.star,
                                original: "View",
                                diuu: "DIUU00006"
                            },
                            h("image", {
                                style: {
                                    height: 15,
                                    width: 15
                                },
                                src: "/src/assets/stars.jpg",
                                mode: "aspectFill",
                                diuu: "DIUU00007"
                            }),
                            h(
                                "view",
                                {
                                    original: "OuterText",
                                    diuu: "DIUU00008"
                                },
                                h("template", {
                                    datakey: "CTDK00002",
                                    tempVnode: formatK(item.watchers)
                                })
                            )
                        )
                    ),
                    h(
                        "view",
                        {
                            numberOfLines: 2,
                            style: styles.des,
                            original: "OuterText",
                            diuu: "DIUU00009"
                        },
                        h("template", {
                            datakey: "CTDK00003",
                            tempVnode: item.description
                        })
                    ),
                    h(
                        "view",
                        {
                            style: styles.license,
                            original: "OuterText",
                            diuu: "DIUU00010"
                        },
                        h("template", {
                            datakey: "CTDK00004",
                            tempVnode: item.license
                                ? item.license.spdx_id
                                : "ISC"
                        })
                    )
                )
            )
        }

        this.keyExtractor = (item, index) => item.id + ""

        this.onEndReached = () => {
            console.log("onEndReached:")
            this.page++
            fetchRepos(this.page, 20).then(res => {
                this.setState({
                    repos: this.state.repos.concat(res.items)
                })
            })
        }

        this.lfc = () => {
            if (this.state.repos.length === 0) {
                return null
            }

            return h(
                "view",
                {
                    style: {
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center"
                    },
                    original: "View",
                    diuu: "DIUU00012",
                    tempName: "ITNP00014"
                },
                h(
                    "view",
                    {
                        original: "OuterText",
                        diuu: "DIUU00013"
                    },
                    "\u52A0\u8F7D\u4E2D..."
                )
            )
        }

        this.onRefresh = () => {
            this.setState({
                refreshing: true
            })
            setTimeout(() => {
                this.setState({
                    refreshing: false
                })
            }, 4000)
        }
    }

    componentDidMount() {
        fetchRepos(this.page, 20).then(res => {
            this.setState({
                repos: res.items
            })
        })
    }

    render() {
        return h(
            "view",
            {
                style: {
                    flex: 1
                },
                original: "View",
                diuu: "DIUU00015",
                tempName: "ITNP00019"
            },
            h("template", {
                datakey: "CTDK00005",
                tempVnode:
                    this.state.repos.length === 0 &&
                    h(LoadingView, {
                        diuu: "DIUU00016",
                        tempName: "ITNP00017"
                    })
            }),
            h(WXFlatList, {
                refreshing: this.state.refreshing,
                onRefresh: this.onRefresh,
                style: {
                    flex: 1
                },
                data: this.state.repos,
                renderItem: this.renderItem,
                keyExtractor: this.keyExtractor,
                onEndReached: this.onEndReached,
                ListFooterComponent: this.lfc,
                diuu: "DIUU00018"
            })
        )
    }
}
List.navigationOptions = {
    title: "ReactRepos"
}
List.wxNavigationOptions = {
    navigationBarTitleText: "ReactRepos"
}
const styles = StyleSheet.create({
    fr: {
        flexDirection: "row"
    },
    itemOut: {
        backgroundColor: "#fff",
        marginBottom: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        paddingTop: 10,
        paddingBottom: 10
    },
    picStyle: {
        width: 84,
        height: 84,
        alignSelf: "center",
        marginRight: 10
    },
    intro: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
    },
    star: {
        alignItems: "center",
        flexDirection: "row"
    },
    name: {
        fontSize: 20,
        lineHeight: 30,
        color: "#4876FF",
        fontWeight: "600",
        width: 200,
        marginTop: -4
    },
    des: {
        height: 34,
        color: "#555"
    },
    license: {
        marginTop: 3,
        color: "#787878"
    }
})
