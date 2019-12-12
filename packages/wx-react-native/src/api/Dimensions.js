/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import {getSystemInfoSync} from './util'

export default {
    get(arg) {
        if (arg === 'window') {
            const {screenHeight, screenWidth, windowHeight} = getSystemInfoSync()
            return {
                width: screenWidth,
                height: screenHeight,

                windowHeight: windowHeight,
            }
        }
    }
}
