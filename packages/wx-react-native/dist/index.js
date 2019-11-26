'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var wxReact = require('@areslabs/wx-react');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var SCROLL = wxReact.styleType.SCROLL;

var WXFlatList =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(WXFlatList, _PureComponent);

  function WXFlatList() {
    _classCallCheck(this, WXFlatList);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXFlatList).apply(this, arguments));
  }

  _createClass(WXFlatList, [{
    key: "scrollToOffset",
    value: function scrollToOffset(position) {
      var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
      wxInst.scrollToOffset(position);
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(position) {
      var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
      wxInst.scrollTo(position);
    }
  }, {
    key: "scrollToIndex",
    value: function scrollToIndex(opt) {
      var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
      wxInst.scrollToIndex(opt);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.refreshing !== undefined && this.props.refreshing !== nextProps.refreshing) {
        var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
        wxInst.setData({
          sr: nextProps.refreshing
        });
      }
    }
  }, {
    key: "getStyleAndDiuu",
    value: function getStyleAndDiuu() {
      var _this$props = this.props,
          style = _this$props.style,
          contentContainerStyle = _this$props.contentContainerStyle;
      return {
        diuu: '',
        style: wxReact.tackleWithStyleObj(style, SCROLL),
        contentContainerStyle: wxReact.tackleWithStyleObj(contentContainerStyle)
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          ListHeaderComponent = _this$props2.ListHeaderComponent,
          ListFooterComponent = _this$props2.ListFooterComponent,
          ListEmptyComponent = _this$props2.ListEmptyComponent,
          data = _this$props2.data,
          renderItem = _this$props2.renderItem,
          keyExtractor = _this$props2.keyExtractor,
          _this$props2$contentC = _this$props2.contentContainerStyle,
          contentContainerStyle = _this$props2$contentC === void 0 ? '' : _this$props2$contentC,
          _this$props2$numColum = _this$props2.numColumns,
          numColumns = _this$props2$numColum === void 0 ? 1 : _this$props2$numColum,
          _this$props2$onEndRea = _this$props2.onEndReachedThreshold,
          onEndReachedThreshold = _this$props2$onEndRea === void 0 ? 0.1 : _this$props2$onEndRea,
          _this$props2$refreshi = _this$props2.refreshing,
          refreshing = _this$props2$refreshi === void 0 ? false : _this$props2$refreshi,
          onRefresh = _this$props2.onRefresh,
          getItemLayout = _this$props2.getItemLayout,
          _this$props2$stickyHe = _this$props2.stickyHeaderIndices,
          stickyHeaderIndices = _this$props2$stickyHe === void 0 ? [] : _this$props2$stickyHe;
      var children = [];

      if (ListHeaderComponent) {
        var CPTVnode = ListHeaderComponent.isReactElement ? ListHeaderComponent : ListHeaderComponent();
        var header = wxReact.createElement('ListHeaderComponentCPT', {
          diuu: 'ListHeaderComponentDIUU',
          CPTVnode: CPTVnode
        });
        children.push(header);
      }

      if (ListEmptyComponent && data && data.length === 0) {
        var _CPTVnode = ListEmptyComponent.isReactElement ? ListEmptyComponent : ListEmptyComponent();

        var empty = wxReact.createElement('ListEmptyComponentCPT', {
          diuu: 'ListEmptyComponentDIUU',
          CPTVnode: _CPTVnode
        });
        children.push(empty);
      }

      if (data && data.length > 0) {
        var body = wxReact.createElement("template", {
          datakey: "renderItemData",
          tempVnode: data.map(function (item, index) {
            var CPTVnode = renderItem({
              item: item,
              index: index
            });
            var key = index;

            if (keyExtractor) {
              key = keyExtractor(item, index);
            } else {
              key = item.key;
            }

            return wxReact.createElement('renderItemCPT', {
              key: key,
              diuu: "renderItemDIUU",
              CPTVnode: CPTVnode,
              // 最外层元素需要tempName属性， 在这里无实际意义， 只是为了标志， 不能删除 ，会影响render函数的执行
              tempName: 'renderItem'
            });
          })
        });
        children.push(body);
      }

      if (ListFooterComponent) {
        var _CPTVnode2 = ListFooterComponent.isReactElement ? ListFooterComponent : ListFooterComponent();

        var footer = wxReact.createElement('ListFooterComponentCPT', {
          diuu: 'ListFooterComponentDIUU',
          CPTVnode: _CPTVnode2
        });
        children.push(footer);
      }

      var bakStickyHeaderIndices = stickyHeaderIndices;

      if (ListHeaderComponent) {
        bakStickyHeaderIndices = stickyHeaderIndices.map(function (e) {
          return e - 1;
        });
      }

      var baseObj = _objectSpread2({
        contentContainerStyle: contentContainerStyle,
        stickyHeaderIndices: bakStickyHeaderIndices,
        numColumns: numColumns,
        onEndReachedThreshold: onEndReachedThreshold * 600,
        refreshing: refreshing,
        onRefreshPassed: !!onRefresh
      }, this.getStyleAndDiuu());

      var stickyInfos = [];
      var topOffset = 0;

      if (Array.isArray(bakStickyHeaderIndices) && bakStickyHeaderIndices.length > 0 && typeof getItemLayout === 'function') {
        for (var k = 0; k < bakStickyHeaderIndices.length; k++) {
          var stickyHeaderIndex = bakStickyHeaderIndices[k];
          var preOffset = topOffset;

          var _getItemLayout = getItemLayout(data, stickyHeaderIndex),
              offset = _getItemLayout.offset,
              length = _getItemLayout.length,
              index = _getItemLayout.index;

          stickyInfos.push({
            baseOffset: offset,
            length: length,
            index: index,
            topPosition: preOffset
          });
          topOffset += length;
        }
      }

      Object.assign(baseObj, {
        stickyInfos: stickyInfos
      });
      return wxReact.createElement.apply(void 0, ['phblock', baseObj].concat(children));
    }
  }]);

  return WXFlatList;
}(wxReact.PureComponent);

