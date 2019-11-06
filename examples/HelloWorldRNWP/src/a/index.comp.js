function _extends() {
    _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i]
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key]
                    }
                }
            }
            return target
        }
    return _extends.apply(this, arguments)
}

const regeneratorRuntime = require("../../rn-polyfill/regeneratorRuntime")

import React, { Component } from "@areslabs/wx-react"
const h = React.h
import PropTypes from "@areslabs/wx-prop-types"
import {
    View,
    Text,
    WXButton,
    WXScrollView,
    Platform
} from "@areslabs/wx-react-native"
import MyContext from "./MyContext.comp"
import MyRefComp from "./MyRefComp.comp"
import MyPropComp from "./MyPropComp.comp"
import MyFunComp from "./MyFunComp.comp"
import MyChildComp from "./MyChildComp.comp"
import MyStyleComp from "./MyStyleComp.comp"
import PlatformComp from "./PlatformComp.comp"
import MyHoc from "./MyHoc.comp"
import styles from "./styles"
import Hi from "@areslabs/hi-wx"
import { Hello } from "@areslabs/hello-wx/index"
import { camelCase } from "@areslabs/stringutil-wx"
import { history } from "@areslabs/wx-router"
const item3 = h(
    "view",
    {
        style: [
            styles.item,
            {
                borderBottomWidth: 0
            }
        ],
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
        "item3"
    )
)
export default class A extends Component {
    constructor(...args) {
        super(...args)
        this.state = {
            toggleClicked1: false,
            arr: ["arr1", "arr2", "arr3"],
            user: {
                name: "kk",
                age: 18
            },
            hasZ: false
        }

        this.handleIncre = () => {
            this.mrc.increCount()
        }

        this.item2 = h(
            "view",
            {
                style: styles.item,
                original: "View",
                diuu: "DIUU00007",
                tempName: "ITNP00009"
            },
            h(
                "view",
                {
                    style: styles.itemText,
                    original: "OuterText",
                    diuu: "DIUU00008"
                },
                "item2"
            )
        )
    }

    getChildContext() {
        return {
            color: "purple"
        }
    }

    componentWillMount() {
        console.log("A componentWillMount:")
        this.f().then(x => {
            console.log("ASYNC OKOK")
        })
    }

    async f() {
        return await 1
    }

    componentDidFocus() {
        console.log("A componentDidFocus")
    }

    componentWillUnfocus() {
        console.log("A componentWillUnfocus")
    }

    componentDidMount() {
        console.log("A componentDidMount:", Platform.OS, camelCase("Yan Kang"))
    }

    componentDidUpdate() {
        console.log("A componentDidUpdate:")
    }

    getText1() {
        return null
    }

    getText2(hello) {
        return h(
            "view",
            {
                style: styles.item,
                original: "View",
                diuu: "DIUU00004",
                tempName: "ITNP00006"
            },
            h(
                "view",
                {
                    style: styles.itemText,
                    original: "OuterText",
                    diuu: "DIUU00005"
                },
                h("template", {
                    datakey: "CTDK00001",
                    tempVnode: hello
                })
            )
        )
    }

