function _extends() {
    _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i]
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key]
                    }
                }
            }
            return target
        }
    return _extends.apply(this, arguments)
}

function _decorate(decorators, factory, superClass, mixins) {
    var api = _getDecoratorsApi()
    if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
            api = mixins[i](api)
        }
    }
    var r = factory(function initialize(O) {
        api.initializeInstanceElements(O, decorated.elements)
    }, superClass)
    var decorated = api.decorateClass(
        _coalesceClassElements(r.d.map(_createElementDescriptor)),
        decorators
    )
    api.initializeClassElements(r.F, decorated.elements)
    return api.runClassFinishers(r.F, decorated.finishers)
}

function _getDecoratorsApi() {
    _getDecoratorsApi = function() {
        return api
    }
    var api = {
        elementsDefinitionOrder: [["method"], ["field"]],
        initializeInstanceElements: function(O, elements) {
            ;["method", "field"].forEach(function(kind) {
                elements.forEach(function(element) {
                    if (element.kind === kind && element.placement === "own") {
                        this.defineClassElement(O, element)
                    }
                }, this)
            }, this)
        },
        initializeClassElements: function(F, elements) {
            var proto = F.prototype
            ;["method", "field"].forEach(function(kind) {
                elements.forEach(function(element) {
                    var placement = element.placement
                    if (
                        element.kind === kind &&
                        (placement === "static" || placement === "prototype")
                    ) {
                        var receiver = placement === "static" ? F : proto
                        this.defineClassElement(receiver, element)
                    }
                }, this)
            }, this)
        },
        defineClassElement: function(receiver, element) {
            var descriptor = element.descriptor
            if (element.kind === "field") {
                var initializer = element.initializer
                descriptor = {
                    enumerable: descriptor.enumerable,
                    writable: descriptor.writable,
                    configurable: descriptor.configurable,
                    value:
                        initializer === void 0
                            ? void 0
                            : initializer.call(receiver)
                }
            }
            Object.defineProperty(receiver, element.key, descriptor)
        },
        decorateClass: function(elements, decorators) {
            var newElements = []
            var finishers = []
            var placements = { static: [], prototype: [], own: [] }
            elements.forEach(function(element) {
                this.addElementPlacement(element, placements)
            }, this)
            elements.forEach(function(element) {
                if (!_hasDecorators(element)) return newElements.push(element)
                var elementFinishersExtras = this.decorateElement(
                    element,
                    placements
                )
                newElements.push(elementFinishersExtras.element)
                newElements.push.apply(
                    newElements,
                    elementFinishersExtras.extras
                )
                finishers.push.apply(
                    finishers,
                    elementFinishersExtras.finishers
                )
            }, this)
            if (!decorators) {
                return { elements: newElements, finishers: finishers }
            }
            var result = this.decorateConstructor(newElements, decorators)
            finishers.push.apply(finishers, result.finishers)
            result.finishers = finishers
            return result
        },
        addElementPlacement: function(element, placements, silent) {
            var keys = placements[element.placement]
            if (!silent && keys.indexOf(element.key) !== -1) {
                throw new TypeError("Duplicated element (" + element.key + ")")
            }
            keys.push(element.key)
        },
        decorateElement: function(element, placements) {
            var extras = []
            var finishers = []
            for (
                var decorators = element.decorators, i = decorators.length - 1;
                i >= 0;
                i--
            ) {
                var keys = placements[element.placement]
                keys.splice(keys.indexOf(element.key), 1)
                var elementObject = this.fromElementDescriptor(element)
                var elementFinisherExtras = this.toElementFinisherExtras(
                    (0, decorators[i])(elementObject) || elementObject
                )
                element = elementFinisherExtras.element
                this.addElementPlacement(element, placements)
                if (elementFinisherExtras.finisher) {
                    finishers.push(elementFinisherExtras.finisher)
                }
                var newExtras = elementFinisherExtras.extras
                if (newExtras) {
                    for (var j = 0; j < newExtras.length; j++) {
                        this.addElementPlacement(newExtras[j], placements)
                    }
                    extras.push.apply(extras, newExtras)
                }
            }
            return { element: element, finishers: finishers, extras: extras }
        },
        decorateConstructor: function(elements, decorators) {
            var finishers = []
            for (var i = decorators.length - 1; i >= 0; i--) {
                var obj = this.fromClassDescriptor(elements)
                var elementsAndFinisher = this.toClassDescriptor(
                    (0, decorators[i])(obj) || obj
                )
                if (elementsAndFinisher.finisher !== undefined) {
                    finishers.push(elementsAndFinisher.finisher)
                }
                if (elementsAndFinisher.elements !== undefined) {
                    elements = elementsAndFinisher.elements
                    for (var j = 0; j < elements.length - 1; j++) {
                        for (var k = j + 1; k < elements.length; k++) {
                            if (
                                elements[j].key === elements[k].key &&
                                elements[j].placement === elements[k].placement
                            ) {
                                throw new TypeError(
                                    "Duplicated element (" +
                                        elements[j].key +
                                        ")"
                                )
                            }
                        }
                    }
                }
            }
            return { elements: elements, finishers: finishers }
        },
        fromElementDescriptor: function(element) {
            var obj = {
                kind: element.kind,
                key: element.key,
                placement: element.placement,
                descriptor: element.descriptor
            }
            var desc = { value: "Descriptor", configurable: true }
            Object.defineProperty(obj, Symbol.toStringTag, desc)
            if (element.kind === "field") obj.initializer = element.initializer
            return obj
        },
        toElementDescriptors: function(elementObjects) {
            if (elementObjects === undefined) return
            return _toArray(elementObjects).map(function(elementObject) {
                var element = this.toElementDescriptor(elementObject)
                this.disallowProperty(
                    elementObject,
                    "finisher",
                    "An element descriptor"
                )
                this.disallowProperty(
                    elementObject,
                    "extras",
                    "An element descriptor"
                )
                return element
            }, this)
        },
        toElementDescriptor: function(elementObject) {
            var kind = String(elementObject.kind)
            if (kind !== "method" && kind !== "field") {
                throw new TypeError(
                    'An element descriptor\'s .kind property must be either "method" or' +
                        ' "field", but a decorator created an element descriptor with' +
                        ' .kind "' +
                        kind +
                        '"'
                )
            }
            var key = _toPropertyKey(elementObject.key)
            var placement = String(elementObject.placement)
            if (
                placement !== "static" &&
                placement !== "prototype" &&
                placement !== "own"
            ) {
                throw new TypeError(
                    'An element descriptor\'s .placement property must be one of "static",' +
                        ' "prototype" or "own", but a decorator created an element descriptor' +
                        ' with .placement "' +
                        placement +
                        '"'
                )
            }
            var descriptor = elementObject.descriptor
            this.disallowProperty(
                elementObject,
                "elements",
                "An element descriptor"
            )
            var element = {
                kind: kind,
                key: key,
                placement: placement,
                descriptor: Object.assign({}, descriptor)
            }
            if (kind !== "field") {
                this.disallowProperty(
                    elementObject,
                    "initializer",
                    "A method descriptor"
                )
            } else {
                this.disallowProperty(
                    descriptor,
                    "get",
                    "The property descriptor of a field descriptor"
                )
                this.disallowProperty(
                    descriptor,
                    "set",
                    "The property descriptor of a field descriptor"
                )
                this.disallowProperty(
                    descriptor,
                    "value",
                    "The property descriptor of a field descriptor"
                )
                element.initializer = elementObject.initializer
            }
            return element
        },
        toElementFinisherExtras: function(elementObject) {
            var element = this.toElementDescriptor(elementObject)
            var finisher = _optionalCallableProperty(elementObject, "finisher")
            var extras = this.toElementDescriptors(elementObject.extras)
            return { element: element, finisher: finisher, extras: extras }
        },
        fromClassDescriptor: function(elements) {
            var obj = {
                kind: "class",
                elements: elements.map(this.fromElementDescriptor, this)
            }
            var desc = { value: "Descriptor", configurable: true }
            Object.defineProperty(obj, Symbol.toStringTag, desc)
            return obj
        },
        toClassDescriptor: function(obj) {
            var kind = String(obj.kind)
            if (kind !== "class") {
                throw new TypeError(
                    'A class descriptor\'s .kind property must be "class", but a decorator' +
                        ' created a class descriptor with .kind "' +
                        kind +
                        '"'
                )
            }
            this.disallowProperty(obj, "key", "A class descriptor")
            this.disallowProperty(obj, "placement", "A class descriptor")
            this.disallowProperty(obj, "descriptor", "A class descriptor")
            this.disallowProperty(obj, "initializer", "A class descriptor")
            this.disallowProperty(obj, "extras", "A class descriptor")
            var finisher = _optionalCallableProperty(obj, "finisher")
            var elements = this.toElementDescriptors(obj.elements)
            return { elements: elements, finisher: finisher }
        },
        runClassFinishers: function(constructor, finishers) {
            for (var i = 0; i < finishers.length; i++) {
                var newConstructor = (0, finishers[i])(constructor)
                if (newConstructor !== undefined) {
                    if (typeof newConstructor !== "function") {
                        throw new TypeError(
                            "Finishers must return a constructor."
                        )
                    }
                    constructor = newConstructor
                }
            }
            return constructor
        },
        disallowProperty: function(obj, name, objectType) {
            if (obj[name] !== undefined) {
                throw new TypeError(
                    objectType + " can't have a ." + name + " property."
                )
            }
        }
    }
    return api
}

