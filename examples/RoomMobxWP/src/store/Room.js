var _class, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp

function _initializerDefineProperty(target, property, descriptor, context) {
    if (!descriptor) return
    Object.defineProperty(target, property, {
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        writable: descriptor.writable,
        value: descriptor.initializer
            ? descriptor.initializer.call(context)
            : void 0
    })
}

function _applyDecoratedDescriptor(
    target,
    property,
    decorators,
    descriptor,
    context
) {
    var desc = {}
    Object.keys(descriptor).forEach(function(key) {
        desc[key] = descriptor[key]
    })
    desc.enumerable = !!desc.enumerable
    desc.configurable = !!desc.configurable
    if ("value" in desc || desc.initializer) {
        desc.writable = true
    }
    desc = decorators
        .slice()
        .reverse()
        .reduce(function(desc, decorator) {
            return decorator(target, property, desc) || desc
        }, desc)
    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0
        desc.initializer = undefined
    }
    if (desc.initializer === void 0) {
        Object.defineProperty(target, property, desc)
        desc = null
    }
    return desc
}

function _initializerWarningHelper(descriptor, context) {
    throw new Error(
        "Decorating class property failed. Please ensure that " +
            "proposal-class-properties is enabled and set to use loose mode. " +
            "To use proposal-class-properties in spec mode with decorators, wait for " +
            "the next major version of decorators in stage 2."
    )
}

import { observable, computed } from "@areslabs/wx-mobx"
let Room = ((_class = ((_temp = class Room {
    constructor() {
        _initializerDefineProperty(this, "bedRoom1", _descriptor, this)

        _initializerDefineProperty(this, "bedRoom2", _descriptor2, this)

        _initializerDefineProperty(this, "kitchen", _descriptor3, this)

        _initializerDefineProperty(this, "bookroom", _descriptor4, this)
    }

    get total() {
        return (
            this.bedRoom1.price +
            this.bedRoom2.price +
            this.kitchen.price +
            this.bookroom.price
        )
    }

    reset() {
        this.bedRoom1.price = 0
        this.bedRoom1.price = 1
        this.bedRoom1.price = 2
        this.bedRoom1.price = 3
        this.bedRoom1.price = 4
        this.bedRoom1.price = 0
        this.bedRoom2.price = 0
        this.kitchen.price = 0
        this.bookroom.price = 0
    }
}),
_temp)),
((_descriptor = _applyDecoratedDescriptor(
    _class.prototype,
    "bedRoom1",
    [observable],
    {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function() {
            return {
                price: 0,
                label: "主卧"
            }
        }
    }
)),
(_descriptor2 = _applyDecoratedDescriptor(
    _class.prototype,
    "bedRoom2",
    [observable],
    {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function() {
            return {
                price: 0,
                label: "次卧"
            }
        }
    }
)),
(_descriptor3 = _applyDecoratedDescriptor(
    _class.prototype,
    "kitchen",
    [observable],
    {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function() {
            return {
                price: 0,
                label: "厨房"
            }
        }
    }
)),
(_descriptor4 = _applyDecoratedDescriptor(
    _class.prototype,
    "bookroom",
    [observable],
    {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function() {
            return {
                price: 0,
                label: "书房"
            }
        }
    }
)),
_applyDecoratedDescriptor(
    _class.prototype,
    "total",
    [computed],
    Object.getOwnPropertyDescriptor(_class.prototype, "total"),
    _class.prototype
)),
_class)
export { Room as default }
