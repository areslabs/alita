/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 

let systemInfo = null
export function getSystemInfoSync() {
    if (systemInfo) {
        return systemInfo
    }

    systemInfo = wx.getSystemInfoSync()
    return systemInfo
}