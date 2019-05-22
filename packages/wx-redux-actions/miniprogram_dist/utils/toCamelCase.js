import clean from './toNoCase'

var space = function toSpaceCase(string) {
    return clean(string).replace(/[\W_]+(.|$)/g, function (matches, match) {
        return match ? ' ' + match : ''
    }).trim()
}


/**
 * Convert a `string` to camel case.
 *
 * @param {String} string
 * @return {String}
 */

export default function toCamelCase(string) {
    return space(string).replace(/\s(\w)/g, function (matches, letter) {
        return letter.toUpperCase()
    })
}