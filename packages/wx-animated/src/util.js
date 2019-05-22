/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {Easing, Animated, StyleSheet} from "react-native";

function getEasing(timingFunction) {

    switch (timingFunction) {
        case 'linear': {
            return Easing.linear
        }
        case 'ease': {
            return Easing.inOut(Easing.ease)
            // 小程序的实现是 ease等于 inout //return Easing.ease
        }
        case 'ease-in': {
            return Easing.in(Easing.ease)
        }
        case 'ease-in-out': {
            return Easing.inOut(Easing.ease)
        }
        case 'ease-out': {
            return Easing.out(Easing.ease)
        }
        case 'step-end': {
            return Easing.step1
        }
        case 'step-start': {
            return Easing.step0
        }
        default: {
            return Easing.linear
        }
    }

}

function getAniStyle(aniMaps, preStyle, firstColor, lastColor) {
    const r = {
        ...preStyle,
        transform: preStyle.transform ? [...preStyle.transform] : []
    }
    for(let k in aniMaps) {
        const v = aniMaps[k]

        if (k.startsWith('rotate')
            || k.startsWith('skew')
        ) {

            r.transform = r.transform.filter(ele => !ele[k])
            r.transform.push({
                [k]: v.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg']
                })
            })
        } else if (k.startsWith('translate')
            || k.startsWith('scale')
        ) {
            r.transform = r.transform.filter(ele => !ele[k])
            r.transform.push({
                [k]: v
            })
        } else if (k === 'backgroundColor') {
            r[k] = v.interpolate({
                inputRange: [0, 1],
                outputRange: [firstColor, lastColor]
            })
        } else {
            r[k] = v
        }
    }

    return r
}

export function getAllAnisAndStyle(animation) {
    const aniMaps = {}
    let lastColor = null
    let firstColor = null
    const allAni = animation.map(item => {
        const {anis, duration, timingFunction, delay} = item
        const itemAnis = anis.map(ani => {

            const currentValue = this.flattenStyle[ani.type] === undefined ? ani.defaultValue : this.flattenStyle[ani.type]
            this.flattenStyle[ani.type] = ani.toValue

            //TODO 颜色有更好的处理方式？？
            if (ani.type === 'backgroundColor') {
                let colorAni = null
                if (aniMaps[ani.type]) {
                    colorAni = aniMaps[ani.type]
                } else {
                    colorAni = new Animated.Value(0)
                    aniMaps[ani.type] = colorAni
                }

                if (!firstColor) {
                    firstColor = currentValue
                }

                lastColor = ani.toValue

                return Animated.timing(colorAni, {
                    toValue: 1,
                    duration,
                    delay,
                    easing: getEasing(timingFunction)
                })

            }


            let rnAni = null
            if (aniMaps[ani.type]) {
                rnAni = aniMaps[ani.type]
            } else {
                rnAni = new Animated.Value(currentValue)
                aniMaps[ani.type] = rnAni
            }

            return Animated.timing(rnAni, {
                toValue: ani.toValue,
                duration,
                delay,
                easing: getEasing(timingFunction)
            })

        })
        return Animated.parallel(itemAnis)
    })

    return {
        allAni: Animated.sequence(allAni),
        aniStyle: getAniStyle(aniMaps, this.state.aniStyle, firstColor, lastColor)
    }
}

export function getFlattenStyle(style) {
    if (!style) {
        return {}
    }

    const rnFlatten = StyleSheet.flatten(style)
    if (rnFlatten.transform) {
        rnFlatten.transform.forEach(subobj => {
            if (subobj.rotate) {
                rnFlatten.rotateX = subobj.rotate
                rnFlatten.rotateY = subobj.rotate
                rnFlatten.rotateZ = subobj.rotate
            } else if (subobj.scale) {
                rnFlatten.scaleX = subobj.scale
                rnFlatten.scaleY = subobj.scale
            } else {
                Object.assign(rnFlatten, subobj)
            }
        })
    }

    return {
        ...rnFlatten
    }
}