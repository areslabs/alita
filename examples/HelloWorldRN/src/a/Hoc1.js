import React, {Component} from 'react'

export default function (WrappedComponent) {
    return class Hoc1 extends Component {

        state = {
            name: 'y5g'
        }

        componentDidMount() {
            console.log('Hoc1 componentDidMount')
        }

        componentWillUnmount() {
            console.log('Hoc1 componentWillUnmount')
        }


        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    name={this.state.name}
                    changeName={(newName) => {
                        this.setState({
                            name: newName
                        })
                    }}
                />
            )
        }
    }

}