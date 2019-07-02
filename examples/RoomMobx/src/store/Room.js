/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {observable, computed, action} from 'mobx'


export default class Room {
    @observable
    bedRoom1 = {
        price: 0,
        label: '主卧'
    }

    @observable
    bedRoom2 = {
        price: 0,
        label: '次卧'
    }

    @observable
    kitchen = {
        price: 0,
        label: '厨房'
    }

    @observable
    bookroom = {
        price: 0,
        label: '书房'
    }

    @computed get total() {
        return this.bedRoom1.price + this.bedRoom2.price + this.kitchen.price + this.bookroom.price
    }

    @action
    reset() {
        this.bedRoom1.price = 0
        this.bedRoom2.price = 0
        this.kitchen.price  = 0
        this.bookroom.price = 0
    }
}