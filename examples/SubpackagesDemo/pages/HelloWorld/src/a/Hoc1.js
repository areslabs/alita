import React, { HocComponent, h } from "@areslabs/wx-react"
export default function(WrappedComponent) {
    return class Hoc1 extends HocComponent {
        state = {
            name: "y5g"
        }

        componentDidMount() {
            console.log("Hoc1 componentDidMount")
        }

        componentWillUnmount() {
            console.log("Hoc1 componentWillUnmount")
        }

        render() {
            return React.createElement(WrappedComponent, {
                ...this.props,
                name: this.state.name,
                changeName: newName => {
                    this.setState({
                        name: newName
                    })
                },
                ...this.hocProps
            })
        }
    }
}
