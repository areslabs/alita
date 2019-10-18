/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


export let firstEffect
export let lastEffect

export function unshiftEffect(effect) {
    effect.nextEffect = firstEffect
    firstEffect.preEffect = effect
    firstEffect = effect
}

export function enqueueEffect(effect) {
    lastEffect.nextEffect = effect
    effect.preEffect = lastEffect
    lastEffect = effect
}