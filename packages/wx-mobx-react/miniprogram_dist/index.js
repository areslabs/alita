import { spy, configure, getDebugName } from "@areslabs/wx-mobx"
import { Component } from "@areslabs/wx-react"

export {
    observer,
    Observer,
    renderReporter,
    componentByNodeRegistry as componentByNodeRegistery,
    componentByNodeRegistry,
    trackComponents,
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

import { renderReporter, componentByNodeRegistry, trackComponents } from "./observer"
