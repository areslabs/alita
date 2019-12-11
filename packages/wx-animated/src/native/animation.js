/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
export default class Animation {
    constructor(opt) {
        this.duration = opt.duration || 400
        this.timingFunction = opt.timingFunction || 'linear'
        this.delay = opt.delay || 0
    }

    createStepItem() {
        return {
            anis: [],
        }
    }

    parallelAnis = [this.createStepItem()]

    width(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'width',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    height(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'height',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    opacity(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'opacity',
            toValue,
            defaultValue: 1,
        })
        return this
    }

    left(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'left',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    top(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'top',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    right(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'right',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    bottom(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'bottom',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    backgroundColor(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'backgroundColor',
            toValue,
            defaultValue: 'transparent',
        })
        return this
    }

    translateX(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'translateX',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    translateY(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'translateY',
            toValue,
            defaultValue: 0,
        })
        return this
    }

    translate(xValue, yValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'translateX',
            toValue: xValue,
            defaultValue: 0,
        })

        lastStemp.push({
            type: 'translateY',
            toValue: yValue,
            defaultValue: 0,
        })
        return this
    }

    scaleX(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'scaleX',
            toValue,
            defaultValue: 1,
        })
        return this
    }

    scaleY(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'scaleY',
            toValue,
            defaultValue: 1,
        })
        return this
    }

    scale(xValue, yValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'scaleX',
            toValue: xValue,
            defaultValue: 1,
        })

        lastStemp.push({
            type: 'scaleY',
            toValue: yValue,
            defaultValue: 1,
        })

        return this
    }

    rotateX(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'rotateX',
            toValue: toValue,
            defaultValue: 0,
        })
        return this
    }

    rotateY(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'rotateY',
            toValue: toValue,
            defaultValue: 0,
        })
        return this
    }

    rotateZ(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'rotateZ',
            toValue: toValue,
            defaultValue: 0,
        })
        return this
    }

    rotate(toValue) {
        return this.rotateZ(toValue)
    }


    skewX(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'skewX',
            toValue: toValue,
            defaultValue: 0,
        })
        return this
    }

    skewY(toValue) {
        const lastStemp = this.parallelAnis[this.parallelAnis.length - 1].anis
        lastStemp.push({
            type: 'skewY',
            toValue: toValue,
            defaultValue: 0,
        })
        return this
    }

    skew(xValue, yValue) {
        this.scaleX(xValue)
        return this.scaleY(yValue)
    }


    step(opt = {}) {
        const last = this.parallelAnis[this.parallelAnis.length - 1]
        last.duration = opt.duration || this.duration
        last.timingFunction = opt.timingFunction || this.timingFunction
        last.delay = opt.delay || this.delay

        this.parallelAnis.push(this.createStepItem())
        return this
    }

    export(cb) {
        const parallelAnis = this.parallelAnis.slice(0, this.parallelAnis.length - 1)
        // 恢复
        this.parallelAnis = [this.createStepItem()]

        return {
            parallelAnis,
            cb,
        }
    }
}