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

import React, { PureComponent, h } from "@areslabs/wx-react"
import { WXFlatList, StyleSheet, Text, View } from "@areslabs/wx-react-native"
import { toggleTodo } from "../actions/index"
import { connect } from "@areslabs/wx-react-redux"
import AddTodo from "./AddTodo.comp"
import Todo from "./Todo.comp"
import Footer from "./Footer.comp"

class Index extends PureComponent {
    LHC = h(
        "view",
        {
            style: styles.header,
            original: "OuterText",
            diuu: "DIUU00001",
            tempName: "ITNP00002"
        },
        "TodoList\u6837\u4F8B\u5217\u8868"
    )
    renderItem = ({ item }) => {
        const { onTodoClick } = this.props
        return h(
            Todo,
            _extends({}, item, {
                onClick: () => {
                    onTodoClick(item.id)
                },
                diuu: "DIUU00003",
                tempName: "ITNP00004"
            })
        )
    }
    keyExtractor = item => {
        return item.id + ""
    }

    render() {
        const { todos } = this.props
        return h(
            "view",
            {
                style: {
                    flex: 1,
                    padding: 20,
                    paddingBottom: 30,
                    backgroundColor: "#fffffa"
                },
                original: "View",
                diuu: "DIUU00005",
                tempName: "ITNP00009"
            },
            h(AddTodo, {
                diuu: "DIUU00006"
            }),
            h(WXFlatList, {
                style: {
                    flex: 1
                },
                keyExtractor: this.keyExtractor,
                data: todos,
                renderItem: this.renderItem,
                "generic:renderItemCPT": "ICNPaaaaa",
                diuu: "DIUU00007"
            }),
            h(Footer, {
                diuu: "DIUU00008"
            })
        )
    }

    __stateless__ = true
}

const styles = StyleSheet.create({
    header: {
        color: "grey",
        opacity: 0.5,
        textAlign: "center"
    },
    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case "SHOW_COMPLETED":
            return todos.filter(t => t.completed)

        case "SHOW_ACTIVE":
            return todos.filter(t => !t.completed)

        case "SHOW_ALL":
        default:
            return todos
    }
}

const mapStateToProps = state => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTodoClick: id => {
            dispatch(toggleTodo(id))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index)
