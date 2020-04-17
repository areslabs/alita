/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


// effect type
export const UPDATE_EFFECT = 0
export const INIT_EFFECT = 1
export const STYLE_EFFECT = 2
export const STYLE_WXINIT_EFFECT = 3

// update type
export const UpdateState = 0;
//export const ReplaceState = 1;
export const ForceUpdate = 2;


// mpRoot
export const mpRoot = {
    childContext: {},
    _c: []
}

export const LayoutConstsMap = {
    LayoutEventPrefix: 'LEP',  // onLayout 事件处理标识前缀
    LayoutEventKey: 'LEP_Key', // 标识Key
    OnLayoutEvents: 'LEP_onLayoutEvents',  // 收集所有onLayout事件的集合
    OnLayoutIdMap: 'LEP_onLayoutIdMap',  // 记录onLayout的事件标识
    UpdateLayoutEvents: 'LEP_updateLayoutEvents',  // 触发onLayout事件方法
    CollectOnLayoutEvent: 'LEP_collectOnLayoutEvent',  // 收集onLayout事件方法
}

