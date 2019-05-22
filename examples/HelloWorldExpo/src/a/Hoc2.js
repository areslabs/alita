import React, {Component} from 'react'

export default function (WrappedComponent) {
    return class Hoc2 extends Component {

        state = {
            age: 28
        }

        componentDidMount() {
            console.log('Hoc2 componentDidMount')
        }

        componentWillUnmount() {
            console.log('Hoc2 componentWillUnmount')
        }


        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    age="28"
                />
            )
        }
    }

}