import { bindActionCreators } from '@areslabs/wx-redux'

export default function wrapActionCreators(actionCreators) {
  return dispatch => bindActionCreators(actionCreators, dispatch)
}
