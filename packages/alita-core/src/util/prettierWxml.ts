/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function collapseWhitespaceAll(str) {
    // Non-breaking space is specifically handled inside the replacer function here:
    return str && str.replace(/[ \n\r\t\f\xA0]+/g, function(spaces) {
        return spaces === '\t' ? '\t' : spaces.replace(/(^|\xA0+)[^\xA0]+/g, '$1 ');
    });
}

export default function prettierWxml(wxmlCode) {
    if (process.env.NODE_ENV === "production") {
        return collapseWhitespaceAll(wxmlCode)
    } else {
        return wxmlCode
    }
}
