/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import Event from './Event'

export default class EventEmitter {
    constructor() {
        this.eventListenerMap = {}
    }

    emit(e) {
        if (e instanceof Event) {
            const allLis = this.eventListenerMap[e.type] || []
            allLis.forEach(lis => {
                lis(e)
            })
        } else {
            throw new Error('Expected an Event instance')
        }
    }

    on(type, listener) {
        if (this.eventListenerMap[type] === undefined) {
            this.eventListenerMap[type] = [listener]
        } else {
            this.eventListenerMap[type].push(listener)
        }

        return () => {
            const index = this.eventListenerMap[type].indexOf(listener)

            if(index === -1) {
                console.warn('listener can not cancel more time')
                return
            }

            this.eventListenerMap[type].splice(index, 1)
        }
    }
}
