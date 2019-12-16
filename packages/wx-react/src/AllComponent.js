/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from "./InstanceManager";
import tackleWithStyleObj from './tackleWithStyleObj'
import { VIEW, SCROLL, OUTERTEXT}from './styleType'

import shallowEqual from './shallowEqual'

import {UpdateState, ForceUpdate} from './constants'
import {performUpdater} from './UpdateStrategy'


export class BaseComponent {

    getWxInst() {
        let diuu = null

        if (this.hocWrapped) {
            let p = this._p
            while (p.hocWrapped) {
                p = p._p
            }

            diuu = p.__diuu__
        } else {
            diuu = this.__diuu__
        }

        return instanceManager.getWxInstByUUID(diuu)
    }
}

export class CPTComponent extends BaseComponent {
}

export class FuncComponent extends BaseComponent {
    constructor(props, context) {
        super()
        this.props = props
        this.context = context
    }
}

export class Component extends BaseComponent {
    constructor(props, context) {
        super()
        this.props = props
        this.context = context

        this.updateQueue = []
    }

    forceUpdate(callback) {
        performUpdater(this, {
            tag: ForceUpdate,
            callback,
        })
    }

    setState(newState, callback) {
        performUpdater(this, {
            tag: UpdateState,

            payload: newState,
            callback: callback,
        })
    }
}

export class PureComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return !(shallowEqual(nextProps, this.props) && shallowEqual(nextState, this.state))
    }
}

/***
 * 由于alita默认处理的情况是 一个React组件 对应一个微信小程序组件。
 * Hoc的情况，会出现多个 React组件 对应一个微信小程序组件， 比如Hoc1(Hoc2(A)) 。HOC现阶段的处理如下：
 *
 *     Hoc1 -> Hoc2 -> A
 *      ↓             /
 *      ↓            /
 *      ↓           /
 *   实例对应       /
 *      ↓         /
 *      ↓        /
 *      ↓   wxA 渲染的数据
 *      ↓      /
 *      ↓     /
 *      ↓    /
 *      ↓   /
 *      ↓  /
 *      wxA
 *
 *  Hoc1的uuid 和wxA属性接收到的uuid 是一致的，所以在实例管理器中 Hoc1 和wxA是一对，但是Hoc1包裹Hoc2包裹A在运行结束时产生的uiDes 数据
 *  才是最终决定 wxA渲染的。
 */
export class HocComponent extends Component {
    constructor(props, context) {
        super(props, context)
    }
}

export class RNBaseComponent {

    getWxInst() {
        return instanceManager.getWxInstByUUID(this.__diuu__)
    }

    transformViewStyle(style){
        return tackleWithStyleObj(style, VIEW)
    }

    transformScrollViewStyle(style) {
        return tackleWithStyleObj(style, SCROLL)
    }

    transformTextStyle(style) {
        return tackleWithStyleObj(style, OUTERTEXT)
    }

    transformStyle(style) {
        return tackleWithStyleObj(style)
    }
}