var SCROLL$1 = wxReact.styleType.SCROLL;

var WXSectionList =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(WXSectionList, _PureComponent);

  function WXSectionList() {
    _classCallCheck(this, WXSectionList);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXSectionList).apply(this, arguments));
  }

  _createClass(WXSectionList, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.refreshing !== undefined && this.props.refreshing !== nextProps.refreshing) {
        var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
        wxInst.setData({
          sr: nextProps.refreshing
        });
      }
    }
  }, {
    key: "getStyleAndDiuu",
    value: function getStyleAndDiuu() {
      var _this$props = this.props,
          style = _this$props.style,
          contentContainerStyle = _this$props.contentContainerStyle;
      return {
        diuu: '',
        style: wxReact.tackleWithStyleObj(style, SCROLL$1),
        contentContainerStyle: wxReact.tackleWithStyleObj(contentContainerStyle)
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          ListHeaderComponent = _this$props2.ListHeaderComponent,
          ListFooterComponent = _this$props2.ListFooterComponent,
          sections = _this$props2.sections,
          renderItem = _this$props2.renderItem,
          renderSectionFooter = _this$props2.renderSectionFooter,
          renderSectionHeader = _this$props2.renderSectionHeader,
          keyExtractor = _this$props2.keyExtractor,
          _this$props2$contentC = _this$props2.contentContainerStyle,
          contentContainerStyle = _this$props2$contentC === void 0 ? '' : _this$props2$contentC,
          _this$props2$numColum = _this$props2.numColumns,
          numColumns = _this$props2$numColum === void 0 ? 1 : _this$props2$numColum,
          _this$props2$onEndRea = _this$props2.onEndReachedThreshold,
          onEndReachedThreshold = _this$props2$onEndRea === void 0 ? null : _this$props2$onEndRea,
          _this$props2$refreshi = _this$props2.refreshing,
          refreshing = _this$props2$refreshi === void 0 ? false : _this$props2$refreshi,
          onRefresh = _this$props2.onRefresh,
          renderScrollComponent = _this$props2.renderScrollComponent;
      var children = [];

      if (ListHeaderComponent) {
        var CPTVnode = ListHeaderComponent.isReactElement ? ListHeaderComponent : ListHeaderComponent();
        var header = wxReact.createElement('ListHeaderComponentCPT', {
          diuu: 'ListHeaderComponentDIUU',
          CPTVnode: CPTVnode
        });
        children.push(header);
      }

      if (sections && sections.length > 0) {
        var body = wxReact.createElement("template", {
          datakey: "sectionsData",
          tempVnode: sections.map(function (item, index) {
            var seChildren = [];

            if (renderSectionHeader) {
              var sh = wxReact.createElement('renderSectionHeaderCPT', {
                diuu: 'renderSectionHeaderDIUU',
                CPTVnode: renderSectionHeader({
                  section: item
                })
              });
              seChildren.push(sh);
            }

            if (item.data && item.data.length > 0 && renderItem) {
              var sbody = wxReact.createElement('template', {
                datakey: 'renderItemData',
                tempVnode: item.data.map(function (iitem, index) {
                  var CPTVnode = renderItem({
                    item: iitem,
                    index: index,
                    section: item
                  });
                  var key = index;

                  if (keyExtractor) {
                    key = keyExtractor(iitem, index);
                  } else {
                    key = iitem.key;
                  }

                  return wxReact.createElement('renderItemCPT', {
                    key: key,
                    diuu: "renderItemDIUU",
                    CPTVnode: CPTVnode,
                    // 最外层元素需要tempName属性， 在这里无实际意义， 只是为了标志， 会影响render函数的执行
                    tempName: 'renderItem'
                  });
                })
              });
              seChildren.push(sbody);
            }

            if (renderSectionFooter) {
              var sf = wxReact.createElement('renderSectionFooterCPT', {
                diuu: 'renderSectionFooterDIUU',
                CPTVnode: renderSectionFooter({
                  section: item
                })
              });
              seChildren.push(sf);
            }

            return wxReact.createElement.apply(void 0, ['phblock', {
              key: item.key || index,
              tempName: 'sectionsRender'
            }].concat(seChildren));
          })
        });
        children.push(body);
      }

      if (ListFooterComponent) {
        var _CPTVnode = ListFooterComponent.isReactElement ? ListFooterComponent : ListFooterComponent();

        var footer = wxReact.createElement('ListFooterComponentCPT', {
          diuu: 'ListFooterComponentDIUU',
          CPTVnode: _CPTVnode
        });
        children.push(footer);
      }

      return wxReact.createElement.apply(void 0, ['phblock', _objectSpread2({
        contentContainerStyle: contentContainerStyle,
        numColumns: numColumns,
        onEndReachedThreshold: onEndReachedThreshold ? onEndReachedThreshold * 300 : 0,
        refreshing: refreshing,
        onRefreshPassed: !!onRefresh,
        renderScrollComponentPassed: !!renderScrollComponent
      }, this.getStyleAndDiuu())].concat(children));
    }
  }]);

  return WXSectionList;
}(wxReact.PureComponent);