function _createElementDescriptor(def) {
    var key = _toPropertyKey(def.key)
    var descriptor
    if (def.kind === "method") {
        descriptor = {
            value: def.value,
            writable: true,
            configurable: true,
            enumerable: false
        }
    } else if (def.kind === "get") {
        descriptor = { get: def.value, configurable: true, enumerable: false }
    } else if (def.kind === "set") {
        descriptor = { set: def.value, configurable: true, enumerable: false }
    } else if (def.kind === "field") {
        descriptor = { configurable: true, writable: true, enumerable: true }
    }
    var element = {
        kind: def.kind === "field" ? "field" : "method",
        key: key,
        placement: def.static
            ? "static"
            : def.kind === "field"
            ? "own"
            : "prototype",
        descriptor: descriptor
    }
    if (def.decorators) element.decorators = def.decorators
    if (def.kind === "field") element.initializer = def.value
    return element
}

function _coalesceGetterSetter(element, other) {
    if (element.descriptor.get !== undefined) {
        other.descriptor.get = element.descriptor.get
    } else {
        other.descriptor.set = element.descriptor.set
    }
}

function _coalesceClassElements(elements) {
    var newElements = []
    var isSameElement = function(other) {
        return (
            other.kind === "method" &&
            other.key === element.key &&
            other.placement === element.placement
        )
    }
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i]
        var other
        if (
            element.kind === "method" &&
            (other = newElements.find(isSameElement))
        ) {
            if (
                _isDataDescriptor(element.descriptor) ||
                _isDataDescriptor(other.descriptor)
            ) {
                if (_hasDecorators(element) || _hasDecorators(other)) {
                    throw new ReferenceError(
                        "Duplicated methods (" +
                            element.key +
                            ") can't be decorated."
                    )
                }
                other.descriptor = element.descriptor
            } else {
                if (_hasDecorators(element)) {
                    if (_hasDecorators(other)) {
                        throw new ReferenceError(
                            "Decorators can't be placed on different accessors with for " +
                                "the same property (" +
                                element.key +
                                ")."
                        )
                    }
                    other.decorators = element.decorators
                }
                _coalesceGetterSetter(element, other)
            }
        } else {
            newElements.push(element)
        }
    }
    return newElements
}

