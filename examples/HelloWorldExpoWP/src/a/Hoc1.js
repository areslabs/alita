import React, { HocComponent } from "@areslabs/wx-react"
const h = React.h
export default function(WrappedComponent) {
    var _temp

    return (
        (_temp = class Hoc1 extends HocComponent {
            constructor(...args) {
                super(...args)
                this.state = {
                    name: "y5g"
                }
            }

            componentDidMount() {
                console.log("Hoc1 componentDidMount")
            }

            componentWillUnmount() {
                console.log("Hoc1 componentWillUnmount")
            }

            render() {
                return React.createElement(
                    WrappedComponent,
                    Object.assign(
                        {},
                        this.props,
                        {
                            name: this.state.name,
                            changeName: newName => {
                                this.setState({
                                    name: newName
                                })
                            }
                        },
                        this.hocProps
                    )
                )
            }
        }),
        _temp
    )
}