var SCROLL$2 = wxReact.styleType.SCROLL;

var WXScrollView =
/*#__PURE__*/
function (_RNBaseComponent) {
  _inherits(WXScrollView, _RNBaseComponent);

  function WXScrollView() {
    _classCallCheck(this, WXScrollView);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXScrollView).apply(this, arguments));
  }

  _createClass(WXScrollView, [{
    key: "scrollTo",
    value: function scrollTo(position) {
      var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
      wxInst.scrollTo(position);
    }
  }, {
    key: "scrollToEnd",
    value: function scrollToEnd() {
      var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
      wxInst.scrollTo({
        x: 9999999,
        y: 9999999
      });
    }
  }, {
    key: "getStyle",
    value: function getStyle(props) {
      return {
        style: wxReact.tackleWithStyleObj(props.style, SCROLL$2),
        contentContainerStyle: wxReact.tackleWithStyleObj(props.contentContainerStyle)
      };
    }
  }]);

  return WXScrollView;
}(wxReact.RNBaseComponent);

var VIEW = wxReact.styleType.VIEW;

var WXPickerItem =
/*#__PURE__*/
function (_RNBaseComponent) {
  _inherits(WXPickerItem, _RNBaseComponent);

  function WXPickerItem() {
    _classCallCheck(this, WXPickerItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXPickerItem).apply(this, arguments));
  }

  _createClass(WXPickerItem, [{
    key: "getStyle",
    value: function getStyle(props) {
      return {
        style: ''
      };
    }
  }]);

  return WXPickerItem;
}(wxReact.RNBaseComponent);

var VIEW$1 = wxReact.styleType.VIEW;

