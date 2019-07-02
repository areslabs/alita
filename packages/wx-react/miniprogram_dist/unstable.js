/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import reactUpdate from './ReactUpdate'

export function unstable_batchedUpdates(func) {
    if (reactUpdate.inRe()) {
        func()
        return
    }

    reactUpdate.setFlag(true)
    func()
    reactUpdate.setFlag(false)
    reactUpdate.finalUpdate()
}