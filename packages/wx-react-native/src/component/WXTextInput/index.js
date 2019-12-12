import {
    instanceManager,
    styleType,
    tackleWithStyleObj,
    RNBaseComponent
} from "@areslabs/wx-react"

const {VIEW} = styleType


export default class WXTextInput extends RNBaseComponent {
    getStyle(props) {
        return {
            style: tackleWithStyleObj(props.style, VIEW),
        }
    }

    focus() {
        const wxInst = instanceManager.getWxInstByUUID(this.__diuu__)
        wxInst.focus()
    }

    isFocused() {
        const wxInst = instanceManager.getWxInstByUUID(this.__diuu__)
        wxInst.isFocused()
    }
}