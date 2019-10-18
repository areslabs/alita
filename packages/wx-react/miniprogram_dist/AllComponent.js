/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import instanceManager from "./InstanceManager";
import {HOCKEY} from './util'

import shallowEqual from './shallowEqual'

import {UpdateState, ForceUpdate} from './constants'
import {performUpdater} from './UpdateStrategy'


/**
 * 出于对性能的考虑，我们希望react层和小程序层数据交互次数能够近可能的少。比如如下的情形：
 *        Father
 *       /  |   \
 *      /   |    \
 *     /    |     \
 *   son1  son2   son3
 *
 * 当父组件Father setState 引起 son1，son2，son3 UI发生改变的时候， 这3个组件增量的uiDes描述数据，需要传递到对应的小程序组件上，最不理想
 * 情况是react层和小程序层交互3次，最初版本的alita（包括1.0.2版本以前）的确是这么做的。 自小程序2.4.0版本提供groupSetData之后，小程序提供了
 * 批量设置数据的功能。现在我们可以通过类似如下的代码来批量的设置小程序数据
 *    father.groupSetData(() => {
 *          son1.setData(uiDes1)
 *          son2.setData(uiDes2)
 *          son3.setData(uiDes3)
 *    })
 * 也就是说在更新的时候，我们利用groupSetData 可以做到本质上只交互一次。
 *
 * 下面我们在考虑一下Father组件初始建立的过程： Father初始的时候，在wxFather（Father组件对应的小程序组件实例，这里暂时称为wxFather）的ready
 * 声明周期里，调用了 wxFather.setData(uiDes)，完成之后，分别会触发wxSon1, wxSon2, wxSon3的 ready 并调用setData设置数据。 这里会调用4次setData，
 * 我们有办法通过groupSetData，批量设置这里的数据吗？比较麻烦，不能简单的通过上面的方式使用groupSetData，因为只有当wxFather设置数据结束之后，son才有
 * 机会ready
 * 所以，alita先阶段采用的方案是：在组件初始阶段，会先构造出所有uiDes数据，包括子组件，孙组件等等
 *     const allUiDes = {
 *           ... // fatherUiDes
 *
 *           son1R: {
 *               ... // son1UiDes
 *           },
 *
 *           son2R: {
 *               ... // son2UiDes
 *           },
 *
 *           son3R: {
 *               ... // son3UiDes
 *           }
 *     }
 * 然后 father.setData(allUiDes) 。 初始结束以后，father会去收集所有新产生的节点，统一调用一次 groupSetData把数据在刷给每一个子孙节点，
 * 这一次groupSetData 可以lazy调用吗？即和下一次setState合并，其实是可以的，这样的好处是节省了一次groupSetData。但是实际运行情况表明，这样
 * 做了以后，在FlatList里面存在这闪屏现象。 所以最终的方案还是初始结束以后，就刷数据给子孙节点，统一刷数据给小程序的时候需要注意，顺序是重要的
 * 必须从孙 --> 子 --> 父， 因为如果先刷父的数据，有可能会预先导致子/孙的变化（可见groupSetData的实现，和React世界unstable_batchedUpdates并不一样）
 *
 *
 * 记录一下：`groupSetData` 在百度小程序（groupSetData）和支付宝小程序（this.$page.$batchedUpdates）均有相关实现。
 *
 *
 * ## 方案二
 * 假设结构如下：
 *
 *                     Father
 *
 *        son1        son2         son3
 *
 *   gs11   gs12  gs21   gs22   gs31  gs32     // gs为grandson的简写
 *
 *   假定在 Father的某次setState中， gs12， gs21， son3， gs31， gs32 节点新产生了， 而Father， son1， gs11， son2， gs22，这些节点
 *   在这次setState中里面有更新，那么应该更新如下：
 *
 *   第一次：groupSetData(() => {
 *       Father.setData()
 *       son1.setDate()
 *       gs11.setData()
 *       son2.setData()
 *       gs22.setData()
 *   })
 *
 *   第二次：第一次groupSetData结束之后： gs12， gs21， son3 产生了，（注意 此刻gs31， gs32还未产生）
 *       groupSetData(() => {
 *           gs12.setData()
 *           gs21.setData()
 *           son3.setData()
 *       })
 *
 *
 *   第三次：第二次groupSetData结束之后： gs31， gs32产生了
 *       groupSetData(() => {
 *           gs31.setData()
 *           gs32.setData()
 *       })
 *
 *
 *  特别的，当Father是页面组件，且是第一次初始化的时候，每一层级的节点将依次产生，一共会发生n（组件树层级）次groupSetData
 *
 *
 */
export class BaseComponent {

    /**
     * 获取最后一层 hocWrapped节点
     */
    getDeepComp() {
        let childComp = this
        while (childComp instanceof HocComponent) {
            if (childComp._c.length === 0) {
                return null
            }

            childComp = childComp._c[0]
        }
        return childComp
    }

    /**
     * 最近的存在wx节点的顶层组件
     * @returns {*}
     */
    topExistWx() {
        let inst = this

        while (!inst._p.getWxInst()) {
            inst = inst._p
        }

        return inst.getDeepComp()
    }


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
 *
 *  当 Hoc1， Hoc2 初始化的时候： getObjSubData会收集到A的数据，通过小程序属性_r 把数据传递到wxA
 *
 *  当 Hoc1， Hoc2 调用setState的时候：
 *      1. 执行在React过程
 *      2. 调用 this.updateWX
 *      3. updateWX的过程中会跳过HOC，直接到A
 *      4. A把数据传递给wxA，更新UI
 */
export class HocComponent extends Component {
    constructor(props, context) {
        super(props, context)

        this.hocProps = {
            diuu: HOCKEY
        }

    }
}

export class RNBaseComponent {
}
