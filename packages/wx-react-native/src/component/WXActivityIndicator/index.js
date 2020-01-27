/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {RNBaseComponent} from '@areslabs/wx-react'

export default class WXActivityIndicator extends RNBaseComponent{

    getStyle(props) {

        return {
            style: getLoadingSyle(props)
        }
    }
}


function getPartRect(color, opa, transform) {
    return `<rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: ${opa}" rx="5" ry="5" transform="${transform}"/>`
}

function getLoadingSyle(props) {
    const {animating = true, color, hidesWhenStopped, size} = props

    let fsize = null
    if (size === 'small') {
        fsize = 20
    }
    if (size === 'large') {
        fsize = 36
    }
    
    
    var svgLoading = `
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100" version="1.1">
      <path fill="none" d="M0 0h100v100H0z"/>
      ${getPartRect(color, 1, 'translate(0 -30)')}
      ${getPartRect(color, 0.93, 'rotate(30 105.98 65)')}
      ${getPartRect(color, 0.86, 'rotate(60 75.98 65)')}
      ${getPartRect(color, 0.79, 'rotate(90 65 65)')}
      ${getPartRect(color, 0.73, 'rotate(120 58.66 65)')}
      ${getPartRect(color, 0.66, 'rotate(150 54.02 65)')}
      ${getPartRect(color, 0.59, 'rotate(180 50 65)')}
      ${getPartRect(color, 0.53, 'rotate(-150 45.98 65)')}
      ${getPartRect(color, 0.46, 'rotate(-120 41.34 65)')}
      ${getPartRect(color, 0.39, 'rotate(-90 35 65)')}
      ${getPartRect(color, 0.33, 'rotate(-60 24.02 65)')}
      ${getPartRect(color, 0.26, 'rotate(-30 -5.98 65)')}
  </svg>`


    return `
    width: ${fsize}px;
    height: ${fsize}px;
    display: flex;
    ${animating ? 'animation: wxai 1s steps(12, end) infinite;': ';'}
    ${!animating && hidesWhenStopped ? 'visibility: hidden;' : ';'}
    background: transparent url('data:image/svg+xml;charset=utf8, ${encodeURIComponent(svgLoading)}') no-repeat;
    background-size: 100%;
    `
}
