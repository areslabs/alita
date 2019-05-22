import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import actions from "../actions/visibilityFilter";
import {connect} from 'react-redux'

class Footer extends React.Component {


    render() {
        const {setVisibilityFilter, visibilityFilter, testPromise, testThunk} = this.props
        return <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
                onPress={() => {
                    setVisibilityFilter('SHOW_ALL')
                }}
            >
                <View>
                    <Text style={[{borderWidth: visibilityFilter === 'SHOW_ALL' ? 1 : 0}, styles.footer]}>
                        All
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    console.log('what SHOW_ACTIVE')
                    setVisibilityFilter('SHOW_ACTIVE')
                }}
            >
                <View>
                    <Text style={[{borderWidth: visibilityFilter === 'SHOW_ACTIVE' ? 1 : 0}, styles.footer]}>
                        Active
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    setVisibilityFilter('SHOW_COMPLETED')
                    testPromise()
                    testThunk()
                }}
            >
                <View>
                    <Text style={[{borderWidth: visibilityFilter === 'SHOW_COMPLETED' ? 1 : 0}, styles.footer]}>
                        Completed
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    footer: {
        color: 'rgb(119, 119, 119)',
        fontSize: 18,
        lineHeight: 32,
        paddingHorizontal: 8,
        borderRadius: 4,
        borderColor: '#FF8077'
    }
});
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