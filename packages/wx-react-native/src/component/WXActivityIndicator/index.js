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
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 1" rx="5" ry="5" transform="translate(0 -30)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.93" rx="5" ry="5" transform="rotate(30 105.98 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.86" rx="5" ry="5" transform="rotate(60 75.98 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.79" rx="5" ry="5" transform="rotate(90 65 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.73" rx="5" ry="5" transform="rotate(120 58.66 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.66" rx="5" ry="5" transform="rotate(150 54.02 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.59" rx="5" ry="5" transform="rotate(180 50 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.53" rx="5" ry="5" transform="rotate(-150 45.98 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.46" rx="5" ry="5" transform="rotate(-120 41.34 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.39" rx="5" ry="5" transform="rotate(-90 35 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.33" rx="5" ry="5" transform="rotate(-60 24.02 65)"/>
      <rect width="7" height="20" x="46.5" y="40" fill="${color}" style="opacity: 0.26" rx="5" ry="5" transform="rotate(-30 -5.98 65)"/>
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
