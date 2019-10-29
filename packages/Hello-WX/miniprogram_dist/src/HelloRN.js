import CompMySelf from "./HelloRN.comp"
import { WxNormalComp } from "@areslabs/wx-react"
const RNApp = {}

Component(WxNormalComp(CompMySelf, RNApp))
    