    render() {
        const { toggleClicked1, arr, user, count } = this.state
        const item1 = h(
            "view",
            {
                style: styles.item,
                original: "View",
                diuu: "DIUU00010",
                tempName: "ITNP00012"
            },
            h(
                "view",
                {
                    style: styles.itemText,
                    original: "OuterText",
                    diuu: "DIUU00011"
                },
                "item1"
            )
        )
        return h(
            WXScrollView,
            {
                style: {
                    flex: 1
                },
                contentContainerStyle: {
                    backgroundColor: "#fff"
                },
                diuu: "DIUU00013",
                tempName: "ITNP00053"
            },
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00014"
                },
                h(WXButton, {
                    color: "#fff",
                    title: "PUSH C PAGE",
                    onPress: () => {
                        history.push("HelloWorldRN", "C", {
                            text: "Alita"
                        })
                    },
                    diuu: "DIUU00015"
                })
            ),
            h(
                "view",
                {
                    style: styles.item,
                    original: "View",
                    diuu: "DIUU00016"
                },
                h(
                    "view",
                    {
                        style: {
                            fontSize: 16,
                            color: "rgb(24, 144, 255)"
                        },
                        original: "OuterText",
                        diuu: "DIUU00017"
                    },
                    "Platform: ",
                    h("template", {
                        datakey: "CTDK00002",
                        tempVnode: Platform.OS
                    })
                )
            ),
            h(PlatformComp, {
                style: styles.item,
                diuu: "DIUU00018"
            }),
            h("template", {
                datakey: "CTDK00005",
                tempVnode: item1
            }),
            h("template", {
                datakey: "CTDK00006",
                tempVnode: this.item2
            }),
            h("template", {
                datakey: "CTDK00007",
                tempVnode: item3
            }),
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00019"
                },
                h(WXButton, {
                    title: "CLICK ME",
                    color: "#fff",
                    onPress: () => {
                        this.setState({
                            toggleClicked1: !toggleClicked1
                        })
                    },
                    diuu: "DIUU00020"
                })
            ),
            h("template", {
                datakey: "CTDK00008",
                tempVnode:
                    toggleClicked1 &&
                    h(
                        "view",
                        {
                            style: styles.item,
                            original: "View",
                            diuu: "DIUU00021",
                            tempName: "ITNP00023"
                        },
                        h(
                            "view",
                            {
                                style: styles.itemText,
                                original: "OuterText",
                                diuu: "DIUU00022"
                            },
                            "clicked is true"
                        )
                    )
            }),
            h("template", {
                datakey: "CTDK00009",
                tempVnode: this.getText1()
            }),
            h("template", {
                datakey: "CTDK00010",
                tempVnode: this.getText2("function返回JSX")
            }),
            h(
                "view",
                {
                    style: styles.item,
                    original: "View",
                    diuu: "DIUU00024"
                },
                h("template", {
                    datakey: "CTDK00004",
                    tempVnode: arr.map(ele =>
                        h(
                            "view",
                            {
                                style: styles.itemText,
                                key: ele,
                                original: "OuterText",
                                diuu: "DIUU00025",
                                tempName: "ITNP00026"
                            },
                            h("template", {
                                datakey: "CTDK00003",
                                tempVnode: ele
                            }),
                            ","
                        )
                    )
                })
            ),
            h(
                MyContext,
                _extends({}, user, {
                    diuu: "DIUU00027"
                })
            ),
            h(
                "view",
                {
                    style: styles.button,
                    original: "View",
                    diuu: "DIUU00028"
                },
                h(WXButton, {
                    title: "Add One",
                    color: "#fff",
                    onPress: this.handleIncre,
                    diuu: "DIUU00029"
                })
            ),
            h(MyRefComp, {
                ref: mrc => (this.mrc = mrc),
                diuu: "DIUU00030"
            }),
            h(MyPropComp, {
                headerComponent: h(
                    "view",
                    {
                        style: styles.item,
                        original: "View",
                        diuu: "DIUU00031",
                        tempName: "ITNP00033"
                    },
                    h(
                        "view",
                        {
                            style: styles.itemText,
                            original: "OuterText",
                            diuu: "DIUU00032"
                        },
                        "header"
                    )
                ),
                footerComponent: () => {
                    return h(
                        "view",
                        {
                            style: styles.item,
                            original: "View",
                            diuu: "DIUU00034",
                            tempName: "ITNP00036"
                        },
                        h(
                            "view",
                            {
                                style: styles.itemText,
                                original: "OuterText",
                                diuu: "DIUU00035"
                            },
                            "footer"
                        )
                    )
                },
                diuu: "DIUU00037"
            }),
            h(
                MyFunComp,
                _extends({}, user, {
                    diuu: "DIUU00038"
                })
            ),
            h(
                MyChildComp,
                {
                    diuu: "DIUU00039"
                },
                h(
                    "view",
                    {
                        style: styles.item,
                        original: "View",
                        diuu: "DIUU00040",
                        tempName: "ITNP00042"
                    },
                    h(
                        "view",
                        {
                            style: styles.itemText,
                            original: "OuterText",
                            diuu: "DIUU00041"
                        },
                        "a"
                    )
                ),
                h(
                    "view",
                    {
                        style: styles.item,
                        original: "View",
                        diuu: "DIUU00043",
                        tempName: "ITNP00045"
                    },
                    h(
                        "view",
                        {
                            style: styles.itemText,
                            original: "OuterText",
                            diuu: "DIUU00044"
                        },
                        "b"
                    )
                ),
                h(
                    "view",
                    {
                        style: [
                            styles.item,
                            {
                                borderBottomWidth: 0
                            }
                        ],
                        original: "View",
                        diuu: "DIUU00046",
                        tempName: "ITNP00048"
                    },
                    h(
                        "view",
                        {
                            style: styles.itemText,
                            original: "OuterText",
                            diuu: "DIUU00047"
                        },
                        "c"
                    )
                )
            ),
            h(MyHoc, {
                txt: "HOC",
                diuu: "DIUU00049"
            }),
            h(MyStyleComp, {
                diuu: "DIUU00050"
            }),
            h(Hi, {
                name: "Yvette",
                style: styles.item,
                textStyle: styles.itemText,
                textPress: () => {
                    console.log("hihi!!! textPress")
                },
                diuu: "DIUU00051"
            }),
            h(Hello, {
                name: "y5g",
                style: [
                    styles.item,
                    {
                        borderBottomWidth: 0
                    }
                ],
                textStyle: styles.itemText,
                diuu: "DIUU00052"
            })
        )
    }
}
A.wxNavigationOptions = {
    navigationBarTitleText: "WX A"
}
A.navigationOptions = {
    title: "RN A"
}
A.childContextTypes = {
    color: PropTypes.string
}
A.defaultProps = {
    name: "yk"
}
