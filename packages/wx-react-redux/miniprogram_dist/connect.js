/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import shallowEqual from "./shallowEqual"
import React, {HocComponent} from '@areslabs/wx-react'
import {bindActionCreators} from '@areslabs/wx-redux'
import PropTypes from '@areslabs/wx-prop-types'

export default function connect(mapStateToProps, mapDispatchToProps) {

    return function (WrappedComponent) {
        return class Hoc extends HocComponent {
            static contextTypes = {
                store: PropTypes.object
            }

            constructor(props, context) {
                super(props, context)

                this.store = props.store || context.store

                this.unsubscribe = this.store.subscribe(() => {
                    // 有可能组件已经被销毁
                    if (!this.unsubscribe) return

                    this.setState({})
                })

                this.memorizeProps = this.calculateProps()

            }

            calculateProps() {
                let o1 = null
                if (mapStateToProps) {
                    o1 = mapStateToProps(this.store.getState(), this.props)
                }


                let o2 = null

                if (mapDispatchToProps && typeof mapDispatchToProps === 'object') {
                    o2 = bindActionCreators(mapDispatchToProps, this.store.dispatch)
                } else if (mapDispatchToProps && typeof mapDispatchToProps === 'function') {
                    o2 = mapDispatchToProps(this.store.dispatch, this.props)
                } else {
                    o2 = {
                        dispatch: this.store.dispatch
                    }
                }

                return {
                    ...o1,
                    ...o2
                }
            }

            shouldComponentUpdate() {
                const nextProps = this.calculateProps()

                const isEqual = shallowEqual(nextProps, this.memorizeProps)
                if (isEqual) {
                    return false
                } else {
                    this.memorizeProps = nextProps
                    return true
                }
            }

            componentWillUnmount() {
                this.unsubscribe()
                this.unsubscribe = null

            }

            render() {
                return (
                    React.createElement(
                        WrappedComponent,
                        {
                            ...this.props,
                            ...this.memorizeProps,
                            ...this.hocProps
                        }
                    )
                )
            }
        }

    }
}