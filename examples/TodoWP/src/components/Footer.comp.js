import React, { h } from "@areslabs/wx-react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "@areslabs/wx-react-native"
import actions from "../actions/visibilityFilter"
import { connect } from "@areslabs/wx-react-redux"

class Footer extends React.Component {
    render() {
        const {
            setVisibilityFilter,
            visibilityFilter,
            testPromise,
            testThunk
        } = this.props
        return h(
            "block",
            {
                style: {
                    flexDirection: "row",
                    justifyContent: "space-around"
                },
                original: "View",
                diuu: "DIUU00001",
                tempName: "ITNP00011"
            },
            h(
                "view",
                {
                    onPress: () => {
                        setVisibilityFilter("SHOW_ALL")
                    },
                    original: "TouchableOpacity",
                    diuu: "DIUU00002"
                },
                h(
                    "view",
                    {
                        original: "View",
                        diuu: "DIUU00003"
                    },
                    h(
                        "view",
                        {
                            style: [
                                {
                                    borderWidth:
                                        visibilityFilter === "SHOW_ALL" ? 1 : 0
                                },
                                styles.footer
                            ],
                            original: "OuterText",
                            diuu: "DIUU00004"
                        },
                        "All"
                    )
                )
            ),
            h(
                "view",
                {
                    onPress: () => {
                        console.log("what SHOW_ACTIVE")
                        setVisibilityFilter("SHOW_ACTIVE")
                    },
                    original: "TouchableOpacity",
                    diuu: "DIUU00005"
                },
                h(
                    "view",
                    {
                        original: "View",
                        diuu: "DIUU00006"
                    },
                    h(
                        "view",
                        {
                            style: [
                                {
                                    borderWidth:
                                        visibilityFilter === "SHOW_ACTIVE"
                                            ? 1
                                            : 0
                                },
                                styles.footer
                            ],
                            original: "OuterText",
                            diuu: "DIUU00007"
                        },
                        "Active"
                    )
                )
            ),
            h(
                "view",
                {
                    onPress: () => {
                        setVisibilityFilter("SHOW_COMPLETED")
                        testPromise()
                        testThunk()
                    },
                    original: "TouchableOpacity",
                    diuu: "DIUU00008"
                },
                h(
                    "view",
                    {
                        original: "View",
                        diuu: "DIUU00009"
                    },
                    h(
                        "view",
                        {
                            style: [
                                {
                                    borderWidth:
                                        visibilityFilter === "SHOW_COMPLETED"
                                            ? 1
                                            : 0
                                },
                                styles.footer
                            ],
                            original: "OuterText",
                            diuu: "DIUU00010"
                        },
                        "Completed"
                    )
                )
            )
        )
    }

    __stateless__ = true
}

const styles = StyleSheet.create({
    footer: {
        color: "rgb(119, 119, 119)",
        fontSize: 18,
        lineHeight: 32,
        paddingHorizontal: 8,
        borderRadius: 4,
        borderColor: "#FF8077"
    }
})

const mapStateToProps = state => {
    return {
        visibilityFilter: state.visibilityFilter
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setVisibilityFilter: type => {
            dispatch(actions.setVisibilityFilter(type))
        },
        testPromise: () => {
            dispatch(actions.testPromise())
        },
        testThunk: () => {
            dispatch(actions.testThunk())
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer)
