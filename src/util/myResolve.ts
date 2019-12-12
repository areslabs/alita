import * as resolve from 'enhanced-resolve'

import configure from '../configure'

let innerSR = null

export const syncResolve = (...args) => {

    if (!innerSR) {
        innerSR = resolve.create.sync(configure.resolve)
    }

    return innerSR(...args)
}
