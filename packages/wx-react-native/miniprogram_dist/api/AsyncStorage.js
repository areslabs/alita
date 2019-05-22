/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
export default {
    getItem(key, callback) {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key: key,
                success: function (res) {
                    resolve(res.data);
                },
                fail: function (err) {
                    reject(err);
                },
                complete: function (res) {
                    callback && callback(res);
                }
            })
        });
    },
    setItem(key, data, callback) {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key: key,
                data: data,
                success: function () {
                    resolve(null);
                },
                fail: function (err) {
                    reject(err);
                },
                complete: function (res) {
                    callback && callback(res);
                }
            })
        });
    },
    removeItem(key, callback) {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key: key,
                success: function () {
                    resolve(null);
                },
                fail: function (err) {
                    reject(err);
                },
                complete: function (res) {
                    callback && callback(res);
                }
            })
        });
    },
    clear(callback) {
        return new Promise((resolve, reject) => {
            wx.clearStorage({
                success: function () {
                    resolve(null);
                },
                fail: function (err) {
                    reject(err);
                },
                complete: function (res) {
                    callback && callback(res);
                }
            })
        });
    }
}