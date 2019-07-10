/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import basetran from '../basetran'

export default function (ast, filepath) {
    basetran(ast, filepath, false)
}