var WXPicker =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(WXPicker, _PureComponent);

  function WXPicker() {
    _classCallCheck(this, WXPicker);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXPicker).apply(this, arguments));
  }

  _createClass(WXPicker, [{
    key: "getStyleAndDiuu",
    value: function getStyleAndDiuu() {
      var style = this.props.style;
      return {
        diuu: '',
        style: wxReact.tackleWithStyleObj(style, VIEW$1)
      };
    }
  }, {
    key: "getSelectableIndex",
    value: function getSelectableIndex(pickData) {
      var selectedValue = this.props.selectedValue;

      for (var i = 0; i < pickData.length; i++) {
        var item = pickData[i];

        if (item.value === selectedValue) {
          return [i];
        }
      }

      return [0];
    }
  }, {
    key: "render",
    value: function render() {
      var children = this.props.children;
      var pickData = [];
      var body = wxReact.createElement("template", {
        datakey: "childrenData",
        tempVnode: children.map(function (child, index) {
          var CPTVnode = child;
          var _child$props = child.props,
              label = _child$props.label,
              value = _child$props.value;
          pickData.push({
            label: label,
            value: value
          });
          var key = index;
          return wxReact.createElement('childrenCPT', {
            key: key,
            diuu: "childrenDIUU",
            CPTVnode: CPTVnode,
            // 最外层元素需要tempName属性， 在这里无实际意义， 只是为了标志， 会影响render函数的执行
            tempName: 'children'
          });
        })
      });
      var seleIndex = this.getSelectableIndex(pickData);
      return wxReact.createElement('phblock', _objectSpread2({
        itemLength: children.length,
        pickData: pickData,
        seleIndex: seleIndex
      }, this.getStyleAndDiuu()), body);
    }
  }]);

  return WXPicker;
}(wxReact.PureComponent);
WXPicker.Item = WXPickerItem;

var VIEW$2 = wxReact.styleType.VIEW;

var WXTextInput =
/*#__PURE__*/
function (_RNBaseComponent) {
  _inherits(WXTextInput, _RNBaseComponent);

  function WXTextInput() {
    _classCallCheck(this, WXTextInput);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXTextInput).apply(this, arguments));
  }

  _createClass(WXTextInput, [{
    key: "getStyle",
    value: function getStyle(props) {
      return {
        style: wxReact.tackleWithStyleObj(props.style, VIEW$2)
      };
    }
  }, {
    key: "focus",
    value: function focus() {
      var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
      wxInst.focus();
    }
  }, {
    key: "isFocused",
    value: function isFocused() {
      var wxInst = wxReact.instanceManager.getWxInstByUUID(this.__diuu__);
      wxInst.isFocused();
    }
  }]);

  return WXTextInput;
}(wxReact.RNBaseComponent);

var VIEW$3 = wxReact.styleType.VIEW;

var WXButton =
/*#__PURE__*/
function (_RNBaseComponent) {
  _inherits(WXButton, _RNBaseComponent);

  function WXButton() {
    _classCallCheck(this, WXButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXButton).apply(this, arguments));
  }

  _createClass(WXButton, [{
    key: "getStyle",
    value: function getStyle(props) {
      return {
        // Button 不接受style属性
        style: wxReact.tackleWithStyleObj('', VIEW$3)
      };
    }
  }]);

  return WXButton;
}(wxReact.RNBaseComponent);

var VIEW$4 = wxReact.styleType.VIEW;

function getStyleStr(visible, transparent, animationType) {
  var ss = '';
  ss += visible ? 'visibility: visible;' : 'visibility: hidden;';
  ss += transparent ? 'background-color: transparent;' : 'background-color: white;';

  if (animationType === 'none') ; else if (animationType === 'slide') {
    ss += 'transition: all 0.3s;';

    if (!visible) {
      ss += 'top: 100vh;';
    } else {
      ss += 'top: 0;';
    }
  } else if (animationType === 'fade') {
    ss += 'transition: all 0.2s;';

    if (!visible) {
      ss += 'opacity: 0';
    } else {
      ss += 'opacity: 1';
    }
  }

  return ss;
}

