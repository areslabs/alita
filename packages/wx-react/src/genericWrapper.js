/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * 添加genericName 标示
 * @param v
 * @returns {*}
 */
export default function genericWrapper(v) {
	if (typeof v === 'function') {
		return function (...args) {
			const r = v.apply(this, args)
			wrapObj(r)
			return r
		}
	}

	return wrapObj(v)
}

/**
 *
 *  jsx属性和children 标记isGeneric字段，表明需要generic: 逻辑
 *
 * @param v
 * @returns {*}
 */
function wrapObj(v) {
	if (typeof v !== 'object' || v === null) {
		return v
	}

	if(v.isReactElement) {
		v.isGeneric = true
	} else {
		Object.values(v).forEach(item => {
			if (item && item.isReactElement) {
				item.isGeneric = true
			}
		})
	}
	return v
}