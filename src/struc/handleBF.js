/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
 
import basetran from '../basetran'

export default async function (ast, filepath) {
    await basetran(ast, filepath, false)
}