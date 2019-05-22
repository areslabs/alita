/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import Event from './Event'
import EventEmitter from './EventEmitter'

const eventEmitter = new EventEmitter()

export {
    Event,
    eventEmitter
}
