/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
export function createAnimation(opt) {
    const rawAni = wx.createAnimation(opt)


    let duration = 0
    const rawExport = rawAni.export
    rawAni.export = function (cb) {
        if (cb) {
            setTimeout(() => {
                cb()
            }, duration)
        }
        duration = 0
        const anis = rawExport.call(rawAni)
        anis.__isAnimation__ = true
        return anis
    }
    const rawStep = rawAni.step
    rawAni.step = function (stepOpt) {
        if (stepOpt && stepOpt.duration !== undefined) {
            duration += stepOpt.duration
        } else if (opt && opt.duration !== undefined) {
            duration += opt.duration
        } else {
            duration += 400
        }

        if (stepOpt && stepOpt.delay !== undefined) {
            duration += stepOpt.delay
        } else if (opt && opt.delay !== undefined) {
            duration += opt.delay
        }

        return rawStep.call(rawAni, stepOpt)
    }

    return rawAni
}

export function AnimationEnable(Comp) {
    return Comp
}