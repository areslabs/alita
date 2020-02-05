/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
export const InnerComponentNamePrefix = "ICNP" // inner component name prefix

export const InnerTemplateNamePrefix = "ITNP" // inner template name prefix

export const ChildTemplateDataKeyPrefix = "CTDK" // inner spread attribute prefix

export const ChildTemplateNamePrefix = "CTNP"

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