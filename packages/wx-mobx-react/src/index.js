import { spy, configure, getDebugName } from "mobx"
import { Component } from "@areslabs/wx-react"

import { unstable_batchedUpdates as rnBatched } from "@areslabs/wx-react-native"

if (!Component) throw new Error("mobx-react requires React to be available")
if (!spy) throw new Error("mobx-react requires mobx to be available")

configure({ reactionScheduler: rnBatched })

export {
    observer,
    renderReporter,
    componentByNodeRegistry as componentByNodeRegistery,
    componentByNodeRegistry
} from "./observer"

export { default as Provider } from "./Provider"
export { default as inject } from "./inject"
export { disposeOnUnmount } from "./disposeOnUnmount"

import * as propTypes from "./propTypes"
export { propTypes }
export { propTypes as PropTypes }

import { errorsReporter } from "./observer"
export const onError = fn => errorsReporter.on(fn)

/* DevTool support */
// See: https://github.com/andykog/mobx-devtools/blob/d8976c24b8cb727ed59f9a0bc905a009df79e221/src/backend/installGlobalHook.js

import { renderReporter, componentByNodeRegistry } from "./observer"
