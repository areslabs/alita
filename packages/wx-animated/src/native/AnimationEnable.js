/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import React from 'react'
import {Animated, StyleSheet} from "react-native";
import {getFlattenStyle, getAllAnisAndStyle} from "./util";

export default function AnimationEnable(Comp) {

    const AnimatedComp = Animated.createAnimatedComponent(Comp)
    class AnimationEnableComp extends React.Component {
        constructor(props) {
            super(props)
            this.flattenStyle = getFlattenStyle(this.props.style)

        }

        state = {
            aniStyle: {}
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.animation !== this.props.animation) {
                if (this.aning) {
                    return
                }

                const {cb, parallelAnis} = nextProps.animation
                const {aniStyle, allAni} = getAllAnisAndStyle.call(this, parallelAnis)

                this.setState({
                    aniStyle,
                }, () => {
                    this.aning = true
                    allAni.start(() => {
                        this.aning = false
                        cb && cb()
                    })
                })
            }
        }


        render() {
            const {style, ...otherProps} = this.props
            return (
                <AnimatedComp
                    {...otherProps}
                    style={[style, this.state.aniStyle]}
                />
            )
        }
    }

    return AnimationEnableComp
}