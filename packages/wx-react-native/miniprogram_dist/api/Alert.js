/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
export default {
    alert(title, message = "", buttons = []) {
        message = message + ''
        const opt = {
            title,
            content: message
        }

        if (buttons.length === 0) {
            opt.showCancel = false
        }

        if (buttons.length === 1) {
            opt.showCancel = false

            opt.confirmText = buttons[0].text || '确认'

            if (buttons[0].onPress) {
                opt.success = buttons[0].onPress
            }
        }

        if (buttons.length >= 2) {
            const ok = buttons[0]
            const cancel = buttons[1]

            opt.cancelText = cancel.text || '取消'
            if (cancel.onPress) {
                opt.fail = cancel.onPress
            }

            opt.confirmText = ok.text || '确认'
            if (ok.onPress) {
                opt.success = ok.onPress
            }
        }


        wx.showModal(opt)
    }
}