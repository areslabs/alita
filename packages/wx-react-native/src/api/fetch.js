/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
export default function fetch(url, {
    method = "GET",
    body,
    headers,
} = {}) {

    return new Promise((resolve, reject) => {
        wx.request({
            url,
            data: body,
            header: {
                'Content-Type': 'application/json',
                ...headers
            },
            method: method.toUpperCase(),
            success: function(res) {
                const re = {
                    json: function () {
                        return Promise.resolve(res.data)
                    },
                    headers: res.header,
                    status: res.statusCode
                }
                resolve(re)
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}