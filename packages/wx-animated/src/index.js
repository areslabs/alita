/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {Image, View, Text} from 'react-native'

import AnimationEnable from './AnimationEnable'
import Animation from './animation'

export {
    AnimationEnable
}

export const AnimatedView = AnimationEnable(View)
export const AnimatedImage = AnimationEnable(Image)
export const AnimatedText = AnimationEnable(Text)


export function createAnimation(opt) {
    return new Animation(opt)
}