function _hasDecorators(element) {
    return element.decorators && element.decorators.length
}

function _isDataDescriptor(desc) {
    return (
        desc !== undefined &&
        !(desc.value === undefined && desc.writable === undefined)
    )
}

function _optionalCallableProperty(obj, name) {
    var value = obj[name]
    if (value !== undefined && typeof value !== "function") {
        throw new TypeError("Expected '" + name + "' to be a function")
    }
    return value
}

function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string")
    return typeof key === "symbol" ? key : String(key)
}

function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input
    var prim = input[Symbol.toPrimitive]
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default")
        if (typeof res !== "object") return res
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (hint === "string" ? String : Number)(input)
}

function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest()
}

function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance")
}

function _iterableToArray(iter) {
    if (
        Symbol.iterator in Object(iter) ||
        Object.prototype.toString.call(iter) === "[object Arguments]"
    )
        return Array.from(iter)
}

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr
}

import regeneratorRuntime from "@areslabs/wx-react/regeneratorRuntime"
import React, { Component, h } from "@areslabs/wx-react"
import PropTypes from "@areslabs/wx-prop-types"
import {
    View,
    Text,
    WXButton,
    WXScrollView,
    Platform
} from "@areslabs/wx-react-native"
import MyContext from "./MyContext.comp"
import MyRefComp from "./MyRefComp.comp"
import MyPropComp from "./MyPropComp.comp"
import MyFunComp from "./MyFunComp.comp"
import MyChildComp from "./MyChildComp.comp"
import MyStyleComp from "./MyStyleComp.comp"
import PlatformComp from "./PlatformComp.comp"
import MyHoc from "./MyHoc.comp"
import styles from "./styles"
import MyForceUpdate from "./MyForceUpdate.comp"
import Hi from "@areslabs/hi-wx"
import Hello from "@areslabs/hello-wx/index.comp"
import { history } from "@areslabs/wx-router"
import decoratorTest from "./decoratorTest"
const item3 = h(
    "view",
    {
        style: [
            styles.item,
            {
                borderBottomWidth: 0
            }
        ],
        original: "View",
        diuu: "DIUU00001",
        tempName: "ITNP00003"
    },
    h(
        "view",
        {
            numberOfLines: "2",
            style: styles.itemText,
            original: "OuterText",
            diuu: "DIUU00002"
        },
        "item3"
    )
)

