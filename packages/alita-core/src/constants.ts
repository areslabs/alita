/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export {
    originElementAttrName,
    viewOrigin,
    imageOrigin,
    innerTextOrigin,
    outerTextOrigin,
    errorViewOrigin,
    touchableWithoutFeedbackOrigin,
    touchableOpacityOrigin,
    touchableHighlightOrigin,
    errorViewOrigin,
    reactFragmentFlag,
    genericCompDiuu
} from '@shared/constants'
 

// 由 ./util/getAndStorecompInfos 根据package.json相关配置构造
export const RNCOMPSET = new Set([])

//退化为小程序view的RN组件
export const backToViewNode = new Set([
    'View',
    'TouchableWithoutFeedback',
    'TouchableOpacity',
    'TouchableHighlight',
    'Image',
    'Text',
    'AnimatedView',
    'AnimatedImage',
    'AnimatedText',
    'SafeAreaView'
])

export const wxBaseComp = new Set([
    "template",
    "block",
    "slot",
    "view",
    "image",

    // 视图容器
    'cover-image',
    'cover-view',
    'movable-area',
    'movable-view',
    'scroll-view',
    'swiper',
    'swiper-item',
    'view',

    //基础内容
    'icon',
    'progress',
    'rich-text',
    'text',

    // 表单组件
    'button',
    'checkbox',
    'checkbox-group',
    'editor',
    'form',
    'input',
    'label',
    'picker',
    'picker-view',
    'picker-view-column',
    'radio',
    'radio-group',
    'slider',
    'switch',
    'textarea',

    //媒体组件
    'audio',
    'camera',
    'image',
    'live-player',
    'live-pusher',
    'video',

    // 地图
    'map',

    // 画布
    'canvas'
])


export const genericCompName = '_g'
export const exportGenericCompName = '_e'
