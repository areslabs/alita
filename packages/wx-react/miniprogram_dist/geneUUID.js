/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


/**
 * 高效生成唯一uuid，需要全局不重复
 */

const charMap = {
    "0": "1",
    "1": "2",
    "2": "3",
    "3": "4",
    "4": "5",
    "5": "6",
    "6": "7",
    "7": "8",
    "8": "9",
    "9": "A",
    "A": "B",
    "B": "C",
    "C": "D",
    "D": "E",
    "E": "F",
    "F": "G",
    "G": "H",
    "H": "I",
    "I": "J",
    "J": "K",
    "K": "L",
    "L": "M",
    "M": "N",
    "N": "O",
    "O": "P",
    "P": "Q",
    "Q": "R",
    "R": "S",
    "S": "T",
    "T": "U",
    "U": "V",
    "V": "W",
    "W": "X",
    "X": "Y",
    "Y": "Z",
    "Z": "a",
    "a": "b",
    "b": "c",
    "c": "d",
    "d": "e",
    "e": "f",
    "f": "g",
    "g": "h",
    "h": "i",
    "i": "j",
    "j": "k",
    "k": "l",
    "l": "m",
    "m": "n",
    "n": "o",
    "o": "p",
    "p": "q",
    "q": "r",
    "r": "s",
    "s": "t",
    "t": "u",
    "u": "v",
    "v": "w",
    "w": "x",
    "x": "y",
    "y": "z",
    "z": "0"
}

const uuid = ["a", "0", "0", "0", "0", "0", "0", "0"]
export default function geneUUID() {
    let start = 7
    while (incr(start) && start > 0) {
        start = start - 1
    }

    return uuid.join('')
}


function incr(index) {
    const v = uuid[index]
    uuid[index] = charMap[v]
    return v === "z"
}