let A = _decorate(
    null,
    function(_initialize, _Component) {
        class A extends _Component {
            constructor(...args) {
                super(...args)

                _initialize(this)
            }
        }

        return {
            F: A,
            d: [
                {
                    kind: "field",
                    static: true,
                    key: "wxNavigationOptions",

                    value() {
                        return {
                            navigationBarTitleText: "WX A"
                        }
                    }
                },
                {
                    kind: "field",
                    static: true,
                    key: "navigationOptions",

                    value() {
                        return {
                            title: "RN A"
                        }
                    }
                },
                {
                    kind: "field",
                    static: true,
                    key: "childContextTypes",

                    value() {
                        return {
                            color: PropTypes.string
                        }
                    }
                },
                {
                    kind: "field",
                    static: true,
                    key: "defaultProps",

                    value() {
                        return {
                            name: "yk"
                        }
                    }
                },
                {
                    kind: "method",
                    key: "getChildContext",
                    value: function getChildContext() {
                        return {
                            color: "purple"
                        }
                    }
                },
                {
                    kind: "method",
                    key: "componentWillMount",
                    value: function componentWillMount() {
                        console.log("A componentWillMount:")
                        this.f().then(x => {
                            console.log("ASYNC OKOK")
                        })
                    }
                },
                {
                    kind: "method",
                    decorators: [decoratorTest],
                    key: "decoratorFunc",
                    value: function decoratorFunc() {
                        console.log("decoratorFunc")
                    }
                },
                {
                    kind: "method",
                    key: "f",
                    value: async function f() {
                        return await 1
                    }
                },
                {
                    kind: "method",
                    key: "componentDidFocus",
                    value: function componentDidFocus() {
                        console.log("A componentDidFocus")
                    }
                },
                {
                    kind: "method",
                    key: "componentWillUnfocus",
                    value: function componentWillUnfocus() {
                        console.log("A componentWillUnfocus")
                    }
                },
                {
                    kind: "method",
                    key: "componentDidMount",
                    value: function componentDidMount() {
                        console.log("A componentDidMount:", Platform.OS)
                        this.decoratorFunc()
                    }
                },
                {
                    kind: "method",
                    key: "componentDidUpdate",
                    value: function componentDidUpdate() {
                        console.log("A componentDidUpdate:")
                    }
                },
                {
                    kind: "field",
                    key: "state",

                    value() {
                        return {
                            toggleClicked1: false,
                            arr: ["arr1", "arr2", "arr3"],
                            user: {
                                name: "kk",
                                age: 18
                            },
                            hasZ: false
                        }
                    }
                },
                {
                    kind: "method",
                    key: "getText1",
                    value: function getText1() {
                        return null
                    }
                },
                {
                    kind: "method",
                    key: "getText2",
                    value: function getText2(hello) {
                        return h(
                            "view",
                            {
                                style: styles.item,
                                original: "View",
                                diuu: "DIUU00004",
                                tempName: "ITNP00006"
                            },
                            h(
                                "view",
                                {
                                    style: styles.itemText,
                                    original: "OuterText",
                                    diuu: "DIUU00005"
                                },
                                h("template", {
                                    datakey: "CTDK00004",
                                    tempVnode: hello,
                                    "wx:if": "{{CTDK00004}}",
                                    is: "CTNP00003",
                                    data: "{{...CTDK00004}}"
                                })
                            )
                        )
                    }
                },
                {
                    kind: "field",
                    key: "handleIncre",

                    value() {
                        return () => {
                            this.mrc.increCount()
                        }
                    }
                },
                {
                    kind: "field",
                    key: "item2",

                    value() {
                        return h(
                            "view",
                            {
                                style: styles.item,
                                original: "View",
                                diuu: "DIUU00007",
                                tempName: "ITNP00009"
                            },
                            h(
                                "view",
                                {
                                    style: styles.itemText,
                                    original: "OuterText",
                                    diuu: "DIUU00008"
                                },
                                "item2"
                            )
                        )
                    }
                },
                {
                    kind: "method",
                    key: "render",
                    value: function render() {
                        const { toggleClicked1, arr, user, count } = this.state
                        const item1 = h(
                            "view",
                            {
                                style: styles.item,
                                original: "View",
                                diuu: "DIUU00010",
                                tempName: "ITNP00012"
                            },
                            h(
                                "view",
                                {
                                    style: styles.itemText,
                                    original: "OuterText",
                                    diuu: "DIUU00011"
                                },
                                "item1"
                            )
                        )
                        return h(
                            WXScrollView,
                            {
                                style: {
                                    flex: 1
                                },
                                contentContainerStyle: {
                                    backgroundColor: "#fff"
                                },
                                diuu: "DIUU00013",
                                tempName: "ITNP00054"
                            },
                            h(
                                "view",
                                {
                                    style: styles.button,
                                    original: "View",
                                    diuu: "DIUU00014"
                                },
                                h(WXButton, {
                                    color: "#fff",
                                    title: "PUSH C PAGE",
                                    onPress: () => {
                                        history.push("", "C", {
                                            text: "Alita"
                                        })
                                    },
                                    diuu: "DIUU00015"
                                })
                            ),
                            h(
                                "view",
                                {
                                    style: styles.item,
                                    original: "View",
                                    diuu: "DIUU00016"
                                },
                                h(
                                    "view",
                                    {
                                        style: {
                                            fontSize: 16,
                                            color: "rgb(24, 144, 255)"
                                        },
                                        original: "OuterText",
                                        diuu: "DIUU00017"
                                    },
                                    "Platform: ",
                                    h("template", {
                                        datakey: "CTDK00013",
                                        tempVnode: Platform.OS,
                                        "wx:if": "{{CTDK00013}}",
                                        is: "CTNP00012",
                                        data: "{{...CTDK00013}}"
                                    })
                                )
                            ),
                            h(PlatformComp, {
                                style: styles.item,
                                diuu: "DIUU00018"
                            }),
                            h("template", {
                                datakey: "CTDK00037",
                                tempVnode: item1,
                                "wx:if": "{{CTDK00037}}",
                                is: "CTNP00036",
                                data: "{{...CTDK00037}}"
                            }),
                            h("template", {
                                datakey: "CTDK00038",
                                tempVnode: this.item2,
                                "wx:if": "{{CTDK00038}}",
                                is: "CTNP00036",
                                data: "{{...CTDK00038}}"
                            }),
                            h("template", {
                                datakey: "CTDK00039",
                                tempVnode: item3,
                                "wx:if": "{{CTDK00039}}",
                                is: "CTNP00036",
                                data: "{{...CTDK00039}}"
                            }),
                            h(
                                "view",
                                {
                                    style: styles.button,
                                    original: "View",
                                    diuu: "DIUU00019"
                                },
                                h(WXButton, {
                                    title: "CLICK ME",
                                    color: "#fff",
                                    onPress: () => {
                                        this.setState({
                                            toggleClicked1: !toggleClicked1
                                        })
                                    },
                                    diuu: "DIUU00020"
                                })
                            ),
                            h("template", {
                                datakey: "CTDK00040",
                                tempVnode:
                                    toggleClicked1 &&
                                    h(
                                        "view",
                                        {
                                            style: styles.item,
                                            original: "View",
                                            diuu: "DIUU00021",
                                            tempName: "ITNP00023"
                                        },
                                        h(
                                            "view",
                                            {
                                                style: styles.itemText,
                                                original: "OuterText",
                                                diuu: "DIUU00022"
                                            },
                                            "clicked is true"
                                        )
                                    ),
                                "wx:if": "{{CTDK00040}}",
                                is: "CTNP00036",
                                data: "{{...CTDK00040}}"
                            }),
                            h("template", {
                                datakey: "CTDK00041",
                                tempVnode: this.getText1(),
                                "wx:if": "{{CTDK00041}}",
                                is: "CTNP00036",
                                data: "{{...CTDK00041}}"
                            }),
                            h("template", {
                                datakey: "CTDK00042",
                                tempVnode: this.getText2("function返回JSX"),
                                "wx:if": "{{CTDK00042}}",
                                is: "CTNP00036",
                                data: "{{...CTDK00042}}"
                            }),
                            h(
                                "view",
                                {
                                    style: styles.item,
                                    original: "View",
                                    diuu: "DIUU00024"
                                },
                                h("template", {
                                    datakey: "CTDK00022",
                                    tempVnode: arr.map(ele =>
                                        h(
                                            "view",
                                            {
                                                style: styles.itemText,
                                                key: ele,
                                                original: "OuterText",
                                                diuu: "DIUU00025",
                                                tempName: "ITNP00026"
                                            },
                                            h("template", {
                                                datakey: "CTDK00020",
                                                tempVnode: ele,
                                                "wx:if": "{{CTDK00020}}",
                                                is: "CTNP00019",
                                                data: "{{...CTDK00020}}"
                                            }),
                                            ","
                                        )
                                    ),
                                    "wx:if": "{{CTDK00022}}",
                                    is: "CTNP00021",
                                    data: "{{...CTDK00022}}"
                                })
                            ),
                            h(
                                MyContext,
                                _extends({}, user, {
                                    diuu: "DIUU00027"
                                })
                            ),
                            h(
                                "view",
                                {
                                    style: styles.button,
                                    original: "View",
                                    diuu: "DIUU00028"
                                },
                                h(WXButton, {
                                    title: "Add One",
                                    color: "#fff",
                                    onPress: this.handleIncre,
                                    diuu: "DIUU00029"
                                })
                            ),
                            h(MyRefComp, {
                                ref: mrc => (this.mrc = mrc),
                                diuu: "DIUU00030"
                            }),
                            h(MyPropComp, {
                                headerComponent: h(
                                    "view",
                                    {
                                        style: styles.item,
                                        original: "View",
                                        diuu: "DIUU00031",
                                        tempName: "ITNP00033"
                                    },
                                    h(
                                        "view",
                                        {
                                            style: styles.itemText,
                                            original: "OuterText",
                                            diuu: "DIUU00032"
                                        },
                                        "header"
                                    )
                                ),
                                footerComponent: () => {
                                    return h(
                                        "view",
                                        {
                                            style: styles.item,
                                            original: "View",
                                            diuu: "DIUU00034",
                                            tempName: "ITNP00036"
                                        },
                                        h(
                                            "view",
                                            {
                                                style: styles.itemText,
                                                original: "OuterText",
                                                diuu: "DIUU00035"
                                            },
                                            "footer"
                                        )
                                    )
                                },
                                "generic:headerComponentCPT": "ICNPaaaaa",
                                "generic:footerComponentCPT": "ICNPaaaab",
                                diuu: "DIUU00037"
                            }),
                            h(
                                MyFunComp,
                                _extends({}, user, {
                                    diuu: "DIUU00038"
                                })
                            ),
                            h(
                                MyChildComp,
                                {
                                    "generic:childrenCPT": "ICNPaaaac",
                                    diuu: "DIUU00039"
                                },
                                h(
                                    "view",
                                    {
                                        style: styles.item,
                                        original: "View",
                                        diuu: "DIUU00040",
                                        tempName: "ITNP00042"
                                    },
                                    h(
                                        "view",
                                        {
                                            style: styles.itemText,
                                            original: "OuterText",
                                            diuu: "DIUU00041"
                                        },
                                        "a"
                                    )
                                ),
                                h(
                                    "view",
                                    {
                                        style: styles.item,
                                        original: "View",
                                        diuu: "DIUU00043",
                                        tempName: "ITNP00045"
                                    },
                                    h(
                                        "view",
                                        {
                                            style: styles.itemText,
                                            original: "OuterText",
                                            diuu: "DIUU00044"
                                        },
                                        "b"
                                    )
                                ),
                                h(
                                    "view",
                                    {
                                        style: [
                                            styles.item,
                                            {
                                                borderBottomWidth: 0
                                            }
                                        ],
                                        original: "View",
                                        diuu: "DIUU00046",
                                        tempName: "ITNP00048"
                                    },
                                    h(
                                        "view",
                                        {
                                            style: styles.itemText,
                                            original: "OuterText",
                                            diuu: "DIUU00047"
                                        },
                                        "c"
                                    )
                                )
                            ),
                            h(MyHoc, {
                                txt: "HOC",
                                diuu: "DIUU00049"
                            }),
                            h(MyStyleComp, {
                                diuu: "DIUU00050"
                            }),
                            h(MyForceUpdate, {
                                diuu: "DIUU00051"
                            }),
                            h(Hi, {
                                name: "Yvette",
                                style: styles.item,
                                textStyle: styles.itemText,
                                diuu: "DIUU00052"
                            }),
                            h(Hello, {
                                name: "y5g",
                                style: [
                                    styles.item,
                                    {
                                        borderBottomWidth: 0
                                    }
                                ],
                                textStyle: styles.itemText,
                                diuu: "DIUU00053"
                            })
                        )
                    }
                },
                {
                    kind: "field",
                    key: "__stateless__",

                    value() {
                        return false
                    }
                }
            ]
        }
    },
    Component
)

export { A as default }