var WXModal =
/*#__PURE__*/
function (_RNBaseComponent) {
  _inherits(WXModal, _RNBaseComponent);

  function WXModal() {
    _classCallCheck(this, WXModal);

    return _possibleConstructorReturn(this, _getPrototypeOf(WXModal).apply(this, arguments));
  }

  _createClass(WXModal, [{
    key: "getStyle",
    value: function getStyle(props) {
      var visible = props.visible,
          transparent = props.transparent,
          animationType = props.animationType;
      return {
        style: "display: flex; position: fixed; top:0; bottom:0; left:0; right:0; z-index: 100000; ".concat(getStyleStr(visible, transparent, animationType))
      };
    }
  }]);

  return WXModal;
}(wxReact.RNBaseComponent);

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var StyleSheet = {
  create: function create(obj) {
    var allKeys = Object.keys(obj);
    var r = {};

    for (var i = 0; i < allKeys.length; i++) {
      var k = allKeys[i];
      var v = obj[k];
      r[k] = wxReact.parseElement(v);
    }

    return r;
  },
  flatten: function flatten(creStyle) {
    return wxReact.flattenStyle(creStyle);
  },
  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var Platform = {
  OS: 'wx',
  select: function select(obj) {
    return obj.wx;
  }
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var systemInfo = null;
function getSystemInfoSync() {
  if (systemInfo) {
    return systemInfo;
  }

  systemInfo = wx.getSystemInfoSync();
  return systemInfo;
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var Dimensions = {
  get: function get(arg) {
    if (arg === 'window') {
      var _getSystemInfoSync = getSystemInfoSync(),
          screenHeight = _getSystemInfoSync.screenHeight,
          screenWidth = _getSystemInfoSync.screenWidth,
          windowHeight = _getSystemInfoSync.windowHeight;

      return {
        width: screenWidth,
        height: screenHeight,
        windowHeight: windowHeight
      };
    }
  }
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var Alert = {
  alert: function alert(title) {
    var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var buttons = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    message = message + '';
    var opt = {
      title: title,
      content: message
    };

    if (buttons.length === 0) {
      opt.showCancel = false;
    }

    if (buttons.length === 1) {
      opt.showCancel = false;
      opt.confirmText = buttons[0].text || '确认';

      if (buttons[0].onPress) {
        opt.success = buttons[0].onPress;
      }
    }

    if (buttons.length >= 2) {
      var ok = buttons[0];
      var cancel = buttons[1];
      opt.cancelText = cancel.text || '取消';

      if (cancel.onPress) {
        opt.fail = cancel.onPress;
      }

      opt.confirmText = ok.text || '确认';

      if (ok.onPress) {
        opt.success = ok.onPress;
      }
    }

    wx.showModal(opt);
  }
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var PixelRatio = {
  get: function get() {
    var _getSystemInfoSync = getSystemInfoSync(),
        pixelRatio = _getSystemInfoSync.pixelRatio;

    return pixelRatio;
  }
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var AsyncStorage = {
  getItem: function getItem(key, callback) {
    return new Promise(function (resolve, reject) {
      wx.getStorage({
        key: key,
        success: function success(res) {
          resolve(res.data);
        },
        fail: function fail(err) {
          reject(err);
        },
        complete: function complete(res) {
          callback && callback(res);
        }
      });
    });
  },
  setItem: function setItem(key, data, callback) {
    return new Promise(function (resolve, reject) {
      wx.setStorage({
        key: key,
        data: data,
        success: function success() {
          resolve(null);
        },
        fail: function fail(err) {
          reject(err);
        },
        complete: function complete(res) {
          callback && callback(res);
        }
      });
    });
  },
  removeItem: function removeItem(key, callback) {
    return new Promise(function (resolve, reject) {
      wx.setStorage({
        key: key,
        success: function success() {
          resolve(null);
        },
        fail: function fail(err) {
          reject(err);
        },
        complete: function complete(res) {
          callback && callback(res);
        }
      });
    });
  },
  clear: function clear(callback) {
    return new Promise(function (resolve, reject) {
      wx.clearStorage({
        success: function success() {
          resolve(null);
        },
        fail: function fail(err) {
          reject(err);
        },
        complete: function complete(res) {
          callback && callback(res);
        }
      });
    });
  }
};

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function fetch(url) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$method = _ref.method,
      method = _ref$method === void 0 ? "GET" : _ref$method,
      body = _ref.body,
      headers = _ref.headers;

  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: body,
      header: _objectSpread2({
        'Content-Type': 'application/json'
      }, headers),
      method: method.toUpperCase(),
      success: function success(res) {
        var re = {
          json: function json() {
            return Promise.resolve(res.data);
          },
          headers: res.header,
          status: res.statusCode
        };
        resolve(re);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function alert() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  wx.showModal({
    title: 'alert',
    content: msg + '',
    showCancel: false
  });
}

var loadTime = Date.now();

function now() {
  return Date.now() - loadTime;
}

var last = 0,
    id = 0,
    queue = [],
    frameDuration = 1000 / 60;
var requestAnimationFrame = function requestAnimationFrame(callback) {
  if (queue.length === 0) {
    var _now = now(),
        next = Math.max(0, frameDuration - (_now - last));

    last = next + _now;
    setTimeout(function () {
      var cp = queue.slice(0); // Clear queue here to prevent
      // callbacks from appending listeners
      // to the current frame's queue

      queue.length = 0;

      for (var i = 0; i < cp.length; i++) {
        if (!cp[i].cancelled) {
          try {
            cp[i].callback(last);
          } catch (e) {
            setTimeout(function () {
              throw e;
            }, 0);
          }
        }
      }
    }, Math.round(next));
  }

  queue.push({
    handle: ++id,
    callback: callback,
    cancelled: false
  });
  return id;
};
var cancelAnimationFrame = function cancelAnimationFrame(handle) {
  for (var i = 0; i < queue.length; i++) {
    if (queue[i].handle === handle) {
      queue[i].cancelled = true;
    }
  }
};

var VIEW$5 = wxReact.styleType.VIEW;
var BaseView = "";
function getWXBaseComponent() {
  return (
    /*#__PURE__*/
    function (_RNBaseComponent) {
      _inherits(WXBaseComponent, _RNBaseComponent);

      function WXBaseComponent() {
        _classCallCheck(this, WXBaseComponent);

        return _possibleConstructorReturn(this, _getPrototypeOf(WXBaseComponent).apply(this, arguments));
      }

      _createClass(WXBaseComponent, [{
        key: "getStyle",
        value: function getStyle(props) {
          return {
            style: wxReact.tackleWithStyleObj(props.style, VIEW$5)
          };
        }
      }]);

      return WXBaseComponent;
    }(wxReact.RNBaseComponent)
  );
}
function getNotSupport(name) {
  return {
    notSupport: function notSupport() {
      console.error("\u5C0F\u7A0B\u5E8F\u4E0D\u652F\u6301".concat(name));
    }
  };
}

/**
 * Copyright (c) Areslabs.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var WXView = BaseView;
var WXImage = BaseView;
var WXText = BaseView;
var WXTextInner = BaseView;
var WXTouchableHighlight = BaseView;
var WXTouchableOpacity = BaseView;
var WXTouchableWithoutFeedback = BaseView;
var WXSlider = getWXBaseComponent();
var WXSwitch = getWXBaseComponent();
var WXRefreshControl = getWXBaseComponent();
var WXWebView = getWXBaseComponent(); // not support yet

var DatePickerIOS = getNotSupport('DatePickerIOS');
var ViewPagerAndroid = getNotSupport('ViewPagerAndroid');
var StatusBar = getNotSupport('StatusBar');
var DatePickerAndroid = getNotSupport('DatePickerAndroid');
var DrawerAndroid = getNotSupport('DrawerAndroid');
var Animated = getNotSupport('Animated');
var ProgressBarAndroid = getNotSupport('ProgressBarAndroid');
var ProgressViewIOS = getNotSupport('ProgressViewIOS');
var SegmentedControlIOS = getNotSupport('SegmentedControlIOS');
var TabBarIOS = getNotSupport('TabBarIOS');
var TimePickerAndroid = getNotSupport('TimePickerAndroid');
var ToastAndroid = getNotSupport('ToastAndroid');
var ToolbarAndroid = getNotSupport('ToolbarAndroid');
var AppState = {
  removeEventListener: function removeEventListener() {
    console.warn('not support AppState now!');
  },
  addEventListener: function addEventListener() {
    console.warn('not support AppState now!');
  }
};
var NativeAppEventEmitter = {
  addListener: function addListener() {
    console.warn('not support NativeAppEventEmitter now! use @areslabs/wx-eventemitter instead');
    return function () {
      console.warn('not support NativeAppEventEmitter now! use @areslabs/wx-eventemitter instead');
    };
  }
};
var DeviceEventEmitter = {
  addListener: function addListener() {
    console.warn('use @areslabs/wx-eventemitter instead');
    return function () {
      console.warn('use @areslabs/wx-eventemitter instead');
    };
  }
};
var index = {
  WXButton: WXButton,
  WXView: WXView,
  WXText: WXText,
  WXTextInner: WXTextInner,
  WXFlatList: WXFlatList,
  WXSectionList: WXSectionList,
  WXImage: WXImage,
  WXModal: WXModal,
  WXPicker: WXPicker,
  WXSlider: WXSlider,
  WXSwitch: WXSwitch,
  WXTextInput: WXTextInput,
  WXTouchableHighlight: WXTouchableHighlight,
  WXTouchableOpacity: WXTouchableOpacity,
  WXTouchableWithoutFeedback: WXTouchableWithoutFeedback,
  WXScrollView: WXScrollView,
  WXRefreshControl: WXRefreshControl,
  WXWebView: WXWebView,
  ViewPagerAndroid: ViewPagerAndroid,
  DatePickerIOS: DatePickerIOS,
  StatusBar: StatusBar,
  DatePickerAndroid: DatePickerAndroid,
  DrawerAndroid: DrawerAndroid,
  Animated: Animated,
  ProgressBarAndroid: ProgressBarAndroid,
  ProgressViewIOS: ProgressViewIOS,
  SegmentedControlIOS: SegmentedControlIOS,
  TabBarIOS: TabBarIOS,
  TimePickerAndroid: TimePickerAndroid,
  ToastAndroid: ToastAndroid,
  ToolbarAndroid: ToolbarAndroid,
  StyleSheet: StyleSheet,
  Platform: Platform,
  Dimensions: Dimensions,
  Alert: Alert,
  PixelRatio: PixelRatio,
  AsyncStorage: AsyncStorage,
  fetch: fetch,
  alert: alert,
  requestAnimationFrame: requestAnimationFrame,
  cancelAnimationFrame: cancelAnimationFrame,
  unstable_batchedUpdates: wxReact.unstable_batchedUpdates,
  AppState: AppState,
  NativeAppEventEmitter: NativeAppEventEmitter,
  DeviceEventEmitter: DeviceEventEmitter
};

Object.defineProperty(exports, 'unstable_batchedUpdates', {
  enumerable: true,
  get: function () {
    return wxReact.unstable_batchedUpdates;
  }
});
exports.Alert = Alert;
exports.Animated = Animated;
exports.AppState = AppState;
exports.AsyncStorage = AsyncStorage;
exports.DatePickerAndroid = DatePickerAndroid;
exports.DatePickerIOS = DatePickerIOS;
exports.DeviceEventEmitter = DeviceEventEmitter;
exports.Dimensions = Dimensions;
exports.DrawerAndroid = DrawerAndroid;
exports.NativeAppEventEmitter = NativeAppEventEmitter;
exports.PixelRatio = PixelRatio;
exports.Platform = Platform;
exports.ProgressBarAndroid = ProgressBarAndroid;
exports.ProgressViewIOS = ProgressViewIOS;
exports.SegmentedControlIOS = SegmentedControlIOS;
exports.StatusBar = StatusBar;
exports.StyleSheet = StyleSheet;
exports.TabBarIOS = TabBarIOS;
exports.TimePickerAndroid = TimePickerAndroid;
exports.ToastAndroid = ToastAndroid;
exports.ToolbarAndroid = ToolbarAndroid;
exports.ViewPagerAndroid = ViewPagerAndroid;
exports.WXButton = WXButton;
exports.WXFlatList = WXFlatList;
exports.WXImage = WXImage;
exports.WXModal = WXModal;
exports.WXPicker = WXPicker;
exports.WXRefreshControl = WXRefreshControl;
exports.WXScrollView = WXScrollView;
exports.WXSectionList = WXSectionList;
exports.WXSlider = WXSlider;
exports.WXSwitch = WXSwitch;
exports.WXText = WXText;
exports.WXTextInner = WXTextInner;
exports.WXTextInput = WXTextInput;
exports.WXTouchableHighlight = WXTouchableHighlight;
exports.WXTouchableOpacity = WXTouchableOpacity;
exports.WXTouchableWithoutFeedback = WXTouchableWithoutFeedback;
exports.WXView = WXView;
exports.WXWebView = WXWebView;
exports.alert = alert;
exports.cancelAnimationFrame = cancelAnimationFrame;
exports.default = index;
exports.fetch = fetch;
exports.requestAnimationFrame = requestAnimationFrame;
