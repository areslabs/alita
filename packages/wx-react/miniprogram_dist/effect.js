/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


export let firstEffect = null
export let lastEffect = null

export function unshiftEffect(effect) {
    if (!firstEffect) {
        lastEffect = firstEffect = effect
        return
    }

    effect.nextEffect = firstEffect
    firstEffect.preEffect = effect
    firstEffect = effect
}

export function enqueueEffect(effect) {
    if (!firstEffect) {
        lastEffect = firstEffect = effect
        return
    }

    lastEffect.nextEffect = effect
    effect.preEffect = lastEffect
    lastEffect = effect
}

export function resetEffect() {
    const effects = {
        lastEffect,
        firstEffect,
    }
    lastEffect = firstEffect = null
    return effects
}