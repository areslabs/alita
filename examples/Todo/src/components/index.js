import React, {PureComponent} from 'react'
import {FlatList, StyleSheet, Text, View} from 'react-native'
import { toggleTodo } from '../actions'
import {connect} from 'react-redux'

import AddTodo from './AddTodo'
import Todo from './Todo'
import Footer from './Footer'


class Index extends PureComponent {

    LHC = <Text style={styles.header}>TodoList样例列表</Text>

    renderItem = ({item}) => {
        const {onTodoClick} = this.props
        return <Todo
            {...item}
            onClick={() => {
                onTodoClick(item.id)
            }}
        />
    }

    keyExtractor = (item) => {
        return item.id + ''
    }

    render() {
        const { todos }= this.props

        return (
            <View
                style={{flex: 1, padding: 20, paddingBottom: 30, backgroundColor: '#fffffa'}}
            >
                <AddTodo/>
                <FlatList
                    style={{flex: 1}}
                    keyExtractor={this.keyExtractor}
                    // ListHeaderComponent={this.LHC}
                    // ListEmptyComponent={<View style={styles.empty}><Text>无任务</Text></View>}
                    data={todos}
                    renderItem={this.renderItem}
                />

                <Footer/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        color: 'grey',
        opacity: 0.5,
        textAlign: 'center'
    },

    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    }

})



const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 'SHOW_COMPLETED':
            return todos.filter(t => t.completed)
        case 'SHOW_ACTIVE':
            return todos.filter(t => !t.completed)
        case 'SHOW_ALL':
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