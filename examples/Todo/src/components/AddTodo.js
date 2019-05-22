import React from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'
import { addTodo } from '../actions'
import { connect } from 'react-redux'


class AddTodo extends React.Component {


    state = {
        v: 'What needs to be done?'
    }
    handleFocus = () => {
        this.setState({ v: '' });
    }
    render() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    autoCapitalize={'none'}
                    autoFocus={true}
                    ref={textInput => this.textInput = textInput}
                    value={this.state.v}
                    onFocus={this.handleFocus}
                    style={styles.textInput}
                    onChangeText={(v) => {
                        this.setState({
                            v
                        })
                    }}
                />
                <Button
                    style={{ flex: 1, paddingLeft: 10, }}
                    title="ADD"
                    onPress={() => {
                        if (this.state.v === '' || this.state.v === 'What needs to be done?') {
                            return;
                        } else {
                            const dispatch = this.props.dispatch
                            dispatch(addTodo(this.state.v))
                            this.setState({
                                v: ''
                            });
                            this.textInput.focus();
                        }
                    }}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    textInput: {
        flex: 3,
        fontSize: 18,
        color: '#888',
        backgroundColor: '#fff',
        paddingLeft: 8,
        height: 48,
        marginBottom: 2,
        borderColor: '#eee',
        borderWidth: 1
    }
});
export default connect()(AddTodo)