import { RNBaseComponent} from "@areslabs/wx-react"

export default class WXTextInput extends RNBaseComponent {
    getStyle(props) {
        return {
            style: this.transformViewStyle(props.style)
        }
    }

    focus() {
        const wxInst = this.getWxInst()
        wxInst.focus()
    }

    isFocused() {
        const wxInst = this.getWxInst()
        wxInst.isFocused()
    }
}