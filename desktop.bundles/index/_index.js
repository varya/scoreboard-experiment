/* ../../libs/bem-bl/blocks-common/i-jquery/__inherit/i-jquery__inherit.js begin */
/**
 * Inheritance plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.3.5
 */

(function($) {

var hasIntrospection = (function(){'_';}).toString().indexOf('_') > -1,
    emptyBase = function() {},
    objCreate = Object.create || function(ptp) {
        var inheritance = function() {};
        inheritance.prototype = ptp;
        return new inheritance();
    },
    needCheckProps = true,
    testPropObj = { toString : '' };

for(var i in testPropObj) { // fucking ie hasn't toString, valueOf in for
    testPropObj.hasOwnProperty(i) && (needCheckProps = false);
}

var specProps = needCheckProps? ['toString', 'valueOf'] : null;

function override(base, result, add) {

    var hasSpecProps = false;
    if(needCheckProps) {
        var addList = [];
        $.each(specProps, function() {
            add.hasOwnProperty(this) && (hasSpecProps = true) && addList.push({
                name : this,
                val  : add[this]
            });
        });
        if(hasSpecProps) {
            $.each(add, function(name) {
                addList.push({
                    name : name,
                    val  : this
                });
            });
            add = addList;
        }
    }

    $.each(add, function(name, prop) {
        if(hasSpecProps) {
            name = prop.name;
            prop = prop.val;
        }
        if($.isFunction(prop) &&
           (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {

            var baseMethod = base[name] || function() {};
            result[name] = function() {
                var baseSaved = this.__base;
                this.__base = baseMethod;
                var result = prop.apply(this, arguments);
                this.__base = baseSaved;
                return result;
            };

        }
        else {
            result[name] = prop;
        }

    });

}

$.inherit = function() {

    var args = arguments,
        hasBase = $.isFunction(args[0]),
        base = hasBase? args[0] : emptyBase,
        props = args[hasBase? 1 : 0] || {},
        staticProps = args[hasBase? 2 : 1],
        result = props.__constructor || (hasBase && base.prototype.__constructor)?
            function() {
                return this.__constructor.apply(this, arguments);
            } : function() {};

    if(!hasBase) {
        result.prototype = props;
        result.prototype.__self = result.prototype.constructor = result;
        return $.extend(result, staticProps);
    }

    $.extend(result, base);

    var basePtp = base.prototype,
        resultPtp = result.prototype = objCreate(basePtp);

    resultPtp.__self = resultPtp.constructor = result;

    override(basePtp, resultPtp, props);
    staticProps && override(base, result, staticProps);

    return result;

};

$.inheritSelf = function(base, props, staticProps) {

    var basePtp = base.prototype;

    override(basePtp, basePtp, props);
    staticProps && override(base, base, staticProps);

    return base;

};

})(jQuery);

/* ../../libs/bem-bl/blocks-common/i-jquery/__inherit/i-jquery__inherit.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__identify/i-jquery__identify.js begin */
/**
 * Identify plugin
 *
 * @version 1.0.0
 */

(function($) {

var counter = 0,
    expando = '__' + (+new Date),
    get = function() {
        return 'uniq' + ++counter;
    };

/**
 * Makes unique ID
 * @param {Object} [obj] Object that needs to be identified
 * @param {Boolean} [onlyGet=false] Return a unique value only if it had already been assigned before
 * @returns {String} ID
 */
$.identify = function(obj, onlyGet) {

    if(!obj) return get();

    var key = 'uniqueID' in obj? 'uniqueID' : expando; // Use when possible. native uniqueID for elements in IE

    return onlyGet || key in obj?
        obj[key] :
        obj[key] = get();

};

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__identify/i-jquery__identify.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__is-empty-object/i-jquery__is-empty-object.js begin */
(function($) {

$.isEmptyObject || ($.isEmptyObject = function(obj) {
        for(var i in obj) return false;
        return true;
    });

})(jQuery);

/* ../../libs/bem-bl/blocks-common/i-jquery/__is-empty-object/i-jquery__is-empty-object.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__debounce/i-jquery__debounce.js begin */
/**
 * Debounce and throttle function's decorator plugin 1.0.6
 *
 * Copyright (c) 2009 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

$.extend({

    debounce : function(fn, timeout, invokeAsap, ctx) {

        if(arguments.length == 3 && typeof invokeAsap != 'boolean') {
            ctx = invokeAsap;
            invokeAsap = false;
        }

        var timer;

        return function() {

            var args = arguments;
            ctx = ctx || this;

            invokeAsap && !timer && fn.apply(ctx, args);

            clearTimeout(timer);

            timer = setTimeout(function() {
                invokeAsap || fn.apply(ctx, args);
                timer = null;
            }, timeout);

        };

    },

    throttle : function(fn, timeout, ctx) {

        var timer, args, needInvoke;

        return function() {

            args = arguments;
            needInvoke = true;
            ctx = ctx || this;

            timer || (function() {
                if(needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(arguments.callee, timeout);
                }
                else {
                    timer = null;
                }
            })();

        };

    }

});

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__debounce/i-jquery__debounce.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__observable/i-jquery__observable.js begin */
/**
 * Observable plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 * @requires $.identify
 * @requires $.inherit
 */

(function($) {

var storageExpando = '__' + (+new Date) + 'storage',
    getFnId = function(fn, ctx) {
        return $.identify(fn) + (ctx? $.identify(ctx) : '');
    },
    Observable = /** @lends $.observable.prototype */{

        /**
         * Builds full event name
         * @protected
         * @param {String} e Event type
         * @returns {String}
         */
        buildEventName : function(e) {

            return e;

        },

        /**
         * Adding event handler
         * @param {String} e Event type
         * @param {Object} [data] Additional data that the handler gets as e.data
         * @param {Function} fn Handler
         * @param {Object} [ctx] Handler context
         * @returns {$.observable}
         */
        on : function(e, data, fn, ctx, _special) {

            if(typeof e == 'string') {
                if($.isFunction(data)) {
                    ctx = fn;
                    fn = data;
                    data = undefined;
                }

                var id = getFnId(fn, ctx),
                    storage = this[storageExpando] || (this[storageExpando] = {}),
                    eList = e.split(' '),
                    i = 0,
                    eStorage;

                while(e = eList[i++]) {
                    e = this.buildEventName(e);
                    eStorage = storage[e] || (storage[e] = { ids : {}, list : {} });

                    if(!(id in eStorage.ids)) {
                        var list = eStorage.list,
                            item = { fn : fn, data : data, ctx : ctx, special : _special };
                        if(list.last) {
                            list.last.next = item;
                            item.prev = list.last;
                        } else {
                            list.first = item;
                        }

                        eStorage.ids[id] = list.last = item;
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.on(e, fn, data, _special);
                });
            }

            return this;

        },

        onFirst : function(e, data, fn, ctx) {

            return this.on(e, data, fn, ctx, { one : true });

        },

        /**
         * Removing event handler(s)
         * @param {String} [e] Event type
         * @param {Function} [fn] Handler
         * @param {Object} [ctx] Handler context
         * @returns {$.observable}
         */
        un : function(e, fn, ctx) {

            if(typeof e == 'string' || typeof e == 'undefined') {
                var storage = this[storageExpando];
                if(storage) {
                    if(e) { // if event type was passed
                        var eList = e.split(' '),
                            i = 0,
                            eStorage;
                        while(e = eList[i++]) {
                            e = this.buildEventName(e);
                            if(eStorage = storage[e]) {
                                if(fn) {  // if specific handler was passed
                                    var id = getFnId(fn, ctx),
                                        ids = eStorage.ids;
                                    if(id in ids) {
                                        var list = eStorage.list,
                                            item = ids[id],
                                            prev = item.prev,
                                            next = item.next;

                                        if(prev) {
                                            prev.next = next;
                                        }
                                        else if(item === list.first) {
                                            list.first = next;
                                        }

                                        if(next) {
                                            next.prev = prev;
                                        }
                                        else if(item === list.last) {
                                            list.last = prev;
                                        }

                                        delete ids[id];
                                    }
                                } else {
                                    delete this[storageExpando][e];
                                }
                            }
                        }
                    } else {
                        delete this[storageExpando];
                    }
                }
            } else {
                var _this = this;
                $.each(e, function(e, fn) {
                    _this.un(e, fn, ctx);
                });
            }

            return this;

        },

        /**
         * Fires event handlers
         * @param {String|$.Event} e Event
         * @param {Object} [data] Additional data
         * @returns {$.observable}
         */
        trigger : function(e, data) {

            var _this = this,
                storage = _this[storageExpando],
                rawType;

            typeof e === 'string'?
                e = $.Event(_this.buildEventName(rawType = e)) :
                e.type = _this.buildEventName(rawType = e.type);

            e.target || (e.target = _this);

            if(storage && (storage = storage[e.type])) {
                var item = storage.list.first,
                    ret;
                while(item) {
                    e.data = item.data;
                    ret = item.fn.call(item.ctx || _this, e, data);
                    if(typeof ret !== 'undefined') {
                        e.result = ret;
                        if(ret === false) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }

                    item.special && item.special.one &&
                        _this.un(rawType, item.fn, item.ctx);
                    item = item.next;
                }
            }

            return this;

        }

    };

$.observable = $.inherit(Observable, Observable);

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__observable/i-jquery__observable.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/i-bem.js begin */
/** @requires jquery.inherit */
/** @requires jquery.isEmptyObject */
/** @requires jquery.identify */
/** @requires jquery.observable */

(function($, undefined) {

/**
 * Storage for deferred functions
 * @private
 * @type Array
 */
var afterCurrentEventFns = [],

/**
 * Storage for block declarations (hash by block name)
 * @private
 * @type Object
 */
    blocks = {},

/**
 * Communication channels
 * @static
 * @private
 * @type Object
 */
    channels = {};

/**
 * Builds the name of the handler method for setting a modifier
 * @static
 * @private
 * @param {String} elemName Element name
 * @param {String} modName Modifier name
 * @param {String} modVal Modifier value
 * @returns {String}
 */
function buildModFnName(elemName, modName, modVal) {

    return (elemName? '__elem_' + elemName : '') +
           '__mod' +
           (modName? '_' + modName : '') +
           (modVal? '_' + modVal : '');

}

/**
 * Transforms a hash of modifier handlers to methods
 * @static
 * @private
 * @param {Object} modFns
 * @param {Object} props
 * @param {String} [elemName]
 */
function modFnsToProps(modFns, props, elemName) {

    $.isFunction(modFns)?
        (props[buildModFnName(elemName, '*', '*')] = modFns) :
        $.each(modFns, function(modName, modFn) {
            $.isFunction(modFn)?
                (props[buildModFnName(elemName, modName, '*')] = modFn) :
                $.each(modFn, function(modVal, modFn) {
                    props[buildModFnName(elemName, modName, modVal)] = modFn;
                });
        });

}

function buildCheckMod(modName, modVal) {

    return modVal?
        Array.isArray(modVal)?
            function(block) {
                var i = 0, len = modVal.length;
                while(i < len)
                    if(block.hasMod(modName, modVal[i++]))
                        return true;
                return false;
            } :
            function(block) {
                return block.hasMod(modName, modVal);
            } :
        function(block) {
            return block.hasMod(modName);
        };

}

/** @namespace */
this.BEM = $.inherit($.observable, /** @lends BEM.prototype */ {

    /**
     * @class Base block for creating BEM blocks
     * @constructs
     * @private
     * @param {Object} mods Block modifiers
     * @param {Object} params Block parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(mods, params, initImmediately) {

        var _this = this;

        /**
         * Cache of block modifiers
         * @private
         * @type Object
         */
        _this._modCache = mods || {};

        /**
         * Current modifiers in the stack
         * @private
         * @type Object
         */
        _this._processingMods = {};

        /**
         * The block's parameters, taking into account the defaults
         * @protected
         * @type Object
         */
        _this._params = params; // это нужно для правильной сборки параметров у блока из нескольких нод
        _this.params = null;

        initImmediately !== false?
            _this._init() :
            _this.afterCurrentEvent(function() {
                _this._init();
            });

    },

    /**
     * Initializes the block
     * @private
     */
    _init : function() {

        if(!this._initing && !this.hasMod('js', 'inited')) {
            this._initing = true;

            if(!this.params) {
                this.params = $.extend(this.getDefaultParams(), this._params);
                delete this._params;
            }

            this.setMod('js', 'inited');
            delete this._initing;
            this.hasMod('js', 'inited') && this.trigger('init');
        }

        return this;

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx=this] Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Executes the function in the context of the block, after the "current event"
     * @protected
     * @param {Function} fn
     * @param {Object} [ctx] Context
     */
    afterCurrentEvent : function(fn, ctx) {

        this.__self.afterCurrentEvent(this.changeThis(fn, ctx));

    },

    /**
     * Executes the block's event handlers and live event handlers
     * @protected
     * @param {String} e Event name
     * @param {Object} [data] Additional information
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .__self.trigger(e, data);

        return this;

    },

    buildEvent : function(e) {

        typeof e == 'string' && (e = $.Event(e));
        e.block = this;

        return e;

    },

    /**
     * Checks whether a block or nested element has a modifier
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {Boolean}
     */
    hasMod : function(elem, modName, modVal) {

        var len = arguments.length,
            invert = false;

        if(len == 1) {
            modVal = '';
            modName = elem;
            elem = undefined;
            invert = true;
        }
        else if(len == 2) {
            if(typeof elem == 'string') {
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
            else {
                modVal = '';
                invert = true;
            }
        }

        var res = this.getMod(elem, modName) === modVal;
        return invert? !res : res;

    },

    /**
     * Returns the value of the modifier of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {String} Modifier value
     */
    getMod : function(elem, modName) {

        var type = typeof elem;
        if(type === 'string' || type === 'undefined') { // elem either omitted or undefined
            modName = elem || modName;
            var modCache = this._modCache;
            return modName in modCache?
                modCache[modName] :
                modCache[modName] = this._extractModVal(modName);
        }

        return this._getElemMod(modName, elem);

    },

    /**
     * Returns the value of the modifier of the nested element
     * @private
     * @param {String} modName Modifier name
     * @param {Object} elem Nested element
     * @param {Object} [elem] Nested element name
     * @returns {String} Modifier value
     */
    _getElemMod : function(modName, elem, elemName) {

        return this._extractModVal(modName, elem, elemName);

    },

    /**
     * Returns values of modifiers of the block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} [modName1, ..., modNameN] Modifier names
     * @returns {Object} Hash of modifier values
     */
    getMods : function(elem) {

        var hasElem = elem && typeof elem != 'string',
            _this = this,
            modNames = [].slice.call(arguments, hasElem? 1 : 0),
            res = _this._extractMods(modNames, hasElem? elem : undefined);

        if(!hasElem) { // caching
            modNames.length?
                modNames.forEach(function(name) {
                    _this._modCache[name] = res[name];
                }):
                _this._modCache = res;
        }

        return res;

    },

    /**
     * Sets the modifier for a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(typeof modVal == 'undefined') {
            modVal = modName;
            modName = elem;
            elem = undefined;
        }

        var _this = this;

        if(!elem || elem[0]) {

            var modId = (elem && elem[0]? $.identify(elem[0]) : '') + '_' + modName;

            if(this._processingMods[modId]) return _this;

            var elemName,
                curModVal = elem?
                    _this._getElemMod(modName, elem, elemName = _this.__self._extractElemNameFrom(elem)) :
                    _this.getMod(modName);

            if(curModVal === modVal) return _this;

            this._processingMods[modId] = true;

            var needSetMod = true,
                modFnParams = [modName, modVal, curModVal];

            elem && modFnParams.unshift(elem);

            [['*', '*'], [modName, '*'], [modName, modVal]].forEach(function(mod) {
                needSetMod = _this._callModFn(elemName, mod[0], mod[1], modFnParams) !== false && needSetMod;
            });

            !elem && needSetMod && (_this._modCache[modName] = modVal);

            needSetMod && _this._afterSetMod(modName, modVal, curModVal, elem, elemName);

            delete this._processingMods[modId];
        }

        return _this;

    },

    /**
     * Function after successfully changing the modifier of the block/nested element
     * @protected
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {String} oldModVal Old modifier value
     * @param {Object} [elem] Nested element
     * @param {String} [elemName] Element name
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {},

    /**
     * Sets a modifier for a block/nested element, depending on conditions.
     * If the condition parameter is passed: when true, modVal1 is set; when false, modVal2 is set.
     * If the condition parameter is not passed: modVal1 is set if modVal2 was set, or vice versa.
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal1 First modifier value
     * @param {String} [modVal2] Second modifier value
     * @param {Boolean} [condition] Condition
     * @returns {BEM}
     */
    toggleMod : function(elem, modName, modVal1, modVal2, condition) {

        if(typeof elem == 'string') { // if this is a block
            condition = modVal2;
            modVal2 = modVal1;
            modVal1 = modName;
            modName = elem;
            elem = undefined;
        }
        if(typeof modVal2 == 'undefined') {
            modVal2 = '';
        } else if(typeof modVal2 == 'boolean') {
            condition = modVal2;
            modVal2 = '';
        }

        var modVal = this.getMod(elem, modName);
        (modVal == modVal1 || modVal == modVal2) &&
            this.setMod(
                elem,
                modName,
                typeof condition === 'boolean'?
                    (condition? modVal1 : modVal2) :
                    this.hasMod(elem, modName, modVal1)? modVal2 : modVal1);

        return this;

    },

    /**
     * Removes a modifier from a block/nested element
     * @protected
     * @param {Object} [elem] Nested element
     * @param {String} modName Modifier name
     * @returns {BEM}
     */
    delMod : function(elem, modName) {

        if(!modName) {
            modName = elem;
            elem = undefined;
        }

        return this.setMod(elem, modName, '');

    },

    /**
     * Executes handlers for setting modifiers
     * @private
     * @param {String} elemName Element name
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {Array} modFnParams Handler parameters
     */
    _callModFn : function(elemName, modName, modVal, modFnParams) {

        var modFnName = buildModFnName(elemName, modName, modVal);
        return this[modFnName]?
           this[modFnName].apply(this, modFnParams) :
           undefined;

    },

    /**
     * Retrieves the value of the modifier
     * @private
     * @param {String} modName Modifier name
     * @param {Object} [elem] Element
     * @returns {String} Modifier value
     */
    _extractModVal : function(modName, elem) {

        return '';

    },

    /**
     * Retrieves name/value for a list of modifiers
     * @private
     * @param {Array} modNames Names of modifiers
     * @param {Object} [elem] Element
     * @returns {Object} Hash of modifier values by name
     */
    _extractMods : function(modNames, elem) {

        return {};

    },

    /**
     * Returns a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        return this.__self.channel(id, drop);

    },

    /**
     * Returns a block's default parameters
     * @returns {Object}
     */
    getDefaultParams : function() {

        return {};

    },

    /**
     * Helper for cleaning up block properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var args = [].slice.call(arguments);
        typeof obj == 'string' && args.unshift(this);
        this.__self.del.apply(this.__self, args);
        return this;

	},

    /**
     * Deletes a block
     */
    destruct : function() {}

}, /** @lends BEM */{

    _name : 'i-bem',

    /**
     * Storage for block declarations (hash by block name)
     * @static
     * @protected
     * @type Object
     */
    blocks : blocks,

    /**
     * Declares blocks and creates a block class
     * @static
     * @protected
     * @param {String|Object} decl Block name (simple syntax) or description
     * @param {String} decl.block|decl.name Block name
     * @param {String} [decl.baseBlock] Name of the parent block
     * @param {String} [decl.modName] Modifier name
     * @param {String} [decl.modVal] Modifier value
     * @param {Object} [props] Methods
     * @param {Object} [staticProps] Static methods
     */
    decl : function(decl, props, staticProps) {

        if(typeof decl == 'string')
            decl = { block : decl };
        else if(decl.name) {
            decl.block = decl.name;
        }

        if(decl.baseBlock && !blocks[decl.baseBlock])
            throw('baseBlock "' + decl.baseBlock + '" for "' + decl.block + '" is undefined');

        props || (props = {});

        if(props.onSetMod) {
            modFnsToProps(props.onSetMod, props);
            delete props.onSetMod;
        }

        if(props.onElemSetMod) {
            $.each(props.onElemSetMod, function(elemName, modFns) {
                modFnsToProps(modFns, props, elemName);
            });
            delete props.onElemSetMod;
        }

        var baseBlock = blocks[decl.baseBlock || decl.block] || this;

        if(decl.modName) {
            var checkMod = buildCheckMod(decl.modName, decl.modVal);
            $.each(props, function(name, prop) {
                $.isFunction(prop) &&
                    (props[name] = function() {
                        var method;
                        if(checkMod(this)) {
                            method = prop;
                        } else {
                            var baseMethod = baseBlock.prototype[name];
                            baseMethod && baseMethod !== props[name] &&
                                (method = this.__base);
                        }
                        return method?
                            method.apply(this, arguments) :
                            undefined;
                    });
            });
        }

        if(staticProps && typeof staticProps.live === 'boolean') {
            var live = staticProps.live;
            staticProps.live = function() {
                return live;
            };
        }

        var block;
        decl.block == baseBlock._name?
            // makes a new "live" if the old one was already executed
            (block = $.inheritSelf(baseBlock, props, staticProps))._processLive(true) :
            (block = blocks[decl.block] = $.inherit(baseBlock, props, staticProps))._name = decl.block;

        return block;

    },

    /**
     * Processes a block's live properties
     * @private
     * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
     * @returns {Boolean} Whether the block is a live block
     */
    _processLive : function(heedLive) {

        return false;

    },

    /**
     * Factory method for creating an instance of the block named
     * @static
     * @param {String|Object} block Block name or description
     * @param {Object} [params] Block parameters
     * @returns {BEM}
     */
    create : function(block, params) {

        typeof block == 'string' && (block = { block : block });

        return new blocks[block.block](block.mods, params);

    },

    /**
     * Returns the name of the current block
     * @static
     * @protected
     * @returns {String}
     */
    getName : function() {

        return this._name;

    },

    /**
     * Retrieves the name of an element nested in a block
     * @static
     * @private
     * @param {Object} elem Nested element
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {},

    /**
     * Adds a function to the queue for executing after the "current event"
     * @static
     * @protected
     * @param {Function} fn
     * @param {Object} ctx
     */
    afterCurrentEvent : function(fn, ctx) {

        afterCurrentEventFns.push({ fn : fn, ctx : ctx }) == 1 &&
            setTimeout(this._runAfterCurrentEventFns, 0);

    },

    /**
     * Executes the queue
     * @private
     */
    _runAfterCurrentEventFns : function() {

        var fnsLen = afterCurrentEventFns.length;
        if(fnsLen) {
            var fnObj,
                fnsCopy = afterCurrentEventFns.splice(0, fnsLen);

            while(fnObj = fnsCopy.shift()) fnObj.fn.call(fnObj.ctx || this);
        }

    },

    /**
     * Changes the context of the function being passed
     * @protected
     * @param {Function} fn
     * @param {Object} ctx Context
     * @returns {Function} Function with a modified context
     */
    changeThis : function(fn, ctx) {

        return fn.bind(ctx || this);

    },

    /**
     * Helper for cleaning out properties
     * @param {Object} [obj=this]
     */
    del : function(obj) {

        var delInThis = typeof obj == 'string',
            i = delInThis? 0 : 1,
            len = arguments.length;
        delInThis && (obj = this);

        while(i < len) delete obj[arguments[i++]];

        return this;

	},

    /**
     * Returns/destroys a named communication channel
     * @param {String} [id='default'] Channel ID
     * @param {Boolean} [drop=false] Destroy the channel
     * @returns {$.observable|undefined} Communication channel
     */
    channel : function(id, drop) {

        if(typeof id == 'boolean') {
            drop = id;
            id = undefined;
        }

        id || (id = 'default');

        if(drop) {
            if(channels[id]) {
                channels[id].un();
                delete channels[id];
            }
            return;
        }

        return channels[id] || (channels[id] = new $.observable());

    }

});

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-bem/i-bem.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__object/i-ecma__object.js begin */
(function() {

/**
 * Возвращает массив свойств объекта
 * @param {Object} obj объект
 * @returns {Array}
 */
Object.keys || (Object.keys = function(obj) {
    var res = [];

    for(var i in obj) obj.hasOwnProperty(i) &&
        res.push(i);

    return res;
});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__object/i-ecma__object.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__array/i-ecma__array.js begin */
(function() {

var ptp = Array.prototype,
    toStr = Object.prototype.toString,
    methods = {

        /**
         * Finds the index of an element in an array
         * @param {Object} item
         * @param {Number} [fromIdx] Starting from index (length - 1 - fromIdx, if fromIdx < 0)
         * @returns {Number} Element index or -1, if not found
         */
        indexOf : function(item, fromIdx) {

            fromIdx = +(fromIdx || 0);

            var t = this, len = t.length;

            if(len > 0 && fromIdx < len) {
                fromIdx = fromIdx < 0? Math.ceil(fromIdx) : Math.floor(fromIdx);
                fromIdx < -len && (fromIdx = 0);
                fromIdx < 0 && (fromIdx = fromIdx + len);

                while(fromIdx < len) {
                    if(fromIdx in t && t[fromIdx] === item)
                        return fromIdx;
                    ++fromIdx;
                }
            }

            return -1;

        },

        /**
         * Calls the callback for each element
         * @param {Function} callback Called for each element
         * @param {Object} [ctx=null] Callback context
         */
        forEach : function(callback, ctx) {

            var i = -1, t = this, len = t.length;
            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

        },

        /**
         * Creates array B from array A so that B[i] = callback(A[i])
         * @param {Function} callback Called for each element
         * @param {Object} [ctx=null] Callback context
         * @returns {Array}
         */
        map : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = new Array(len);

            while(++i < len) i in t &&
                (res[i] = ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t));

            return res;

        },

        /**
         * Creates an array containing only the elements from the source array that the callback returns true for. 
         * @param {Function} callback Called for each element
         * @param {Object} [ctx] Callback context
         * @returns {Array}
         */
        filter : function(callback, ctx) {

            var i = -1, t = this, len = t.length,
                res = [];

            while(++i < len) i in t &&
                (ctx? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)) && res.push(t[i]);

            return res;

        },

        /**
         * Wraps the array using an accumulator
         * @param {Function} callback Called for each element
         * @param {Object} [initialVal] Initial value of the accumulator
         * @returns {Object} Accumulator
         */
        reduce : function(callback, initialVal) {

            var i = -1, t = this, len = t.length,
                res;

            if(arguments.length < 2) {
                while(++i < len) {
                    if(i in t) {
                        res = t[i];
                        break;
                    }
                }
            }
            else {
                res = initialVal;
            }

            while(++i < len) i in t &&
                (res = callback(res, t[i], i, t));

            return res;

        },

        /**
         * Checks whether at least one element in the array meets the condition in the callback
         * @param {Function} callback
         * @param {Object} [ctx=this] Callback context
         * @returns {Boolean}
         */
        some : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && (ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return true;

            return false;

        },

        /**
         * Checks whether every element in the array meets the condition in the callback
         * @param {Function} callback
         * @param {Object} [ctx=this] Context of the callback call
         * @returns {Boolean}
         */
        every : function(callback, ctx) {

            var i = -1, t = this, len = t.length;

            while(++i < len)
                if(i in t && !(ctx ? callback.call(ctx, t[i], i, t) : callback(t[i], i, t)))
                    return false;

            return true;

        }

    };

for(var name in methods)
    ptp[name] || (ptp[name] = methods[name]);

Array.isArray || (Array.isArray = function(obj) {
    return toStr.call(obj) === '[object Array]';
});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__array/i-ecma__array.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__function/i-ecma__function.js begin */
(function() {

var slice = Array.prototype.slice;

Function.prototype.bind || (Function.prototype.bind = function(ctx) {

    var fn = this,
        args = slice.call(arguments, 1);

    return function () {
        return fn.apply(ctx, args.concat(slice.call(arguments)));
    }

});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__function/i-ecma__function.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/__internal/i-bem__internal.js begin */
/** @fileOverview Module for internal BEM helpers */
/** @requires BEM */

(function(BEM, $, undefined) {

/**
 * Separator for modifiers and their values
 * @const
 * @type String
 */
var MOD_DELIM = '_',

/**
 * Separator between names of a block and a nested element
 * @const
 * @type String
 */
    ELEM_DELIM = '__',

/**
 * Pattern for acceptable element and modifier names
 * @const
 * @type String
 */
    NAME_PATTERN = '[a-zA-Z0-9-]+';

function buildModPostfix(modName, modVal, buffer) {

    buffer.push(MOD_DELIM, modName, MOD_DELIM, modVal);

}

function buildBlockClass(name, modName, modVal, buffer) {

    buffer.push(name);
    modVal && buildModPostfix(modName, modVal, buffer);

}

function buildElemClass(block, name, modName, modVal, buffer) {

    buildBlockClass(block, undefined, undefined, buffer);
    buffer.push(ELEM_DELIM, name);
    modVal && buildModPostfix(modName, modVal, buffer);

}

BEM.INTERNAL = {

    NAME_PATTERN : NAME_PATTERN,

    MOD_DELIM : MOD_DELIM,
    ELEM_DELIM : ELEM_DELIM,

    buildModPostfix : function(modName, modVal, buffer) {

        var res = buffer || [];
        buildModPostfix(modName, modVal, res);
        return buffer? res : res.join('');

    },

    /**
     * Builds the class of a block or element with a modifier
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClass : function(block, elem, modName, modVal, buffer) {

        var typeOf = typeof modName;
        if(typeOf == 'string') {
            if(typeof modVal != 'string' && typeof modVal != 'number') {
                buffer = modVal;
                modVal = modName;
                modName = elem;
                elem = undefined;
            }
        } else if(typeOf != 'undefined') {
            buffer = modName;
            modName = undefined;
        } else if(elem && typeof elem != 'string') {
            buffer = elem;
            elem = undefined;
        }

        if(!(elem || modName || buffer)) { // оптимизация для самого простого случая
            return block;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, modName, modVal, res) :
            buildBlockClass(block, modName, modVal, res);

        return buffer? res : res.join('');

    },

    /**
     * Builds full classes for a buffer or element with modifiers
     * @private
     * @param {String} block Block name
     * @param {String} [elem] Element name
     * @param {Object} [mods] Modifiers
     * @param {Array} [buffer] Buffer
     * @returns {String|Array} Class or buffer string (depending on whether the buffer parameter is present)
     */
    buildClasses : function(block, elem, mods, buffer) {

        if(elem && typeof elem != 'string') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }

        var res = buffer || [];

        elem?
            buildElemClass(block, elem, undefined, undefined, res) :
            buildBlockClass(block, undefined, undefined, res);

        mods && $.each(mods, function(modName, modVal) {
            if(modVal) {
                res.push(' ');
                elem?
                    buildElemClass(block, elem, modName, modVal, res) :
                    buildBlockClass(block, modName, modVal, res);
            }
        });

        return buffer? res : res.join('');

        /*var typeOf = typeof elem;
        if(typeOf != 'string' && typeOf != 'undefined') {
            buffer = mods;
            mods = elem;
            elem = undefined;
        }
        if($.isArray(mods)) {
            buffer = mods;
            mods = undefined;
        }

        var res = buffer || [];
        buildClasses(block, elem, mods, res);
        return buffer? res : res.join('');*/

    }

}

})(BEM, jQuery);
/* ../../libs/bem-bl/blocks-common/i-bem/__internal/i-bem__internal.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/__dom/i-bem__dom.js begin */
/** @requires BEM */
/** @requires BEM.INTERNAL */

(function(BEM, $, undefined) {

var win = $(window),
    doc = $(document),

/**
 * Storage for DOM elements by unique key
 * @private
 * @type Object
 */
    uniqIdToDomElems = {},

/**
 * Storage for blocks by unique key
 * @static
 * @private
 * @type Object
 */
    uniqIdToBlock = {},

/**
 * Storage for block parameters
 * @private
 * @type Object
 */
    domElemToParams = {},

/**
 * Storage for liveCtx event handlers
 * @private
 * @type Object
 */
    liveEventCtxStorage = {},

/**
 * Storage for liveClass event handlers
 * @private
 * @type Object
 */
    liveClassEventStorage = {},

    blocks = BEM.blocks,

    INTERNAL = BEM.INTERNAL,

    NAME_PATTERN = INTERNAL.NAME_PATTERN,

    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM,

    buildModPostfix = INTERNAL.buildModPostfix,
    buildClass = INTERNAL.buildClass;

/**
 * Initializes blocks on a DOM element
 * @private
 * @param {jQuery} domElem DOM element
 * @param {String} uniqInitId ID of the "initialization wave"
 */
function init(domElem, uniqInitId) {

    var domNode = domElem[0];
    $.each(getParams(domNode), function(blockName, params) {
        processParams(params, domNode, blockName, uniqInitId);
        var block = uniqIdToBlock[params.uniqId];
        if(block) {
            if(block.domElem.index(domNode) < 0) {
                block.domElem = block.domElem.add(domElem);
                $.extend(block._params, params);
            }
        } else {
            initBlock(blockName, domElem, params);
        }
    });

}

/**
 * Initializes a specific block on a DOM element, or returns the existing block if it was already created
 * @private
 * @param {String} blockName Block name
 * @param {jQuery} domElem DOM element
 * @param {Object} [params] Initialization parameters
 * @param {Boolean} [forceLive] Force live initialization
 * @param {Function} [callback] Handler to call after complete initialization
 */
function initBlock(blockName, domElem, params, forceLive, callback) {

    if(typeof params == 'boolean') {
        callback = forceLive;
        forceLive = params;
        params = undefined;
    }

    var domNode = domElem[0];
    params = processParams(params || getParams(domNode)[blockName], domNode, blockName);

    var uniqId = params.uniqId;
    if(uniqIdToBlock[uniqId]) {
        return uniqIdToBlock[uniqId]._init();
    }

    uniqIdToDomElems[uniqId] = uniqIdToDomElems[uniqId]?
        uniqIdToDomElems[uniqId].add(domElem) :
        domElem;

    var parentDomNode = domNode.parentNode;
    if(!parentDomNode || parentDomNode.nodeType === 11) { // jquery doesn't unique disconnected node
        $.unique(uniqIdToDomElems[uniqId]);
    }

    var blockClass = blocks[blockName] || DOM.decl(blockName, {}, { live : true });
    if(!(blockClass._liveInitable = !!blockClass._processLive()) || forceLive || params.live === false) {
        var block = new blockClass(uniqIdToDomElems[uniqId], params, !!forceLive);
        delete uniqIdToDomElems[uniqId];
        callback && callback.apply(block, Array.prototype.slice.call(arguments, 4));
        return block;
    }

}

/**
 * Processes and adds necessary block parameters
 * @private
 * @param {Object} params Initialization parameters
 * @param {HTMLElement} domNode DOM node
 * @param {String} blockName Block name
 * @param {String} [uniqInitId] ID of the "initialization wave"
 */
function processParams(params, domNode, blockName, uniqInitId) {

    (params || (params = {})).uniqId ||
        (params.uniqId = (params.id? blockName + '-id-' + params.id : $.identify()) + (uniqInitId || $.identify()));

    var domUniqId = $.identify(domNode),
        domParams = domElemToParams[domUniqId] || (domElemToParams[domUniqId] = {});

    domParams[blockName] || (domParams[blockName] = params);

    return params;

}

/**
 * Helper for searching for a DOM element using a selector inside the context, including the context itself
 * @private
 * @param {jQuery} ctx Context
 * @param {String} selector CSS selector
 * @param {Boolean} [excludeSelf=false] Exclude context from search
 * @returns {jQuery}
 */
function findDomElem(ctx, selector, excludeSelf) {

    var res = ctx.find(selector);
    return excludeSelf?
       res :
       res.add(ctx.filter(selector));

}

/**
 * Returns parameters of a block's DOM element
 * @private
 * @param {HTMLElement} domNode DOM node
 * @returns {Object}
 */
function getParams(domNode) {

    var uniqId = $.identify(domNode);
    return domElemToParams[uniqId] ||
           (domElemToParams[uniqId] = extractParams(domNode));

}

/**
 * Retrieves block parameters from a DOM element
 * @private
 * @param {HTMLElement} domNode DOM node
 * @returns {Object}
 */
function extractParams(domNode) {

    var fn = domNode.onclick || domNode.ondblclick;
    if(!fn && domNode.tagName.toLowerCase() == 'body') { // LEGO-2027 in FF onclick doesn't work on body
        var elem = $(domNode),
            attr = elem.attr('onclick') || elem.attr('ondblclick');
        attr && (fn = Function(attr));
    }
    return fn? fn() : {};

}

/**
 * Cleans up all the BEM storages associated with a DOM node
 * @private
 * @param {HTMLElement} domNode DOM node
 */
function cleanupDomNode(domNode) {

    delete domElemToParams[$.identify(domNode)];
    domNode.onclick = null;

}

/**
 * Uncople DOM node from the block. If this is the last node, then destroys the block.
 * @private
 * @param {BEM.DOM} block block
 * @param {HTMLElement} domNode DOM node
 */
function removeDomNodeFromBlock(block, domNode) {

    block.domElem.length === 1?
        block.destruct(true) :
        block.domElem = block.domElem.not(domNode);

}

/**
 * Returns a DOM node for calculating the window size in IE
 * @returns {HTMLElement}
 */
function getClientNode() {

    return doc[0][$.support.boxModel? 'documentElement' : 'body'];

}

/**
 * Returns a block on a DOM element and initializes it if necessary
 * @param {String} blockName Block name
 * @param {Object} params Block parameters
 * @returns {BEM}
 */
$.fn.bem = function(blockName, params) {
    return initBlock(blockName, this, params, true);
};

/**
 * @namespace
 * @name BEM.DOM
 */
var DOM = BEM.DOM = BEM.decl('i-bem__dom',/** @lends BEM.DOM.prototype */{
    /**
     * @class Base block for creating BEM blocks that have DOM representation
     * @constructs
     * @private
     * @param {jQuery} domElem DOM element that the block is created on
     * @param {Object} params Block parameters
     * @param {Boolean} [initImmediately=true]
     */
    __constructor : function(domElem, params, initImmediately) {

        var _this = this;

        /**
         * Block's DOM elements
         * @protected
         * @type jQuery
         */
        _this.domElem = domElem;

        /**
         * Cache for names of events on DOM elements
         * @private
         * @type Object
         */
        _this._eventNameCache = {};

        /**
         * Cache for elements
         * @private
         * @type Object
         */
        _this._elemCache = {};

        /**
         * Unique block ID
         * @private
         * @type String
         */
        uniqIdToBlock[_this._uniqId = params.uniqId || $.identify(_this)] = _this;

        /**
         * Flag for whether it's necessary to unbind from the document and window when destroying the block
         * @private
         * @type Boolean
         */
        _this._needSpecialUnbind = false;

        _this.__base(null, params, initImmediately);

    },

    /**
     * Finds blocks inside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM[]}
     */
    findBlocksInside : function(elem, block) {

        return this._findBlocks('find', elem, block);

    },

    /**
     * Finds the first block inside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM}
     */
    findBlockInside : function(elem, block) {

        return this._findBlocks('find', elem, block, true);

    },

    /**
     * Finds blocks outside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM[]}
     */
    findBlocksOutside : function(elem, block) {

        return this._findBlocks('parents', elem, block);

    },

    /**
     * Finds the first block outside the current block or its elements (including context)
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM}
     */
    findBlockOutside : function(elem, block) {

        return this._findBlocks('closest', elem, block)[0] || null;

    },

    /**
     * Finds blocks on DOM elements of the current block or its elements
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM[]}
     */
    findBlocksOn : function(elem, block) {

        return this._findBlocks('', elem, block);

    },

    /**
     * Finds the first block on DOM elements of the current block or its elements
     * @protected
     * @param {String|jQuery} [elem] Block element
     * @param {String|Object} block Name or description (block,modName,modVal) of the block to find
     * @returns {BEM}
     */
    findBlockOn : function(elem, block) {

        return this._findBlocks('', elem, block, true);

    },

    _findBlocks : function(select, elem, block, onlyFirst) {

        if(!block) {
            block = elem;
            elem = undefined;
        }

        var ctxElem = elem?
                (typeof elem == 'string'? this.findElem(elem) : elem) :
                this.domElem,
            isSimpleBlock = typeof block == 'string',
            blockName = isSimpleBlock? block : (block.block || block.blockName),
            selector = '.' +
                (isSimpleBlock?
                    buildClass(blockName) :
                    buildClass(blockName, block.modName, block.modVal)) +
                (onlyFirst? ':first' : ''),
            domElems = ctxElem.filter(selector);

        select && (domElems = domElems.add(ctxElem[select](selector)));

        if(onlyFirst) {
            return domElems[0]? initBlock(blockName, domElems.eq(0), true) : null;
        }

        var res = [],
            uniqIds = {};

        $.each(domElems, function(i, domElem) {
            var block = initBlock(blockName, $(domElem), true);
            if(!uniqIds[block._uniqId]) {
                uniqIds[block._uniqId] = true;
                res.push(block);
            }
        });

        return res;

    },

    /**
     * Adds an event handler for any DOM element
     * @protected
     * @param {jQuery} domElem DOM element where the event will be listened for
     * @param {String|Object} event Event name or event object
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindToDomElem : function(domElem, event, fn) {

        var _this = this;

        fn?
            domElem.bind(
                _this._buildEventName(event),
                function(e) {
                    (e.data || (e.data = {})).domElem = $(this);
                    return fn.apply(_this, arguments);
                }
            ) :
            $.each(event, function(event, fn) {
                _this.bindToDomElem(domElem, event, fn);
            });

        return _this;

    },

    /**
     * Adds an event handler to the document
     * @protected
     * @param {String} event Event name
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindToDoc : function(event, fn) {

        this._needSpecialUnbind = true;
        return this.bindToDomElem(doc, event, fn);

    },

    /**
     * Adds an event handler to the window
     * @protected
     * @param {String} event Event name
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindToWin : function(event, fn) {

        var _fn = fn,
            currentHeight,
            currentWidth;

        if (event === 'resize') {

            fn = function() {

                var height = win.height(),
                    width = win.width();

                if (currentHeight !== height || currentWidth !== width) {

                    currentHeight = height;
                    currentWidth = width;

                    _fn.apply(this, arguments);

                }


            }

        }

        this._needSpecialUnbind = true;
        return this.bindToDomElem(win, event, fn);

    },

    /**
     * Adds an event handler to the block's main DOM elements or its nested elements
     * @protected
     * @param {jQuery|String} [elem] Element
     * @param {String} event Event name
     * @param {Function} fn Handler function, which will be executed in the block's context
     * @returns {BEM}
     */
    bindTo : function(elem, event, fn) {

        if(!event || $.isFunction(event)) { // if there is no element
            fn = event;
            event = elem;
            elem = this.domElem;
        } else if(typeof elem == 'string') {
            elem = this.elem(elem);
        }

        return this.bindToDomElem(elem, event, fn);

    },

    /**
     * Removes event handlers from any DOM element
     * @protected
     * @param {jQuery} domElem DOM element where the event was being listened for
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFromDomElem : function(domElem, event) {

        domElem.unbind(this._buildEventName(event));
        return this;

    },

    /**
     * Removes event handler from document
     * @protected
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFromDoc : function(event) {

        return this.unbindFromDomElem(doc, event);

    },

    /**
     * Removes event handler from window
     * @protected
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFromWin : function(event) {

        return this.unbindFromDomElem(win, event);

    },

    /**
     * Removes event handlers from the block's main DOM elements or its nested elements
     * @protected
     * @param {jQuery|String} [elem] Nested element
     * @param {String} event Event name
     * @returns {BEM}
     */
    unbindFrom : function(elem, event) {

        if(!event) {
            event = elem;
            elem = this.domElem;
        } else if(typeof elem == 'string') {
            elem = this.elem(elem);
        }

        return this.unbindFromDomElem(elem, event);

    },

    /**
     * Builds a full name for an event
     * @private
     * @param {String} event Event name
     * @returns {String}
     */
    _buildEventName : function(event) {

        var _this = this;
        return event.indexOf(' ') > 1?
            event.split(' ').map(function(e) {
                return _this._buildOneEventName(e);
            }).join(' ') :
            _this._buildOneEventName(event);

    },

    /**
     * Builds a full name for a single event
     * @private
     * @param {String} event Event name
     * @returns {String}
     */
    _buildOneEventName : function(event) {

        var _this = this,
            eventNameCache = _this._eventNameCache;

        if(event in eventNameCache) return eventNameCache[event];

        var uniq = '.' + _this._uniqId;

        if(event.indexOf('.') < 0) return eventNameCache[event] = event + uniq;

        var lego = '.bem_' + _this.__self._name;

        return eventNameCache[event] = event.split('.').map(function(e, i) {
            return i == 0? e + lego : lego + '_' + e;
        }).join('') + uniq;

    },

    /**
     * Triggers block event handlers and live event handlers
     * @protected
     * @param {String} e Event name
     * @param {Object} [data] Additional information
     * @returns {BEM}
     */
    trigger : function(e, data) {

        this
            .__base(e = this.buildEvent(e), data)
            .domElem && this._ctxTrigger(e, data);

        return this;

    },

    _ctxTrigger : function(e, data) {

        var _this = this,
            storage = liveEventCtxStorage[_this.__self._buildCtxEventName(e.type)],
            ctxIds = {};

        storage && _this.domElem.each(function() {
            var ctx = this,
                counter = storage.counter;
            while(ctx && counter) {
                var ctxId = $.identify(ctx, true);
                if(ctxId) {
                    if(ctxIds[ctxId]) break;
                    var storageCtx = storage.ctxs[ctxId];
                    if(storageCtx) {
                        $.each(storageCtx, function(uniqId, handler) {
                            handler.fn.call(
                                handler.ctx || _this,
                                e,
                                data);
                        });
                        counter--;
                    }
                    ctxIds[ctxId] = true;
                }
                ctx = ctx.parentNode;
            }
        });

    },

    /**
     * Sets a modifier for a block/nested element
     * @protected
     * @param {jQuery} [elem] Nested element
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @returns {BEM}
     */
    setMod : function(elem, modName, modVal) {

        if(elem && typeof modVal != 'undefined' && elem.length > 1) {
            var _this = this;
            elem.each(function() {
                var item = $(this);
                item.__bemElemName = elem.__bemElemName;
                _this.setMod(item, modName, modVal);
            });
            return _this;
        }
        return this.__base(elem, modName, modVal);

    },

    /**
     * Retrieves modifier value from the DOM node's CSS class
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery} [elem] Nested element
     * @param {String} [elemName] Name of the nested element
     * @returns {String} Modifier value
     */
    _extractModVal : function(modName, elem, elemName) {

        var domNode = (elem || this.domElem)[0],
            matches;

        domNode &&
            (matches = domNode.className
                .match(this.__self._buildModValRE(modName, elemName || elem)));

        return matches? matches[2] : '';

    },

    /**
     * Retrieves a name/value list of modifiers
     * @private
     * @param {Array} [modNames] Names of modifiers
     * @param {Object} [elem] Element
     * @returns {Object} Hash of modifier values by names
     */
    _extractMods : function(modNames, elem) {

        var res = {},
            extractAll = !modNames.length,
            countMatched = 0;

        ((elem || this.domElem)[0].className
            .match(this.__self._buildModValRE(
                '(' + (extractAll? NAME_PATTERN : modNames.join('|')) + ')',
                elem,
                'g')) || []).forEach(function(className) {
                    var iModVal = (className = className.trim()).lastIndexOf(MOD_DELIM),
                        iModName = className.substr(0, iModVal - 1).lastIndexOf(MOD_DELIM);
                    res[className.substr(iModName + 1, iModVal - iModName - 1)] = className.substr(iModVal + 1);
                    ++countMatched;
                });

        // empty modifier values are not reflected in classes; they must be filled with empty values
        countMatched < modNames.length && modNames.forEach(function(modName) {
            modName in res || (res[modName] = '');
        });

        return res;

    },

    /**
     * Sets a modifier's CSS class for a block's DOM element or nested element
     * @private
     * @param {String} modName Modifier name
     * @param {String} modVal Modifier value
     * @param {String} oldModVal Old modifier value
     * @param {jQuery} [elem] Element
     * @param {String} [elemName] Element name
     */
    _afterSetMod : function(modName, modVal, oldModVal, elem, elemName) {

        var _self = this.__self,
            classPrefix = _self._buildModClassPrefix(modName, elemName),
            classRE = _self._buildModValRE(modName, elemName),
            needDel = modVal === '';

        (elem || this.domElem).each(function() {
            var className = this.className;
            className.indexOf(classPrefix) > -1?
                this.className = className.replace(
                    classRE,
                    (needDel? '' : '$1' + classPrefix + modVal)) :
                needDel || $(this).addClass(classPrefix + modVal);
        });

        elemName && this
            .dropElemCache(elemName, modName, oldModVal)
            .dropElemCache(elemName, modName, modVal);

    },

    /**
     * Finds elements nested in a block
     * @protected
     * @param {String|jQuery} [ctx=this.domElem] Element where search is being performed
     * @param {String} names Nested element name (or names separated by spaces)
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {jQuery} DOM elements
     */
    findElem : function(ctx, names, modName, modVal) {

        if(arguments.length % 2) { // if the number of arguments is one or three
            modVal = modName;
            modName = names;
            names = ctx;
            ctx = this.domElem;
        } else if(typeof ctx == 'string') {
            ctx = this.findElem(ctx);
        }

        var _self = this.__self,
            selector = '.' +
                names.split(' ').map(function(name) {
                    return buildClass(_self._name, name, modName, modVal);
                }).join(',.');
        return findDomElem(ctx, selector);

    },

    /**
     * Finds elements nested in a block
     * @protected
     * @param {String} name Nested element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {jQuery} DOM elements
     */
    _elem : function(name, modName, modVal) {

        var key = name + buildModPostfix(modName, modVal),
            res;

        if(!(res = this._elemCache[key])) {
            res = this._elemCache[key] = this.findElem(name, modName, modVal);
            res.__bemElemName = name;
        }

        return res;

    },

    /**
     * Lazy search for elements nested in a block (caches results)
     * @protected
     * @param {String} names Nested element name (or names separated by spaces)
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {jQuery} DOM elements
     */
    elem : function(names, modName, modVal) {

        if(modName && typeof modName != 'string') {
            modName.__bemElemName = names;
            return modName;
        }

        if(names.indexOf(' ') < 0) {
            return this._elem(names, modName, modVal);
        }

        var res = $([]),
            _this = this;
        names.split(' ').forEach(function(name) {
            res = res.add(_this._elem(name, modName, modVal));
        });
        return res;

    },

    /**
     * Clearing the cache for elements
     * @protected
     * @param {String} [names] Nested element name (or names separated by spaces)
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {BEM}
     */
    dropElemCache : function(names, modName, modVal) {

        if(names) {
            var _this = this,
                modPostfix = buildModPostfix(modName, modVal);
            names.indexOf(' ') < 0?
                delete _this._elemCache[names + modPostfix] :
                names.split(' ').forEach(function(name) {
                    delete _this._elemCache[name + modPostfix];
                });
        } else {
            this._elemCache = {};
        }

        return this;

    },

    /**
     * Retrieves parameters of a block element
     * @param {String|jQuery} elem Element
     * @returns {Object} Parameters
     */
    elemParams : function(elem) {

        var elemName;
        if(typeof elem ==  'string') {
            elemName = elem;
            elem = this.elem(elem);
        } else {
            elemName = this.__self._extractElemNameFrom(elem);
        }

        return extractParams(elem[0])[buildClass(this.__self.getName(), elemName)] || {};

    },

    /**
     * Elemify given element
     * @param {jQuery} elem Element
     * @param {String} elemName Name
     * @returns {jQuery}
     */
    elemify : function(elem, elemName) {
        (elem = $(elem)).__bemElemName = elemName;
        return elem;
    },

    /**
     * Checks whether a DOM element is in a block
     * @protected
     * @param {jQuery} domElem DOM element
     * @returns {Boolean}
     */
    containsDomElem : function(domElem) {

        var res = false;

        this.domElem.each(function() {
            return !(res = domElem.parents().andSelf().index(this) > -1);
        });

        return res;

    },

    /**
     * Builds a CSS selector corresponding to a block/element and modifier
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildSelector : function(elem, modName, modVal) {

        return this.__self.buildSelector(elem, modName, modVal);

    },

    /**
     * Deletes a block
     * @param {Boolean} [keepDOM=false] Whether to keep the block's DOM nodes in the document
     */
    destruct : function(keepDOM) {

        var _this = this,
            _self = _this.__self;

        _this._isDestructing = true;

        _this._needSpecialUnbind && _self.doc.add(_self.win).unbind('.' + _this._uniqId);

        _this.dropElemCache().domElem.each(function(i, domNode) {
            var params = getParams(domNode);
            $.each(params, function(blockName, blockParams) {
                var block = uniqIdToBlock[blockParams.uniqId];
                block?
                    block._isDestructing || removeDomNodeFromBlock(block, domNode) :
                    delete uniqIdToDomElems[blockParams.uniqId];
            });
            cleanupDomNode(domNode);
        });

        keepDOM || _this.domElem.remove();

        delete uniqIdToBlock[_this.un()._uniqId];
        delete _this.domElem;
        delete _this._elemCache;

        _this.__base();

    }

}, /** @lends BEM.DOM */{

    /**
     * Scope
     * Will be set on onDomReady to tag `body`
     * @protected
     * @type jQuery
     */
    scope : null,

    /**
     * Document shortcut
     * @protected
     * @type jQuery
     */
    doc : doc,

    /**
     * Window shortcut
     * @protected
     * @type jQuery
     */
    win : win,

    /**
     * Processes a block's live properties
     * @private
     * @param {Boolean} [heedLive=false] Whether to take into account that the block already processed its live properties
     * @returns {Boolean} Whether the block is a live block
     */
    _processLive : function(heedLive) {

        var _this = this,
            res = _this._liveInitable;

        if('live' in _this) {
            var noLive = typeof res == 'undefined';

            if(noLive ^ heedLive) {
                res = _this.live() !== false;
                _this.live = function() {};
            }
        }

        return res;

    },

    /**
     * Initializes blocks on a fragment of the DOM tree
     * @static
     * @protected
     * @param {jQuery} [ctx=document] Root DOM node
     * @returns {jQuery} ctx Initialization context
     */
    init : function(ctx, callback, callbackCtx) {

        if(!ctx || $.isFunction(ctx)) {
            callbackCtx = callback;
            callback = ctx;
            ctx = doc;
        }

        var uniqInitId = $.identify();
        findDomElem(ctx, '.i-bem').each(function() {
            init($(this), uniqInitId);
        });

        callback && this.afterCurrentEvent(
            function() {
                callback.call(callbackCtx || this, ctx);
            });

        // makes initialization completely synchronous
        this._runAfterCurrentEventFns();

        return ctx;

    },

    /**
     * Destroys blocks on a fragment of the DOM tree
     * @static
     * @protected
     * @param {Boolean} [keepDOM=false] Whether to keep DOM nodes in the document
     * @param {jQuery} ctx Root DOM node
     * @param {Boolean} [excludeSelf=false] Exclude the context
     */
    destruct : function(keepDOM, ctx, excludeSelf) {

        if(typeof keepDOM != 'boolean') {
            excludeSelf = ctx;
            ctx = keepDOM;
            keepDOM = undefined;
        }

        findDomElem(ctx, '.i-bem', excludeSelf).each(function(i, domNode) {
            var params = getParams(this);
            $.each(params, function(blockName, blockParams) {
                if(blockParams.uniqId) {
                    var block = uniqIdToBlock[blockParams.uniqId];
                    block?
                        removeDomNodeFromBlock(block, domNode) :
                        delete uniqIdToDomElems[blockParams.uniqId];
                }
            });
            cleanupDomNode(this);
        });
        keepDOM || (excludeSelf? ctx.empty() : ctx.remove());

    },

    /**
     * Replaces a fragment of the DOM tree inside the context, destroying old blocks and intializing new ones
     * @static
     * @protected
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content New content
     * @param {Function} [callback] Handler to be called after initialization
     * @param {Object} [callbackCtx] Handler's context
     */
    update : function(ctx, content, callback, callbackCtx) {

        this.destruct(ctx, true);
        this.init(ctx.html(content), callback, callbackCtx);

    },

    /**
     * Changes a fragment of the DOM tree including the context and initializes blocks.
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     */
    replace : function(ctx, content) {

        this.destruct(true, ctx);
        this.init($(content).replaceAll(ctx));

    },

    /**
     * Adds a fragment of the DOM tree at the end of the context and initializes blocks
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     */
    append : function(ctx, content) {

        this.init($(content).appendTo(ctx));

    },

    /**
     * Adds a fragment of the DOM tree at the beginning of the context and initializes blocks
     * @param {jQuery} ctx Root DOM node
     * @param {jQuery|String} content Content to be added
     */
    prepend : function(ctx, content) {

        this.init($(content).prependTo(ctx));

    },

    /**
     * Adds a fragment of the DOM tree before the context and initializes blocks
     * @param {jQuery} ctx Contextual DOM node
     * @param {jQuery|String} content Content to be added
     */
    before : function(ctx, content) {

        this.init($(content).insertBefore(ctx));

    },

    /**
     * Adds a fragment of the DOM tree after the context and initializes blocks
     * @param {jQuery} ctx Contextual DOM node
     * @param {jQuery|String} content Content to be added
     */
    after : function(ctx, content) {

        this.init($(content).insertAfter(ctx));

    },

    /**
     * Builds a full name for a live event
     * @static
     * @private
     * @param {String} e Event name
     * @returns {String}
     */
    _buildCtxEventName : function(e) {

        return this._name + ':' + e;

    },

    _liveClassBind : function(className, e, callback, invokeOnInit) {

        var _this = this;
        if(e.indexOf(' ') > -1) {
            e.split(' ').forEach(function(e) {
                _this._liveClassBind(className, e, callback, invokeOnInit);
            });
        }
        else {
            var storage = liveClassEventStorage[e],
                uniqId = $.identify(callback);

            if(!storage) {
                storage = liveClassEventStorage[e] = {};
                doc.bind(e, _this.changeThis(_this._liveClassTrigger, _this));
            }

            storage = storage[className] || (storage[className] = { uniqIds : {}, fns : [] });

            if(!(uniqId in storage.uniqIds)) {
                storage.fns.push({ uniqId : uniqId, fn : _this._buildLiveEventFn(callback, invokeOnInit) });
                storage.uniqIds[uniqId] = storage.fns.length - 1;
            }
        }

        return this;

    },

    _liveClassUnbind : function(className, e, callback) {

        var storage = liveClassEventStorage[e];
        if(storage) {
            if(callback) {
                if(storage = storage[className]) {
                    var uniqId = $.identify(callback);
                    if(uniqId in storage.uniqIds) {
                        var i = storage.uniqIds[uniqId],
                            len = storage.fns.length - 1;
                        storage.fns.splice(i, 1);
                        while(i < len) storage.uniqIds[storage.fns[i++].uniqId] = i - 1;
                        delete storage.uniqIds[uniqId];
                    }
                }
            } else {
                delete storage[className];
            }
        }

        return this;

    },

    _liveClassTrigger : function(e) {

        var storage = liveClassEventStorage[e.type];
        if(storage) {
            var node = e.target, classNames = [];
            for(var className in storage) storage.hasOwnProperty(className) && classNames.push(className);
            do {
                var nodeClassName = ' ' + node.className + ' ', i = 0;
                while(className = classNames[i++]) {
                    if(nodeClassName.indexOf(' ' + className + ' ') > -1) {
                        var j = 0, fns = storage[className].fns, fn, stopPropagationAndPreventDefault = false;
                        while(fn = fns[j++])
                            if(fn.fn.call($(node), e) === false) stopPropagationAndPreventDefault = true;

                        stopPropagationAndPreventDefault && e.preventDefault();
                        if(stopPropagationAndPreventDefault || e.isPropagationStopped()) return;

                        classNames.splice(--i, 1);
                    }
                }
            } while(classNames.length && (node = node.parentNode));
        }

    },

    _buildLiveEventFn : function(callback, invokeOnInit) {

        var _this = this;
        return function(e) {
            var args = [
                    _this._name,
                    ((e.data || (e.data = {})).domElem = $(this)).closest(_this.buildSelector()),
                    true ],
                block = initBlock.apply(null, invokeOnInit? args.concat([callback, e]) : args);

            if(block && !invokeOnInit && callback)
                return callback.apply(block, arguments);
        };

    },

    /**
     * Helper for live initialization for an event on DOM elements of a block or its elements
     * @static
     * @protected
     * @param {String} [elemName] Element name or names (separated by spaces)
     * @param {String} event Event name
     * @param {Function} [callback] Handler to call after successful initialization
     */
    liveInitOnEvent : function(elemName, event, callback) {

        return this.liveBindTo(elemName, event, callback, true);

    },

    /**
     * Helper for subscribing to live events on DOM elements of a block or its elements
     * @static
     * @protected
     * @param {String|Object} [to] Description (object with modName, modVal, elem) or name of the element or elements (space-separated)
     * @param {String} event Event name
     * @param {Function} [callback] Handler
     */
    liveBindTo : function(to, event, callback, invokeOnInit) {

        if(!event || $.isFunction(event)) {
            callback = event;
            event = to;
            to = undefined;
        }

        if(!to || typeof to == 'string') {
            to = { elem : to };
        }

        to.elemName && (to.elem = to.elemName);

        var _this = this;

        if(to.elem && to.elem.indexOf(' ') > 0) {
            to.elem.split(' ').forEach(function(elem) {
                _this._liveClassBind(
                    buildClass(_this._name, elem, to.modName, to.modVal),
                    event,
                    callback,
                    invokeOnInit);
            });
            return _this;
        }

        return _this._liveClassBind(
            buildClass(_this._name, to.elem, to.modName, to.modVal),
            event,
            callback,
            invokeOnInit);

    },

    /**
     * Helper for unsubscribing from live events on DOM elements of a block or its elements
     * @static
     * @protected
     * @param {String} [elem] Name of the element or elements (space-separated)
     * @param {String} event Event name
     * @param {Function} [callback] Handler
     */
    liveUnbindFrom : function(elem, event, callback) {

        var _this = this;

        if(elem.indexOf(' ') > 1) {
            elem.split(' ').forEach(function(elem) {
                _this._liveClassUnbind(
                    buildClass(_this._name, elem),
                    event,
                    callback);
            });
            return _this;
        }

        return _this._liveClassUnbind(
            buildClass(_this._name, elem),
            event,
            callback);

    },

    /**
     * Helper for live initialization when a different block is initialized
     * @static
     * @private
     * @param {String} event Event name
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new block's context
     * @param {String} findFnName Name of the method for searching
     */
    _liveInitOnBlockEvent : function(event, blockName, callback, findFnName) {

        var name = this._name;
        blocks[blockName].on(event, function(e) {
            if(!e.block.domElem) return; // if block was destructed at that moment

            var args = arguments,
                blocks = e.block[findFnName](name);

            callback && blocks.forEach(function(block) {
                callback.apply(block, args);
            });
        });
        return this;

    },

    /**
     * Helper for live initialization for a different block's event on the current block's DOM element
     * @static
     * @protected
     * @param {String} event Event name
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockEvent : function(event, blockName, callback) {

        return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOn');

    },

    /**
     * Helper for live initialization for a different block's event inside the current block
     * @static
     * @protected
     * @param {String} event Event name
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} [callback] Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockInsideEvent : function(event, blockName, callback) {

        return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksOutside');

    },

    /**
     * Helper for live initialization when a different block is initialized on a DOM element of the current block
     * @deprecated - use liveInitOnBlockEvent
     * @static
     * @protected
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} callback Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockInit : function(blockName, callback) {

        return this.liveInitOnBlockEvent('init', blockName, callback);

    },

    /**
     * Helper for live initialization when a different block is initialized inside the current block
     * @deprecated - use liveInitOnBlockInsideEvent
     * @static
     * @protected
     * @param {String} blockName Name of the block that should trigger a reaction when initialized
     * @param {Function} [callback] Handler to be called after successful initialization in the new block's context
     */
    liveInitOnBlockInsideInit : function(blockName, callback) {

        return this.liveInitOnBlockInsideEvent('init', blockName, callback);

    },

    /**
     * Adds a live event handler to a block, based on a specified element where the event will be listened for
     * @static
     * @protected
     * @param {jQuery} [ctx] The element in which the event will be listened for
     * @param {String} e Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler's context
     */
    on : function(ctx, e, data, fn, fnCtx) {

        return ctx.jquery?
            this._liveCtxBind(ctx, e, data, fn, fnCtx) :
            this.__base(ctx, e, data, fn);

    },

    /**
     * Removes the live event handler from a block, based on a specified element where the event was being listened for
     * @static
     * @protected
     * @param {jQuery} [ctx] The element in which the event was being listened for
     * @param {String} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     */
    un : function(ctx, e, fn, fnCtx) {

        return ctx.jquery?
            this._liveCtxUnbind(ctx, e, fn, fnCtx) :
            this.__base(ctx, e, fn);

    },

    /**
     * Adds a live event handler to a block, based on a specified element where the event will be listened for
     * @deprecated Use on
     * @static
     * @protected
     * @param {jQuery} ctx The element in which the event will be listened for
     * @param {String} e Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler context
     */
    liveCtxBind : function(ctx, e, data, fn, fnCtx) {

        return this._liveCtxBind(ctx, e, data, fn, fnCtx);

    },

    /**
     * Adds a live event handler to a block, based on a specified element where the event will be listened for
     * @static
     * @private
     * @param {jQuery} ctx The element in which the event will be listened for
     * @param {String} e  Event name
     * @param {Object} [data] Additional information that the handler gets as e.data
     * @param {Function} fn Handler
     * @param {Object} [fnCtx] Handler context
     */
    _liveCtxBind : function(ctx, e, data, fn, fnCtx) {

        var _this = this;

        if(typeof e == 'string') {
            if($.isFunction(data)) {
                fnCtx = fn;
                fn = data;
                data = undefined;
            }

            if(e.indexOf(' ') > -1) {
                e.split(' ').forEach(function(e) {
                    _this._liveCtxBind(ctx, e, data, fn, fnCtx);
                });
            } else {
                var ctxE = _this._buildCtxEventName(e),
                    storage = liveEventCtxStorage[ctxE] ||
                        (liveEventCtxStorage[ctxE] = { counter : 0, ctxs : {} });

                ctx.each(function() {
                    var ctxId = $.identify(this),
                        ctxStorage = storage.ctxs[ctxId];
                    if(!ctxStorage) {
                        ctxStorage = storage.ctxs[ctxId] = {};
                        ++storage.counter;
                    }
                    ctxStorage[$.identify(fn) + (fnCtx? $.identify(fnCtx) : '')] = {
                        fn   : fn,
                        data : data,
                        ctx  : fnCtx
                    };
                });
            }
        } else {
            $.each(e, function(e, fn) {
                _this._liveCtxBind(ctx, e, fn, data);
            });
        }

        return _this;

    },

    /**
     * Removes a live event handler from a block, based on a specified element where the event was being listened for
     * @deprecated Use on
     * @static
     * @protected
     * @param {jQuery} ctx The element in which the event was being listened for
     * @param {String} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     */
    liveCtxUnbind : function(ctx, e, fn, fnCtx) {

        return this._liveCtxUnbind(ctx, e, fn, fnCtx);

    },

    /**
     * Removes a live event handler from a block, based on a specified element where the event was being listened for
     * @static
     * @private
     * @param {jQuery} ctx The element in which the event was being listened for
     * @param {String} e Event name
     * @param {Function} [fn] Handler
     * @param {Object} [fnCtx] Handler context
     */
    _liveCtxUnbind : function(ctx, e, fn, fnCtx) {

        var _this = this,
            storage = liveEventCtxStorage[e =_this._buildCtxEventName(e)];

        if(storage) {
            ctx.each(function() {
                var ctxId = $.identify(this, true),
                    ctxStorage;
                if(ctxId && (ctxStorage = storage.ctxs[ctxId])) {
                    fn && delete ctxStorage[$.identify(fn) + (fnCtx? $.identify(fnCtx) : '')];
                    if(!fn || $.isEmptyObject(ctxStorage)) {
                        storage.counter--;
                        delete storage.ctxs[ctxId];
                    }
                }
            });
            storage.counter || delete liveEventCtxStorage[e];
        }

        return _this;

    },

    /**
     * Retrieves the name of an element nested in a block
     * @static
     * @private
     * @param {jQuery} elem Nested element
     * @returns {String|undefined}
     */
    _extractElemNameFrom : function(elem) {

        if(elem.__bemElemName) return elem.__bemElemName;

        var matches = elem[0].className.match(this._buildElemNameRE());
        return matches? matches[1] : undefined;

    },

    /**
     * Retrieves block parameters from a DOM element
     * @static
     * @param {HTMLElement} domNode DOM node
     * @returns {Object}
     */
    extractParams : extractParams,

    /**
     * Builds a prefix for the CSS class of a DOM element or nested element of the block, based on modifier name
     * @static
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery|String} [elem] Element
     * @returns {String}
     */
    _buildModClassPrefix : function(modName, elem) {

        return buildClass(this._name) +
               (elem?
                   ELEM_DELIM + (typeof elem === 'string'? elem : this._extractElemNameFrom(elem)) :
                   '') +
               MOD_DELIM + modName + MOD_DELIM;

    },

    /**
     * Builds a regular expression for extracting modifier values from a DOM element or nested element of a block
     * @static
     * @private
     * @param {String} modName Modifier name
     * @param {jQuery|String} [elem] Element
     * @param {String} [quantifiers] Regular expression quantifiers
     * @returns {RegExp}
     */
    _buildModValRE : function(modName, elem, quantifiers) {

        return new RegExp('(\\s|^)' + this._buildModClassPrefix(modName, elem) + '(' + NAME_PATTERN + ')(?=\\s|$)', quantifiers);

    },

    /**
     * Builds a regular expression for extracting names of elements nested in a block
     * @static
     * @private
     * @returns {RegExp}
     */
    _buildElemNameRE : function() {

        return new RegExp(this._name + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');

    },

    /**
     * Builds a CSS selector corresponding to the block/element and modifier
     * @param {String} [elem] Element name
     * @param {String} [modName] Modifier name
     * @param {String} [modVal] Modifier value
     * @returns {String}
     */
    buildSelector : function(elem, modName, modVal) {

        return '.' + buildClass(this._name, elem, modName, modVal);

    },

    /**
     * Returns a block instance by unique ID
     * @deprecated
     * @param {String} [uniqId]
     * @returns {BEM.DOM}
     */
    getBlockByUniqId : function(uniqId) {

        return uniqIdToBlock[uniqId];

    },

    /**
     * Returns the size of the current window
     * @returns {Object} Object with width and height fields
     */
    getWindowSize : function() {

        return {
            width  : win.width(),
            height : win.height()
        };

    }

});

/**
 * Set default scope after DOM ready
 */
$(function() {
    BEM.DOM.scope = $('body');
});

})(BEM, jQuery);

/* ../../libs/bem-bl/blocks-common/i-bem/__dom/i-bem__dom.js end */
;
/* ../../libs/bem-bl/blocks-common/i-ecma/__string/i-ecma__string.js begin */
(function() {

String.prototype.trim || (String.prototype.trim = function () {

    var str = this.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;

    while(ws.test(str.charAt(--i)));

    return str.slice(0, i + 1);

});

})();
/* ../../libs/bem-bl/blocks-common/i-ecma/__string/i-ecma__string.js end */
;
/* ../../libs/bem-bl/blocks-common/i-bem/__dom/_init/i-bem__dom_init_auto.js begin */
/* дефолтная инициализация */
$(function() {
    BEM.DOM.init();
});
/* ../../libs/bem-bl/blocks-common/i-bem/__dom/_init/i-bem__dom_init_auto.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/i-model.js begin */
;(function(BEM, $, undefined) {

    var changesTimeout = 500,
        CHILD_SEPARATOR = '.',
        ID_SEPARATOR = ':',
        MODELS_SEPARATOR = ',',
        ANY_ID = '*',
        modelsGroupsCache = {};

    /**
     * @namespace
     * @name BEM.MODEL
     */
    var MODEL = BEM.MODEL = $.inherit($.observable, {

        /**
         * Минимальное время между событиями на модели
         */
        changesTimeout: changesTimeout,

        /**
         * @class Конструктор модели
         * @constructs
         * @param {String|Object} modelParams параметры модели
         * @param {String} modelParams.name имя модели
         * @param {String|Number} [modelParams.id] идентификатор модели
         * @param {String} [modelParams.parentName] имя родительской модели
         * @param {String} [modelParams.parentPath] путь родительской модели
         * @param {Object} [modelParams.parentModel] экземпляр родительской модели
         * @param {Object} [data] данные для инициализации полей модели
         * @returns {BEM.MODEL}
         * @private
         */
        __constructor: function(modelParams, data) {
            this.name = modelParams.name;
            this.id = modelParams.id;
            this._path = MODEL.buildPath(modelParams);
            this.changed = [];

            /**
             * Генерирует событие change на модели
             * @type {*}
             */
            this.fireChange = $.throttle(this._fireChange, this.changesTimeout, this);

            /**
             * Debounce триггер на модели
             * @type {*}
             */
            this.debounceTrigger = $.debounce(function(name, data) {
                this.trigger(name, data);
            }, this.changesTimeout, false, this);

            this._initFields(data || {});

            return this;
        },

        /**
         * Возвращает путь модели
         * @returns {String}
         */
        path: function() {
            return this._path;
        },

        /**
         * Инициализирует поля модели
         * @param {Object} data данные для инициализации полей модели
         * @returns {BEM.MODEL}
         * @private
         */
        _initFields: function(data) {
            var name = this.name,
                decl = MODEL.decls[name],
                _this = this;

            this.fieldsDecl = decl;
            this.fields = {};

            this
                .on('field-init', function(e, data) {
                    if (!this.fieldsDecl[data.field].calculate)
                        return _this._calcDependsTo(data.field, data);
                })
                .on('field-change', function(e, data) {
                    return _this._onFieldChange(data.field, data);
                });

            $.each(this.fieldsDecl, function(name, props) {
                _this.fields[name] = MODEL.FIELD.create(name, props, _this);
            });

            data && $.each(this.fields, function(name, field) {
                var fieldDecl = _this.fieldsDecl[name];

                data && !fieldDecl.calculate &&
                    field.initData(data[name] != undefined ? data[name] : fieldDecl.value);
            });

            this.trigger('init');

            return this;
        },

        /**
         * Вычиляет заначения зависимых полей
         * @param {String} name имя поля
         * @param {Object} opts дополнительные парметры доступные в обработчиках событий
         * @returns {BEM.MODEL}
         * @private
         */
        _calcDependsTo: function(name, opts) {
            var fieldsDecl = this.fieldsDecl[name],
                _this = this;

            fieldsDecl && fieldsDecl.dependsTo && $.each(fieldsDecl.dependsTo, function(i, childName) {
                var fieldDecl = _this.fieldsDecl[childName],
                    field = _this.fields[childName],
                    val;

                if (field && fieldDecl.calculate && fieldDecl.dependsFrom) {
                    val = fieldDecl.dependsFrom.length > 1 ? fieldDecl.dependsFrom.reduce(function(res, name) {
                        res[name] = _this.fields[name].get();

                        return res;
                    }, {}) : _this.fields[fieldDecl.dependsFrom[0] || fieldDecl.dependsFrom].get();

                    _this.set(childName, fieldDecl.calculate.call(_this, val), opts);
                }

            });

            return this;
        },

        /**
         * Возвращает значение поля
         * @param {String} name
         * @param {String} [type] формат предтавления значения. по умолчанию вызывается get, либо raw/formatted
         * @returns {*}
         */
        get: function(name, type) {
            if (!type) type = 'get';

            var fieldDecl = this.fieldsDecl[name],
                method = {
                    raw: 'raw',
                    format: 'format',
                    formatted: 'format',
                    get: 'get'
                }[type];

            if (this.hasField(name) && method) {
                if (fieldDecl.calculate && !fieldDecl.dependsFrom)
                    return fieldDecl.calculate.call(this);

                return this.fields[name][method]();
            }
        },

        /**
         * Задает значение полю модели
         * @param {String} name имя поля
         * @param {*} value значение
         * @param {Object} [opts] дополнительные парметры доступные в обработчиках событий change
         * @returns {BEM.MODEL}
         */
        set: function(name, value, opts) {
            var field = this.fields[name],
                fieldsScheme = this.fieldsDecl[name];

            opts = $.extend({}, opts, { value: value });

            if (!field || !fieldsScheme) return this;

            if (!field.isEqual(value)) {
                field.set(value, opts);
            }

            return this;
        },

        /**
         * Очищает поля модели
         * @param {String} [name] имя поля
         * @param {Object} [opts] дополнительные парметры доступные в обработчиках событий change
         * @returns {BEM.MODEL}
         */
        clear: function(name, opts) {
            if (typeof name === 'string') {
                this.fields[name].clear(opts);
            } else {
                opts = name;

                $.each(this.fields, function(fieldName, field) {
                    if (field.getType() !== 'id' && !this.fieldsDecl[fieldName].calculate)
                        field.clear(opts);
                }.bind(this));
            }

            this.trigger('clear', opts);

            return this;
        },

        /**
         * Задает поля модели по данным из объекта, генерирует событие update на модели
         * @param {Object} data данные устанавливаемые в модели
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL}
         */
        update: function(data, opts) {
            var _this = this;

            $.each(data, function(name, val) {
                _this.set(name, val, opts);
            });

            this.trigger('update', opts);

            return this;
        },

        /**
         * Проверяет наличие поля у модели
         * @param {String} name имя поля
         * @returns {boolean}
         */
        hasField: function(name) {
            return !!this.fields[name];
        },

        /**
         * Проверяет поле или всю модель на пустоту
         * @param {String} [name]
         */
        isEmpty: function(name) {
            if (name) {
                return this.fields[name].isEmpty();
            } else {
                var isEmpty = true;
                $.each(this.fields, function(fieldName, field) {
                    isEmpty &= field.isEmpty();
                });

                return !!isEmpty;
            }
        },

        /**
         * Проверяет, изменилось ли значение поля или любого из полей с момента последней фиксации
         * @param {String} [name] имя поля
         * @returns {Boolean}
         */
        isChanged: function(name) {
            if (name) {
                return this.fields[name].isChanged();
            } else {
                var isChanged = false;
                $.each(this.fields, function(fieldName, field) {
                    isChanged |= field.isChanged();
                });

                return !!isChanged;
            }
        },

        /**
         * Возвращает тип поля
         * @param {String} name имя поля
         * @returns {String}
         */
        getType: function(name) {
            if (this.hasField(name))
                return this.fields[name].getType();
        },

        /**
         * Кеширует значения полей модели, генерирует событие fix на модели
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL}
         */
        fix: function(opts) {
            $.each(this.fields, function(fieldName, field) {
                field.fixData(opts);
            });

            this.trigger('fix', opts);

            return this;
        },

        /**
         * Восстанавливает значения полей модели из кеша, генерирует событие update на модели
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL}
         */
        rollback: function(opts) {
            $.each(this.fields, function(fieldName, field) {
                field.rollback(opts);
            });

            this.trigger('rollback', opts);

            return this;
        },

        /**
         * Возвращает объект с данными модели
         * @returns {Object}
         */
        toJSON: function() {
            var res = {},
                _this = this;

            $.each(this.fields, function(fieldName, field) {
                if (!_this.fieldsDecl[fieldName].internal)
                    res[fieldName] = field.toJSON();
            });

            return res;
        },

        /**
         * Назначает обработчик события на модель или поле модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Object} [data] дополнительные данные события
         * @param {Function} fn обработчик события
         * @param {Object} ctx контекст вызова обработчика
         * @returns {BEM.MODEL}
         */
        on: function(field, e, data, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = data;
                data = e;
                e = field;
                field = undefined;
            }
            
            !field ?
                this.__base(e, data, fn, ctx) :
                field.split(' ').forEach(function(name) {
                    this.fields[name].on(e, data, fn, ctx);
                }, this);

            return this;
        },

        /**
         * Удаляет обработчик события с модели или поля модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Function} fn обработчик события
         * @param {Object} ctx контекст вызова обработчика
         * @returns {BEM.MODEL}
         */
        un: function(field, e, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = e;
                e = field;
                field = undefined;
            }

            !field ?
                this.__base(e, fn, ctx) :
                field.split(' ').forEach(function(name) {
                    this.fields[name].un(e, fn, ctx);
                }, this);

            return this;
        },

        /**
         * Тригерит обработчик события на модели или поле модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param [data] данные доступные в обработчике события
         * @returns {BEM.MODEL}
         */
        trigger: function(field, e, data) {
            if (!(typeof field == 'string' && typeof e == 'string')) {
                data = e;
                e = field;
                field = undefined;
            }

            !field ?
                this.__base(e, data) :
                field.split(' ').forEach(function(name) {
                    this.fields[name].trigger(e, data);
                }, this);

            return this;
        },

        /**
         * Тригерит (с декоратором $.throttle) событие change на модели при изменении полей
         * @param {String} name имя поля
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL}
         * @private
         */
        _onFieldChange: function(name, opts) {
            if (this.changed.indexOf(name) == -1) this.changed.push(name);
            this.fieldsDecl[name].calculate || this._calcDependsTo(name, opts);
            this.fireChange(opts);

            return this;
        },

        /**
         * Сгенерировать событие change на модели
         * @param {Object} opts
         * @private
         */
        _fireChange: function(opts) {
            this.trigger('change', opts);
            this.changed = [];
        },

        /**
         * Удаляет модель из хранилища
         */
        destruct: function() {
            this.__self.destruct(this);
        },

        /**
         * Возвращает результат проверки модели на валидность
         * @returns {boolean}
         */
        isValid: function() {
            return !!this.validate().valid;
        },

        /**
         * Проверяет модель на валидность, генерирует событие error с описанием ошибки(ок)
         * @param {String} [name] - имя поля
         * @returns {Object}
         */
        validate: function(name) {
            var _this = this,
                res = {},
                validateRes;

            if (name) {
                validateRes = this.fields[name].validate();
                if (validateRes !== true) {
                    res.errorFields = [name];
                    res.errors = validateRes.invalidRules;
                }
            } else {
                $.each(this.fieldsDecl, function(name) {
                    validateRes = _this.fields[name].validate();
                    if (validateRes !== true) {
                        (res.errorFields || (res.errorFields = [])).push(name);
                        res.errors = (res.errors || []).concat(validateRes.invalidRules);
                        (res.errorsData || (res.errorsData = {}))[name] = validateRes.invalidRules;
                    }
                });
            }

            if (!res.errors)
                res.valid = true;
            else
                this.trigger('error', res);

            return res;
        }

    }, /** @lends BEM.MODEL */ {

        /**
         * Харанилище экземпляров моделей
         */
        models: {},

        /**
         * Хранилище деклараций
         */
        decls: {},

        /**
         * Хранилища обработчиков событий на моделях и полях
         */
        modelsTriggers: {},
        fieldsTriggers: {},

        /**
         * Декларирует описание модели
         * @static
         * @protected
         * @param {String|Object} decl
         * @param {String} decl.model|decl.name
         * @param {String} [decl.baseModel]
         * @param {{
         *     XXX: {String|Number},
         *     XXX: {
         *         {String} [type] тип поля
         *         {Boolean} [internal] внутреннее поле
         *         {*|Function} [default] дефолтное значение
         *         {*|Function} [value] начанольное значение
         *         {Object|Function} [validation] ф-ия конструктор объекта валидации или он сам
         *         {Function} [format] ф-ия форматирования
         *         {Function} [preprocess] ф-ия вызываемая до записи значения
         *         {Function} [calculate] ф-ия вычисления значения, вызывается, если изменилось одно из связанных полей
         *         {String|Array} [dependsFrom] массив от которых зависит значение поля
         *     }
         * }} fields где ключ имя поля, значение строка с типом или объект вида
         */
        decl: function(decl, fields) {
            if (typeof decl == 'string') {
                decl = { model: decl };
            } else if (decl.name) {
                decl.model = decl.name;
            }

            $.each(fields, function(name, props) {
                if (typeof props == 'string')
                    fields[name] = { type: props };
            });

            if (decl.baseModel) {
                if (!MODEL.models[decl.baseModel])
                    throw('baseModel "' + decl.baseModel + '" for "' + decl.model + '" is undefined');

                fields = $.extend(true, {}, MODEL.decls[decl.baseModel], fields);
            }

            MODEL.models[decl.model] = {};
            MODEL.decls[decl.model] = fields;

            MODEL._buildDeps(fields, decl.model);

            // todo: реализовать возможность задавать статические свойства модели

            return this;
        },

        /**
         * Устанавливает связи между зависимыми полями
         * @param {Object} fieldDecl декларация полей
         * @param {String} modelName имя модели
         * @private
         */
        _buildDeps: function(fieldDecl, modelName) {
            var fieldNames = Object.keys(fieldDecl),
                deps = {};

            function pushDeps(fields, toPushDeps) {
                fields.forEach(function(field) {
                    if (!fieldDecl[field])
                        throw Error('in model "' + modelName + '" depended field "' + field +'" is not declared');
                    if (toPushDeps.indexOf(field) !== -1)
                        throw Error('in model "' + modelName + '" circle fields dependence: ' +
                            toPushDeps.concat(field).join(' -> '));

                    var fieldDeps = (deps[field] || (deps[field] = []));

                    fieldDeps.push.apply(fieldDeps, toPushDeps.filter(function(name) {
                        return fieldDeps.indexOf(name) === -1
                    }));

                    fieldDecl[field].dependsFrom &&
                        pushDeps(fieldDecl[field].dependsFrom, toPushDeps.concat(field));
                });
            }

            fieldNames.forEach(function(fieldName) {
                var field = fieldDecl[fieldName];

                if (field.dependsFrom && !$.isArray(field.dependsFrom))
                    field.dependsFrom = [field.dependsFrom];

                deps[fieldName] || field.dependsFrom && pushDeps(field.dependsFrom, [fieldName]);
            });

            fieldNames.forEach(function(fieldName) {
                if (deps[fieldName])
                    fieldDecl[fieldName].dependsTo = deps[fieldName].sort(function(a, b) {
                        return deps[b] ? (deps[b].indexOf(a) != -1 ? 1 : -1) : 0;
                    });
            });

        },

        /**
         * Создает экземпляр модели
         * @protected
         * @param {String|Object} modelParams имя модели или параметры модели
         * @param {String} modelParams.name имя модели
         * @param {String|Number} [modelParams.id] идентификатор, если не указан, создается автоматически
         * @param {String} [modelParams.parentName] имя родительской модели
         * @param {String|Number} [modelParams.parentId] идентификатор родительской модели
         * @param {String} [modelParams.parentPath] путь родительской модели
         * @param {Object} [modelParams.parentModel] экземпляр родительской модели
         * @param {Object} [data] данные, которыми будет проинициализирована модель
         * @returns {BEM.MODEL}
         */
        create: function(modelParams, data) {
            if (typeof modelParams === 'string') modelParams = { name: modelParams };

            var decl = MODEL.decls[modelParams.name];

            if (!decl)
                throw new Error('unknown model: "' + modelParams.name + '"');

            // выставляем id из поля типа 'id' или из декларации
            $.each(decl, function(name, field) {
                if (field.type === 'id')
                    modelParams.id = (data && data[name]);
            });

            if (typeof modelParams.id === 'undefined')
                modelParams.id = $.identify();

            // создаем модель
            var model = new MODEL(modelParams, data);

            MODEL._addModel(model);
            model.trigger('create', { model: model });

            return model;
        },

        /**
         * Возвращает экземляр или массив экземпляров моделей по имени и пути
         * @protected
         * @param {String|Object} modelParams имя модели или параметры модели
         * @param {String} modelParams.name имя модели
         * @param {String|Number} [modelParams.id] идентификатор, если не указан, создается автоматически
         * @param {String} [modelParams.path] путь модели
         * @param {String} [modelParams.parentName] имя родительской модели
         * @param {String|Number} [modelParams.parentId] идентификатор родительской модели
         * @param {String} [modelParams.parentPath] путь родительской модели
         * @param {Object} [modelParams.parentModel] экземпляр родительской модели
         * @param {Boolean} [dropCache] Не брать значения из кеша
         * @returns {BEM.MODEL[]|Array}
         */
        get: function(modelParams, dropCache) {
            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            if (typeof modelParams.id === 'undefined') modelParams.id = ANY_ID;

            var name = modelParams.name,
                modelsByName = MODEL.models[name],
                models = [],
                modelsCacheByName = modelsGroupsCache[name],

                path = modelParams.path || MODEL.buildPath(modelParams),
                paths = path.split(MODELS_SEPARATOR);

            if (!MODEL.decls[name])
                throw('model "' + name + '" is not declared');

            if (!dropCache && modelsCacheByName && modelsCacheByName[path]) return modelsCacheByName[path].slice();

            for (var ip = 0, np = paths.length; ip < np; ip++) {
                var pathRegexp = MODEL._getPathRegexp(paths[ip]);

                for (var mPath in modelsByName) {
                    if (modelsByName.hasOwnProperty(mPath) && modelsByName[mPath] !== null && (new RegExp(pathRegexp, 'g')).test(mPath))
                        models.push(modelsByName[mPath]);
                }
            }

            modelsCacheByName || (modelsGroupsCache[name] = {});
            modelsGroupsCache[name][path] = models.slice();

            return models;
        },

        /**
         * Возвращает экземпляр модели по имени или пути
         * @param {Object|String} modelParams @see get.modelParams
         * @param {Boolean} dropCache @see get.dropCache
         * @returns {BEM.MODEL|undefined}
         */
        getOne: function(modelParams, dropCache) {
            return this.get(modelParams, dropCache).pop();
        },

        /**
         * Назначает глобальный обработчик событий на экземпляры моделей по пути
         * @param {String|Object} modelParams Имя модели или параметры описываеющие path модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Function} fn обработчик события
         * @param {Object} [ctx] контекст выполнения обработчика
         * @returns {BEM.MODEL}
         */
        on: function(modelParams, field, e, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = e;
                e = field;
                field = undefined;
            }

            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            var modelName = modelParams.name,
                eventPath = MODEL.buildPath(modelParams),
                triggers = !field ?
                    MODEL.modelsTriggers[modelName] || (MODEL.modelsTriggers[modelName] = {}) :
                    (MODEL.fieldsTriggers[modelName] || (MODEL.fieldsTriggers[modelName] = {})) &&
                        MODEL.fieldsTriggers[modelName][field] || (MODEL.fieldsTriggers[modelName][field] = {});

            e.split(' ').forEach(function(event) {
                (triggers[event] || (triggers[event] = [])).push({
                    name: modelName,
                    path: eventPath,
                    field: field,
                    fn: fn,
                    ctx: ctx
                });
            });

            MODEL.forEachModel(function() {
                this.on(field, e, fn, ctx);
            }, modelParams, true);

            return this;
        },

        /**
         * Удаляет глобальный обработчик событий на экземпляры моделей по пути
         * @param {String|Object} modelParams Имя модели или параметры описываеющие path модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Function} fn обработчик события
         * @param {Object} [ctx] контекст выполнения обработчика
         * @returns {BEM.MODEL}
         */
        un: function(modelParams, field, e, fn, ctx) {
            if ($.isFunction(e)) {
                ctx = fn;
                fn = e;
                e = field;
                field = undefined;
            }

            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            var modelName = modelParams.name,
                eventPath = MODEL.buildPath(modelParams),
                triggers = !field ?
                    MODEL.modelsTriggers[modelName] :
                    MODEL.fieldsTriggers[modelName] && MODEL.fieldsTriggers[modelName][field];

            e.split(' ').forEach(function(event) {
                var pos;

                triggers[event] && $.each(triggers[event], function(i, event) {
                    if (event.path === eventPath &&
                        event.fn === fn &&
                        event.ctx === ctx &&
                        event.field === field) {

                        pos = i;

                        return false;
                    }
                });

                if (typeof pos !== 'undefined') {

                    // удаляем обработчик из хранилища
                    triggers[event].splice(pos, 1);

                    // отписываем обработчик с моделей
                    MODEL.forEachModel(function() {
                        this.un(event.field, event, fn, ctx);
                    }, modelParams, true);

                }
            });

            return this;
        },

        /**
         * Тригерит событие на моделях по имени и пути
         * @param {String|Object} modelParams Имя модели или параметры описываеющие path модели
         * @param {String} [field] имя поля
         * @param {String} e имя события
         * @param {Object} [data] данные передаваемые в обработчик события
         * @returns {BEM.MODEL}
         */
        trigger: function(modelParams, field, e, data) {
            if (!(typeof field == 'string' && typeof e == 'string')) {
                data = e;
                e = field;
                field = undefined;
            }

            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            e.split(' ').forEach(function(event) {
                MODEL.forEachModel(function() {
                    this.trigger(field, event, data);
                }, modelParams, true);
            });

            return this;
        },

        /**
         * Назначает глобальные обработчики событий на экземпляр модели
         * @param {BEM.MODEL} model экземпляр модели
         * @returns {BEM.MODEL}
         * @private
         */
        _bindToModel: function(model) {
            return this._bindToEvents(model, MODEL.modelsTriggers[model.name]);
        },

        /**
         * Назначает глобальные обработчики событий на поля экземпляра модели
         * @param {BEM.MODEL} model экземпляр модели
         * @returns {BEM.MODEL}
         * @private
         */
        _bindToFields: function(model) {
            var _this = this,
                fields = this.fieldsTriggers[model.name];

            fields && $.each(fields, function(fieldName, fieldTriggers) {

                _this._bindToEvents(model, fieldTriggers);

            });

            return this;
        },

        /**
         * Хелпер навешивания событий на экземпляр модели
         * @param {BEM.MODEL} model экземпляр модели
         * @param {Object} events события
         * @returns {BEM.MODEL}
         * @private
         */
        _bindToEvents: function(model, events) {
            var _this = this;

            events && $.each(events, function(eventName, storage) {
                storage.forEach(function(event) {
                    var regExp = new RegExp(this._getPathRegexp(event.path), 'g');

                    if (regExp.test(model.path())) {
                        model.on(event.field, eventName, event.fn, event.ctx);
                    }
                }, _this);
            });

            return this;
        },

        /**
         * Добавляет модель в хранилище
         * @private
         * @param {BEM.MODEL} model экземпляр модели
         * @returns {BEM.MODEL}
         * @private
         */
        _addModel: function(model) {

            MODEL.models[model.name][model.path()] = model;
            modelsGroupsCache[model.name] = null;

            MODEL
                ._bindToModel(model)
                ._bindToFields(model);

            return this;
        },

        /**
         * Уничтожает экземпляр модели, удаляет его из хранилища
         * @param {BEM.MODEL|String|Object} modelParams Модель, имя модели или параметры описываеющие path модели
         * @returns {BEM.MODEL}
         */
        destruct: function(modelParams) {
            if (typeof modelParams == 'string') modelParams = { name: modelParams };

            if (modelParams instanceof MODEL)
                modelParams = {
                    path: modelParams.path(),
                    name: modelParams.name,
                    id: modelParams.id
                };

            MODEL.forEachModel(function() {

                $.each(this.fields, function(name, field) {
                    field.destruct();
                });

                MODEL.models[this.name][this.path()] = null;
                this.trigger('destruct', { model: this });
            }, modelParams, true);

            modelsGroupsCache[modelParams.name] = null;

            return this;
        },

        /**
         * Возвращает путь к модели по заданным параметрам
         * @param {Object|Array} pathParts параметры пути
         * @param {String} pathParts.name имя модели
         * @param {String|Number} [pathParts.id] идентификатор модели
         *
         * @param {String} [pathParts.parentName] имя родитеской модели
         * @param {String|Number} [pathParts.parentId] идентификатор родительской модели
         * @param {String|Object} [pathParts.parentPath] путь родительской модели
         * @param {BEM.MODEL} [pathParts.parentModel] экземпляр родительской модели
         *
         * @param {String} [pathParts.childName] имя дочерней модели
         * @param {String|Number} [pathParts.childId] идентификатор дочерней модели
         * @param {String|Object} [pathParts.childPath] путь дочерней модели
         * @param {BEM.MODEL} [pathParts.childModel] экземпляр дочерней модели
         * @returns {String}
         */
        buildPath: function(pathParts) {
            if ($.isArray(pathParts))
                return pathParts.map(MODEL.buildPath).join(MODELS_SEPARATOR);

            var parts = { parent: '', child: '' };

            ['parent', 'child'].forEach(function buildPathForEach(el) {
                var path = pathParts[el + 'Path'],
                    model = pathParts[el + 'Model'],
                    name = pathParts[el + 'Name'],
                    id = pathParts[el + 'Id'];

                parts[el] = model && model.path() ||
                    (typeof path === 'object' ? MODEL.buildPath(path) : path) ||
                    (name ? name + (id ? ID_SEPARATOR + id : '') : '');
            });

            return (parts.parent ? parts.parent + CHILD_SEPARATOR : '') +
                pathParts.name +
                ID_SEPARATOR + (typeof pathParts.id !== 'undefined' ? pathParts.id : ANY_ID)  +
                (parts.child ? CHILD_SEPARATOR + parts.child : '');
        },

        /**
         * Возвращает строку для построения регулярного выражения проверки пути
         * @param {String} path
         * @returns {String}
         * @private
         */
        _getPathRegexp: function(path) {
            return path.replace(new RegExp('\\' + ANY_ID, 'g'), '([^' + CHILD_SEPARATOR + ID_SEPARATOR + ']*)') + '$';
        },

        /**
         * Выполняет callback для каждой модели найденной по заданному пути. Если callback вернул false, то
         * итерация остановливается
         * @param {Function} callback ф-ия выполняемая для каждой модели
         * @param {String|Object} modelParams параметры модели
         * @param {Boolean} [dropCache] Не брать значения из кеша
         * @returns {BEM.MODEL}
         */
        forEachModel: function(callback, modelParams, dropCache) {
            var modelsByPath = MODEL.get(modelParams, dropCache);

            if (Array.isArray(modelsByPath))
                for (var i = 0, n = modelsByPath.length; i < n; i++)
                    if (callback.call(modelsByPath[i]) === false) break;

            return this;
        }

    });

})(BEM, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/i-model.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/i-model__field.js begin */
;(function(MODEL, $) {

    /**
     * @namespace
     * @name BEM.MODEL.FIELD
     */
    MODEL.FIELD = $.inherit($.observable, {

        /**
         * @class Конструктор поля модели
         * @constructs
         * @param {Object} params
         * @param {BEM.MODEL} model
         * @private
         */
        __constructor: function(params, model) {
            this.params = params || {};
            this.model = model;
            this.name = params.name;
            this._type = params.type;

            this._init();
        },

        /**
         * Вспомогательная функция для генерации события на поле и на модели
         * На модели генерируется событие с приставкой field-[имя события]
         * @param {String} event имя события
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _trigger: function(event, opts) {
            opts = $.extend({}, opts, { field: this.name });

            this.model.trigger('field-' + event, opts);
            this.trigger(event, opts);

            return this;
        },

        /**
         * Инициализация поля
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _init: function() {
            this._initDefaults();

            return this;
        },

        /**
         * Определяем дефолтные значения для поля
         * @returns {Object}
         * @private
         */
        _initDefaults: function() {
            this._default = this.params['default'] || this._default;

            this._validationRules = this._getValidationRules();

            return this;
        },

        /**
         * Инициализирует поле занчением
         * @param {*} value инициализационное значение
         * @returns {Object}
         */
        initData: function(value) {
            this
                .set(value, { isInit: true })
                .fixData();

            return this;
        },

        /**
         * Кешериуем текущее состояние
         * @returns {BEM.MODEL.FIELD}
         */
        fixData: function() {
            this._fixedValue = this.get();

            return this;
        },

        /**
         * Восстанавливает закешированое значение поля
         * @returns {BEM.MODEL.FIELD}
         */
        rollback: function() {
            this.set(this._fixedValue, { rollback: true });

            return this;
        },

        /**
         * Устанавливает значение поля
         * @param {*} value значение для установки
         * @param {Object} [opts] доп. параметры доступные в обработчике события change
         * @returns {BEM.MODEL.FIELD}
         */
        set: function(value, opts) {
            if (!(opts && opts.isInit) && this.isEqual(value)) return this;

            return this._set(value, opts);
        },

        /**
         * Внутренний метод выставления значения
         * @param {*} value значение
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _set: function(value, opts) {
            this._raw = this.checkEmpty(value) ? this._default : value;
            this._value = (this.params.preprocess || this._preprocess).call(this, this._raw);
            this._formatted = (this.params.format || this._format).call(this, this._value, this.params.formatOptions || {});

            if (opts)
                opts.value = this._value;
            else
                opts = { value: this._value };

            this._trigger(opts && opts.isInit ? 'init' : 'change', opts);
            
            return this;
        },

        /**
         * Выставляет пустое или дефолтное (если указано) значение поля
         * @param {Object} [opts] доп. параметры
         * @returns {BEM.MODEL.FIELD}
         */
        clear: function(opts) {
            this.set(undefined, opts);

            return this;
        },

        /**
         * Возвращает текущее значение поля
         * @returns {*}
         */
        get: function() {
            return this._value;
        },

        /**
         * Поверяет равно ли текущее значение поля значению переменной value
         * @param {*} value значение для сравнения с текущим значением
         * @returns {boolean}
         */
        isEqual: function(value) {
            value = (this.params.preprocess || this._preprocess).call(this, value); // fixme: preprocess выполняется 2 разе при вызове _set
            return value === this.get() || this.isEmpty() && this.checkEmpty(value);
        },

        /**
         * Проверка значения value на пустоту
         * @param {*} value значение
         * @returns {boolean}
         */
        checkEmpty: function(value) {
            return value == undefined || !!(value + '').match(/^\s*$/);
        },

        /**
         * Менялось ли значение поля с момента последней фиксации начального состояния
         * @returns {boolean}
         */
        isChanged: function() {
            return !this.isEqual(this._fixedValue);
        },

        /**
         * Возвращает начальное значение поля
         * @returns {*}
         */
        getFixedValue: function() {
            return this._fixedValue || this.getDefault();
        },

        /**
         * Возвращает дефолтное значение поля
         * @returns {*}
         */
        getDefault: function() {
            return this._default;
        },

        /**
         * Возвращает тип данного поля
         * @returns {String}
         */
        getType: function() {
            return this._type;
        },

        /**
         * Проверяет текущее значение поля на пустоту
         * @returns {boolean}
         */
        isEmpty: function() {
            return this.checkEmpty(this._raw) || this._raw === this._default;
        },

        /**
         * Возвращает текущее значение поля без применённых к нему обработок
         * @returns {*}
         */
        raw: function() {
            return this._raw;
        },

        /**
         * Возвращает значение поля, отформатированное для вывода на печать
         * @returns {String}
         */
        format: function() {
            return this._formatted;
        },

        /**
         * Форматирует значение поля
         * @param {*} value
         * @param {Object} [options]
         * @returns {String}
         * @private
         */
        _format: function(value, options) {
            return '' + value;
        },

        /**
         * Возвращает значение пригодное для сериализации
         * @returns {Object}
         */
        toJSON: function() {
            return this.get();
        },

        /**
         * Предобрабатывает значение поля перед записью
         * @param {*} value
         * @returns {*}
         * @private
         */
        _preprocess: function(value) {
            return value;
        },

        /**
         * Возвращает результат проверки поля на валидность
         * @returns {boolean}
         */
        isValid: function() {
            return this.validate() === true;
        },

        /**
         * Общие правила валидации
         * @private
         */
        _commonRules: function() {
            var field = this;

            return {
                required: {
                    value: true,
                    /**
                     * Функция валидации, вызывается в контексте модели
                     * @param {*} curValue текущее значение
                     * @param {*} ruleValue заданное значение в правиле валидации
                     * @param {String} [name] имя поля
                     * @returns {Boolean}
                     */
                    validate: function(curValue, ruleValue, name) {
                        return field.checkEmpty(curValue) !== ruleValue;
                    }
                }
            }
        },

        /**
         * Возвращает стандартные правила валидации
         * @returns {*}
         * @private
         */
        _getValidationRules: function() {
            return this._commonRules();
        },

        /**
         * Проверяет поле на валидность
         * @returns {*}
         */
        validate: function() {
            if (!this.params.validation) return true;

            var _this = this,
                getOrExec = function(obj, ruleValue) {
                    return $.isFunction(obj) ? obj.call(_this.model, _this.get(), ruleValue, _this.name) : obj;
                },
                validation = getOrExec(this.params.validation),
                invalidRules = [];

            if (getOrExec(validation.needToValidate) === false) return true;

            if (validation.validate) {
                if (getOrExec(validation.validate)) {
                    return true;
                } else {
                    var invalidRule = {
                        text: getOrExec(validation.text)
                    };

                    this._trigger('error', invalidRule);
                    return { valid: false, invalidRules: [invalidRule] };
                }
            }

            if (validation.rules) {
                $.each(validation.rules, function(ruleName, ruleParams) {
                    ruleParams = getOrExec(ruleParams);
                    ruleParams = typeof ruleParams === 'object' ? ruleParams : { value: ruleParams };

                    var rule = $.extend({}, _this._validationRules[ruleName], ruleParams),
                        invalidRule;

                    if (getOrExec(rule.needToValidate) === false) return true;

                    if (!getOrExec(rule.validate, getOrExec(rule.value))) {
                        invalidRule = {
                            rule: ruleName,
                            text: getOrExec(rule.text)
                        };
                        invalidRules.push(invalidRule);

                        _this._trigger('error', invalidRule);
                    }
                });
            }

            return invalidRules.length ?
                { valid: false, invalidRules: invalidRules } :
                true;
        },

        destruct: function() {}

    }, {

        /**
         * Хранилище модификаций класса
         */
        types: {},

        /**
         * Создает поле модели
         * @param {String} name имя поля
         * @param {Object} params параметры
         * @param {BEM.MODEL} model экземпляр модели в которой создается поле
         * @returns {*}
         */
        create: function(name, params, model) {
            if (typeof params == 'string') params = { type: params };
            params.name = name;

            return new (MODEL.FIELD.types[params.type] || MODEL.FIELD)(params, model);
        }

    });

})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/i-model__field.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_id.js begin */
;(function(MODEL, $) {
    MODEL.FIELD.types.id = $.inherit(MODEL.FIELD, {

        isEmpty: function() {
            return true;
        }

    });
})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_id.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_string.js begin */
;(function(MODEL, $) {
    MODEL.FIELD.types.string = $.inherit(MODEL.FIELD, {

        /**
         * Значение по умолчанию пустая строка
         */
        _default: '',

        /**
         * Правила валидации для поля типа string
         * @private
         */
        _getValidationRules: function() {
            var maxLength = {
                value: Infinity,
                validate: function(curValue, ruleValue, name) {
                    return curValue && curValue.length <= ruleValue;
                }
            };

            return $.extend(this._commonRules(), {
                maxlength: maxLength,
                maxLength: maxLength
            })
        }

    });
})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_string.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_number.js begin */
;(function(MODEL, $) {
    MODEL.FIELD.types.number = $.inherit(MODEL.FIELD, {

        /**
         * Перед записью приводит значение к числу
         * @param value
         * @returns {Number}
         * @private
         */
        _preprocess: function(value) {
            if (this.checkEmpty(value)) return;

            // перед преобразованием, необходимо часто вводимые символы на точку
            value = (new Number(value.toString().replace(/[//,.юЮбБ<>]/gi, '.'))).valueOf();
            //Если было введено не число, то preprocess вернет NaN
            return value;
        },
        
        /**
         * Определяем дефолтные значения для поля
         * @returns {Object}
         * @private
         */
        _initDefaults: function() {
            //0 - это валидное значение для default
            this._default = this.params['default'] === undefined ? this._default : this.params['default'];
            
            this._precision = this.params.precision === undefined ? 2 : this.params.precision;

            this._validationRules = this._getValidationRules();

            return this;
        },


        /**
         * Форматированное значение содержит два десятичных знака
         * @param {Number} value
         * @returns {string}
         * @private
         */
        _format: function(value) {
            return (value || 0).toFixed(this._precision);
        },

        /**
         * Правила валидации для поля типа number
         * @private
         */
        _getValidationRules: function() {
            return $.extend(this._commonRules(), {
                max: {
                    value: Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue < ruleValue;
                    }
                },
                min: {
                    value: -Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue > ruleValue;
                    }
                },
                gte: {
                    value: Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue <= ruleValue;
                    }
                },
                lte: {
                    value: -Infinity,
                    validate: function(curValue, ruleValue, name) {
                        return curValue >= ruleValue;
                    }
                },
                type: {
                    value: true,
                    validate: function(curValue) {
                        return !isNaN(curValue);
                    }
                }

            })
        }

    });

})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_number.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_boolean.js begin */
;(function(MODEL, $) {
    MODEL.FIELD.types.boolean = $.inherit(MODEL.FIELD, {

        /**
         * Перед записью приводит значение к boolean
         * @param {*} value
         * @returns {boolean}
         * @private
         */
        _preprocess: function(value) {
            if (this.checkEmpty(value)) return;

            return !!(typeof value == 'string' ? +value : value);
        },

        /**
         * Приводит к 1 или 0
         * @param {Boolean} value
         * @returns {string}
         * @private
         */
        _format: function(value) {
            return (0 + value).toString();
        }

    });
})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_boolean.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_model.js begin */
;(function(MODEL, $) {
    MODEL.FIELD.types.model = $.inherit(MODEL.FIELD, {

        /**
         * Инициализация поля
         * @param data
         * @returns {MODEL.FIELD.types.model}
         */
        initData: function(data) {
            this._value = MODEL.create({ name: this.params.modelName, parentModel: this.model }, data);

            this._initEvents();

            return this;
        },

        /**
         * Инициализирует события на модели
         * @private
         */
        _initEvents: function() {
            this._value.on('change', this._onInnerModelChange, this);
        },

        /**
         * Отписывается от событий на модели
         * @private
         */
        _unBindEvents: function() {
            this._value.un('change', this._onInnerModelChange, this);
        },

        /**
         * Обрабатывает изменения модели, генерирует событие на родительской модели
         * @private
         */
        _onInnerModelChange: function() {
            this._trigger('change', { fields: this._value.changed });
        },

        /**
         * Закешировать состояние модели
         * @returns {MODEL.FIELD.types.model}
         */
        fixData: function() {
            this._value.fix();

            return this;
        },

        /**
         * Откатить значение на закешированное
         * @returns {MODEL.FIELD.types.model}
         */
        rollback: function() {
            this._value.rollback();

            return this;
        },

        /**
         * Задать значение
         * @param {Object} value
         * @param {Object} opts
         * @returns {BEM.MODEL.FIELD}
         */
        set: function(value, opts) {
            return this._set(value, opts);
        },

        /**
         * Проапдейтить модель данными
         * @param {Object|BEM.MODEL} data
         * @param {Object} opts
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _set: function(data, opts) {
            if (data instanceof MODEL) {
                if (data.name === this.params.modelName) {
                    this._unBindEvents();
                    this.params.destruct && opts.destruct !== false && this._value.destruct();

                    this._value = data;
                    this._initEvents();
                } else {
                    throw new Error('incorrect model "' + data.name +  '", expected model "' +
                        this.params.modelName +  '"');
                }
            } else {
                this._value.update(data);
            }

            this._trigger(opts && opts.isInit ? 'init': 'change', opts);

            return this;
        },

        /**
         * Очистить поля модели
         * @param {Object} opts
         * @returns {MODEL.FIELD.types.model}
         */
        clear: function(opts) {
            this._value.clear(opts);

            return this;
        },

        /**
         * Получить модель
         * @returns {BEM.MODEL}
         */
        get: function() {
            return this._value;
        },

        /**
         * Получить данные модели
         * @returns {Object}
         */
        toJSON: function() {
            return this._value.toJSON();
        },

        /**
         * Правила валидиции для поля типа model
         * @returns {Object}
         * @private
         */
        _getValidationRules: function() {
            var field = this;

            return $.extend(this._commonRules(), {
                /**
                 * валидация вложенной модели
                 */
                deep: {
                    value: true,
                    validate: function(curValue, ruleValue, name) {
                        return field._value.isValid() == ruleValue
                    }
                }
            });
        },

        /**
         * Уничтожает поле и модель этого поля
         */
        destruct: function() {
            this._unBindEvents();

            this.params.destruct && this._value.destruct();
        }

    });
})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_model.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_array.js begin */
;(function(MODEL, $) {
    MODEL.FIELD.types.array = $.inherit(MODEL.FIELD, {

        /**
         * Определяем дефолтные значения для поля
         * @returns {Object}
         * @private
         */
        _initDefaults: function() {
            this.__base();

            this._default || (this._default = []);

            return this;
        },

        /**
         * Возвращает копию исходного массива, чтобы исключить возможность
         * изменения внутреннего свойства
         * @returns {Array}
         */
        raw: function() {
            return this._raw && this._raw.slice();
        },

        /**
         * Кеширует текущее состояние поля
         * @returns {MODEL.FIELD}
         */
        fixData: function() {
            this._fixedValue = this.raw();

            return this;
        },

        /**
         * Доопределяем нативные методы, чтобы иметь возможность контролировать изменение массива
         * @param {Array} value
         * @returns {Array}
         * @private
         */
        _preprocess: function(value) {
            var _this = this;

            value = value.slice();

            // изменяющие методы
            ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(name) {
                var nativeFn = value[name];

                value[name] = function() {
                    var args = Array.prototype.slice.call(arguments),
                        res = nativeFn.apply(_this._raw, args);

                    _this._set(_this._raw);

                    if (name == 'push' || name == 'unshift') {
                        _this.trigger('add', { data: args[0] });
                    }

                    if (name == 'pop' || name == 'shift') {
                        _this.trigger('remove', { data: res });
                    }

                    if (name == 'splice') {
                        _this
                            .trigger('add', { data: args.slice(2) })
                            .trigger('remove', { data: res });
                    }

                    _this._trigger('change');

                    return res;
                }
            });

            // неизменяющие методы
            ['map', 'forEach', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'indexOf'].forEach(function(name) {
                var nativeFn = value[name];

                value[name] = function() {
                    return nativeFn.apply(_this._raw, arguments);
                };
            });

            return value;
        },

        /**
         * Внутренний метод выставления значения
         * @param {*} value значение
         * @param {Object} opts доп. параметры
         * @returns {BEM.MODEL.FIELD}
         * @private
         */
        _set: function(value, opts) {
            this._raw = this.checkEmpty(value) ? this._default && this._default.slice() : value;
            this._value = (this.params.preprocess || this._preprocess).call(this, this._raw && this._raw.slice());
            this._formatted = (this.params.format || this._format).call(
                this,
                this._value && this._value.slice(),
                this.params.formatOptions || {});

            opts && (opts.value = this._value);
            this._trigger(opts && opts.isInit ? 'init' : 'change', opts);

            return this;
        },

        /**
         * Проверяет что значение не пустое
         * @param value
         * @returns {Boolean}
         */
        checkEmpty: function(value) {
            return $.isEmptyObject(value) || value.length == 0;
        },

        /**
         * Проверяет текущее значение поля на пустоту
         * @returns {boolean}
         */
        isEmpty: function() {
            return this.checkEmpty(this._raw) || this.isEqual(this._default);
        },

        /**
         * Форматирует значение поля
         * @param {*} value
         * @param {Object} [options]
         * @returns {String}
         * @private
         */
        _format: function(value, options) {
            return value;
        },

        /**
         * Проверяет, что занчение поля равно переданному значению по содержимому
         * @param value
         */
        isEqual: function(value) {
            var val = this._raw;

            var res = val &&
                Array.isArray(value) &&
                value.length === val.length &&
                Array.prototype.every.call(value, function(item, i) {
                    return val[i] === item;
                });

            return res;
        }

    });
})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_array.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_models-list.js begin */
;(function(MODEL, $) {
    MODEL.FIELD.types['models-list'] = $.inherit(MODEL.FIELD, {

        /**
         * Инициализация поля
         * @param {Object} data
         * @returns {BEM.MODEL.FIELD}
         */
        initData: function(data) {
            this.params['default'] || (this.params['default'] = []);
            this._raw = [];

            this._value = this._createValueObject(this);

            this.__base(data || this.params['default']);

            return this;
        },

        /**
         * Создает значение поля типа models-list, которое предоставляет методы для работы со списком
         * @param field контекст текущего поля
         * @returns {{
         *   _createModel: Function,
         *   add: Function,
         *   remove: Function,
         *   getById: Function,
         *   _getIndex: Function,
         *   getByIndex: Function
         * }}
         * @private
         */
        _createValueObject: function(field) {
            var list = {

                /**
                 * Создает модель и инициализирует ее переданными данными
                 * @param data
                 * @returns {*}
                 * @private
                 */
                _createModel: function(data) {
                    var model = data instanceof MODEL ?
                        data :
                        MODEL.create({ name: field.params.modelName, parentModel: field.model }, data);

                    model
                        .on('change', function() {
                            field._trigger('change', { data: model });
                        })
                        .on('destruct', function(e, data) {
                            list.remove(data.model.id);
                        });

                    return model;
                },

                /**
                 * Добавляет модель в список
                 * @param itemData
                 * @param opts
                 * @returns {*}
                 */
                add: function(itemData, opts) {
                    var model = list._createModel(itemData);

                    field._raw.push(model);

                    field
                        .trigger('add', $.extend({}, opts, { model: model }))
                        ._trigger('change', opts);

                    return model;
                },

                /**
                 * Удаляет модель из списка по id
                 * @param id
                 * @param opts
                 */
                remove: function(id, opts) {
                    var index = list._getIndex(id);

                    if (index !== undefined) {
                        var model = list.getByIndex(index);

                        field._raw.splice(index, 1);
                        field.trigger('remove', $.extend({}, opts, { model: model }));
                        model.destruct();

                        field._trigger('change', opts);
                    }
                },

                /**
                 * Очищает список
                 * @param opts
                 */
                clear: function(opts) {
                    var tmp = field._raw.slice();

                    tmp.forEach(function(model) {
                        model.destruct()
                    });

                    if (!opts || !opts.silent)
                        field._trigger('change', opts);
                },

                /**
                 * Возвращает модель из списка по id
                 * @param id
                 * @returns {BEM.MODEL}
                 */
                getById: function(id) {
                    return list.getByIndex(list._getIndex(id));
                },

                /**
                 * Возвращает порядковый номер модели по id
                 * @param id
                 * @returns {Number}
                 * @private
                 */
                _getIndex: function(id) {
                    var index;

                    field._raw.some(function(model, i) {
                        if (model.id == id) {
                            index = i;
                            return true;
                        }
                    });

                    return index;
                },

                /**
                 * Возвращает модель из списка по индексу
                 * @param i
                 * @returns {BEM.MODEL}
                 */
                getByIndex: function(i) {
                    return field._raw[i];
                },

                /**
                 * Возвращает массив моделей, соответствующих заданным парамтрам.
                 * @param {Object} attrs Объект, задающий условия поиска
                 * @returns {Array} Массив моделей
                 */
                where: function(attrs) {
                    if ($.isEmptyObject(attrs) || !attrs) {
                        return [];
                    }
                    return list.filter(function(model) {
                        return Object.keys(attrs).every(function(key) {
                            return attrs[key] === model.get(key);
                        });
                    });
                },

                /**
                 * Возвращает количество элементов
                 * @returns {Number}
                 */
                length: function() {
                    return field._raw.length;
                }
            };

            // расширяем объект стандартными методами массива
            ['map', 'forEach', 'filter', 'reduce', 'reduceRight', 'some', 'every', 'indexOf'].forEach(function(name) {
                var nativeFn = field._raw[name];

                list[name] = function() {
                    return nativeFn.apply(field._raw, arguments);
                };
            });

            MODEL.on({ name: field.params.modelName, parentModel: field.model }, 'create', function(e, data) {
                setTimeout(function() {
                    if (data.model && list._getIndex(data.model.id) === undefined)
                        list.add(data.model);
                }, 0);
            });

            return list;
        },

        /**
         * Закешировать состояние
         * @returns {MODEL.FIELD}
         */
        fixData: function() {
            this._fixedValue = this._raw.map(function(model) {
                return model.toJSON();
            }, this);

            return this;
        },

        /**
         * Задать новое значение для поля
         * @param {Array} value
         * @param {Object} opts
         * @returns {_set|*}
         */
        set: function(value, opts) {
            return this._set(value, opts);
        },

        /**
         * Задает значение для поля
         * @param {Array} data
         * @param {Object} opts
         * @returns {MODEL.FIELD}
         * @private
         */
        _set: function(data, opts) {
            this._value.clear({ silent: true });

            this._raw = data.map(function(itemData) {
                return this._value.add(itemData);
            }, this);

            this._trigger(opts && opts.isInit ? 'init': 'change', opts);

            return this;
        },

        /**
         * Очистить поле и удалить все вложенные модели
         * @param {Object} [opts]
         * @returns {MODEL.FIELD}
         */
        clear: function(opts) {
            this._value.clear();

            return this;
        },

        /**
         * Полчить данные поля
         * @returns {Array}
         */
        toJSON: function() {
            return this._raw.map(function(model) {
                return model.toJSON();
            }, this);
        },

        /**
         * Уничтожить объект и вложенные модели
         */
        destruct: function() {
            this.clear();
        }

    });
})(BEM.MODEL, jQuery);

/* ../../libs/bem-mvc/common.blocks/i-model/__field/_type/i-model__field_type_models-list.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-glue/i-glue.js begin */
/**
 * Блок для проклеивания моделей и DOM
 */
BEM.DOM.decl('i-glue', {

    onSetMod: {
        js: function() {

            this.glue();

        }
    },

    /**
     * Проклеить BEM-блоки полей с полями модели
     */
    glue: function() {
        this
            ._initModel()
            ._initFields();
    },

    /**
     * Инициализирует модель, соответствующую данному блоку
     * @param {Object} [modelParams] Парметры модели
     * @param {Object} [modelData] Данные для инициализации модили
     * @returns {BEM}
     * @private
     */
    _initModel: function(modelParams, modelData) {
        var mParams = modelParams || this.getModelParams(),
            model;

        if (mParams.id !== undefined) {
            model = BEM.MODEL.getOne(mParams);
        }

        this.model = model || BEM.MODEL.create(mParams,
                modelData || this.params.modelData || (this.params.modelParams && this.params.modelParams.data) || {});

        return this;
    },

    /**
     * Инициализирует поля и провязывает их с моделью
     * @returns {BEM}
     * @private
     */
    _initFields: function() {
        var _this = this;

        this._fields = {};

        $.each(this.findElem('model-field'), function(i, elem) {
            _this.initFieldBlock($(elem));
        });

        return this;
    },

    /**
     * Инициализируем блок i-glue-field (или его потомка) на BEM-блоке
     * @param {jQuery} elem
     * @returns {BEM}
     */
    initFieldBlock: function(elem) {
        elem = this.elemify(elem, 'model-field'); // идентифицируем элемент для случая, когда на одной ноде несколько элементов

        var elemParams = this.elemParams(elem) || {};
        elemParams.name || (elemParams.name = this.getMod(elem, 'name'));
        elemParams.type || (elemParams.type = this.getMod(elem, 'type'));

        var type = elemParams.type,
            block = new BEM.DOM.blocks['i-glue-field' + (type ? '_type_' + type : '')](elem, elemParams, true);

        this._fields[elemParams.name] = block;
        block.init(this.model);

        return this;
    },

    /**
     * Возвращает BEM-блок по имени поля из модели
     * @param name Имя поля
     * @returns {BEM}
     */
    getFieldBlock: function(name) {
        return this._fields[name];
    },

    /**
     * Возвращает параметры модели
     * @returns {Object}
     */
    getModelParams: function() {
        if (this.params.modelParams) return this.params.modelParams;

        var params = {
            name: this.getModelName(),
            id: this.params.modelId
        };

        if (this.params.modelParentPath)
            params.parentPath = this.params.modelParentPath;

        if (this.params.modelParentName) {
            params.parentName = this.params.modelParentName;
            params.parentId = this.params.modelParentId;
        }

        return params;
    },

    /**
     * Возвращает путь к модели, соответствующей данному блоку
     * @returns {String}
     */
    getModelPath: function() {
        return MODEL.buildPath(this.getModelParams);
    },

    /**
     * Возвращает имя модели, соответствующей данному блоку
     * @returns {String}
     */
    getModelName: function() {
        return this.params.modelName || this.__self.getName();
    }


});

/* ../../libs/bem-mvc/common.blocks/i-glue/i-glue.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-glue-field/i-glue-field.js begin */
BEM.DOM.decl('i-glue-field', {

    onSetMod: {
        js: function() {
            this.name = this.params.name;
        }
    },

    /**
     * Инициализирует блок i-glue-field
     * @protected
     * @param model
     */
    init: function(model) {
        this.model = model;

        this.model.on(this.name, 'change', this.onFieldChange, this);

        return this;
    },

    /**
     * Выставить значение поля модели
     * @param {*} val Значение поля
     */
    set: function(val) {
        this.model.set(this.name, val);

        return this;
    },

    /**
     * Получить занчение поля модели
     */
    get: function() {
        return this.model.get(this.name);
    },

    /**
     * Выполнить действие по изменению поля модели
     * @param e
     * @param data
     */
    onFieldChange: function(e, data) {}

});

/* ../../libs/bem-mvc/common.blocks/i-glue-field/i-glue-field.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_checkbox.js begin */
BEM.DOM.decl({ block: 'i-glue-field_type_checkbox', baseBlock: 'i-glue-field' }, {
    onSetMod: {
        js: function() {
            this.__base();

            this.checkbox = this.findBlockOn('checkbox');
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this.checkbox.on('change', function() {
            this.model.set(this.name, this.checkbox.isChecked());
        }, this);
    },

    set: function(value) {
        this.__base();
        this.checkbox.setMod('checked', value ? 'yes' : '');
    },

    onFieldChange: function(e, data) {
        this.checkbox.getMod('focused') !== 'yes' && this.checkbox.setMod('checked', data.value ? 'yes' : '');
    }

});

/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_checkbox.js end */
;
/* ../../libs/bem-components/common.blocks/checkbox/checkbox.js begin */
/**
 * @namespace i-bem.js реализация блока checkbox
 * @name Checkbox
 */
BEM.DOM.decl('checkbox', /** @lends Checkbox.prototype */ {

    onSetMod : {

        'js' : function() {

            var _this = this,
                checkboxElem = _this.elem('control');

            try {
                // В iframe в IE9 происходит "Error: Unspecified error."
                var activeNode = _this.__self.doc[0].activeElement;
            } catch(e) {}

            _this.setMod('checked', checkboxElem.attr('checked')? 'yes' : '');
            activeNode === checkboxElem[0] && _this.setMod('focused', 'yes');

        },

        'focused' : {

            'yes' : function() {

                if (this.isDisabled())
                    return false;

                this.elem('control').focus();
                this.setMod(this.elem('box'), 'focused', 'yes');

                this.afterCurrentEvent(function() {
                    this.trigger('focus');
                });
            },

            '' : function() {

                this.elem('control').blur();
                this.delMod(this.elem('box'), 'focused');

                this.afterCurrentEvent(function() {
                    this.trigger('blur');
                });
            }

        },

        'checked' : function(modName, modVal) {

            this.elem('control').attr('checked', modVal == 'yes');

            this.afterCurrentEvent(function(){
               this.trigger('change');
            });

            this.toggleMod(this.elem('box'), 'checked', 'yes', modVal == 'yes');
        },

        'disabled' : function(modName, modVal) {

            this.elem('control').attr('disabled', modVal === 'yes');
        }

    },

    /**
     * Шорткат для проверки модификатора `_disabled_yes`
     * @returns {Boolean}
     */
    isDisabled : function() {
        return this.hasMod('disabled', 'yes');
    },

    /**
     * Шоткат для проверки модификатора `_checked_yes`
     * @returns {Boolean}
     */
    isChecked : function() {
        return this.hasMod('checked', 'yes');
    },

    /**
     * Хелпер для переключения модификатора `_checked_yes`
     */
    toggle : function() {
        this.toggleMod('checked', 'yes', '');
    },

    /**
     * Получить/установить значение контрола
     * @param {String} [val] значение которое нужно установить
     * @returns {String|BEM.DOM}
     */
    val : function(val) {
        var checkbox = this.elem('control');

        if (typeof val === 'undefined')
            return checkbox.val();

        checkbox.val(val);

        return this;
    },

    _onClick : function(e) {
        // Нам нужен только клик левой кнопки мыши и нажатие пробела
        if (e.button) return;

        this.isDisabled() || this.setMod('focused', 'yes');
    },

    _onChange : function(e) {
        e.target.checked?
            this.setMod('checked', 'yes') :
            this.delMod('checked');
    }

}, /** @lends Checkbox */{

    live : function() {

        this
            .liveBindTo('click', function(e) {
                this._onClick(e);
            })
            .liveBindTo('control', 'change', function(e) {
                this._onChange(e);
            })
            .liveBindTo('control', 'focusin focusout', function(e) {
                this.setMod('focused', e.type === 'focusin'? 'yes' : '');
            })
            .liveBindTo('mouseover mouseout', function(e) {
                this.isDisabled() ||
                    this.setMod('hovered', e.type === 'mouseover'? 'yes' : '');
            });

        return false;
    }

});

/* ../../libs/bem-components/common.blocks/checkbox/checkbox.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_inline.js begin */
BEM.DOM.decl({ block: 'i-glue-field_type_inline', baseBlock: 'i-glue-field' }, {

    onFieldChange: function(e, data) {
        this.domElem.html(this.model.get(this.name, 'format'));
    }

});

/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_inline.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_input.js begin */
BEM.DOM.decl({ block: 'i-glue-field_type_input', baseBlock: 'i-glue-field' }, {
    onSetMod: {
        js: function() {
            this.__base();
            this.input = this.findBlockOn('input');
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this.input
            .on('change', function() {
                this.model.set(this.name, this.input.val());
            }, this)
            .on('blur', function() {
                this.input.val(this.model.get(this.name, 'format'));
            }, this);
    },

    set: function(value) {
        this.__base();
        this.input.val(value);
    },

    onFieldChange: function(e, data) {
        this.input.getMod('focused') !== 'yes' && this.input.val(data.value);
    }

});

/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_input.js end */
;
/* ../../libs/bem-bl/blocks-common/i-jquery/__leftclick/i-jquery__leftclick.js begin */
/**
 * leftClick event plugin
 *
 * Copyright (c) 2010 Filatov Dmitry (alpha@zforms.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 1.0.0
 */

(function($) {

var leftClick = $.event.special.leftclick = {

    setup : function() {

        $(this).bind('click', leftClick.handler);

    },

    teardown : function() {

        $(this).unbind('click', leftClick.handler);

    },

    handler : function(e) {

        if(!e.button) {
            e.type = 'leftclick';
            $.event.handle.apply(this, arguments);
            e.type = 'click';
        }

    }

};

})(jQuery);
/* ../../libs/bem-bl/blocks-common/i-jquery/__leftclick/i-jquery__leftclick.js end */
;
/* ../../libs/bem-components/common.blocks/input/input.js begin */
(function() {

var instances,
    sysChannel,
    update = function () {
        var instance, i = 0;
        while(instance = instances[i++]) instance.val(instance.elem('control').val());
    },
    getActiveElement = function (doc) {
        // В iframe в IE9: "Error: Unspecified error."
        try { return doc.activeElement } catch (e) {}
    };

/**
 * @namespace
 * @name Block
 */
BEM.DOM.decl('input', /** @lends Block.prototype */ {

    onSetMod : {

        'js' : function() {

            var _this = this,
                input = _this.elem('control'),
                activeElement = getActiveElement(_this.__self.doc[0]),
                haveToSetAutoFocus =
                    _this.params.autoFocus &&
                        !(activeElement && $(activeElement).is('input, textarea'));

            _this._val = input.val();

            if (activeElement === input[0] || haveToSetAutoFocus) {
                _this.setMod('focused', 'yes')._focused = true;
            }

            // факт подписки
            if(!sysChannel) {
                instances = [];
                sysChannel = _this.channel('sys')
                    .on({
                        'tick' : update,
                        'idle' : function() {
                            sysChannel.un('tick', update);
                        },
                        'wakeup' : function() {
                            sysChannel.on('tick', update);
                        }});
            }

            // сохраняем индекс в массиве инстансов чтобы потом быстро из него удалять
            _this._instanceIndex = instances.push(
                _this.bindTo(input, {
                    focus : _this._onFocus,
                    blur  : _this._onBlur
                })
            ) - 1;

            _this
                .on('change', _this._updateClear)
                ._updateClear();

        },

        'disabled' : function(modName, modVal) {

            this.elem('control').attr('disabled', modVal === 'yes');

        },

        'focused' : function(modName, modVal) {

            if(this.hasMod('disabled', 'yes'))
                return false;

            var focused = modVal == 'yes';

            focused?
                this._focused || this._focus() :
                this._focused && this._blur();

            this.afterCurrentEvent(function() {
                this.trigger(focused? 'focus' : 'blur');
            });

        }

    },

    // TODO: вынести в __message
    onElemSetMod : {

        'message' : {

            'visibility' : function(elem, modName, modVal) {

                var _this = this,
                    type = _this.getMod(elem, 'type');

                if(type) {
                    var needSetMod = true;
                    modVal || _this.elem('message', 'type', type).each(function() {
                        this != elem[0] && _this.hasMod($(this), 'visibility', 'visible') && (needSetMod = false);
                    });
                    needSetMod && _this.toggleMod('message-' + type, 'yes', '', modVal === 'visible');
                }

            }

        }

    },

    _onClearClick : function() {

        this.trigger('clear');
        this.removeInsets &&
            this.removeInsets();

        this
            .val('')
            .setMod('focused', 'yes');

    },

    _updateClear : function() {

        return this.toggleMod(this.elem('clear'), 'visibility', 'visible', '', !!this._val);

    },

    isDisabled : function() {

        return this.hasMod('disabled', 'yes');

    },

    /**
     * Возвращает/устанавливает текущее значение
     * @param {String} [val] значение
     * @param {Object} [data] дополнительные данные
     * @returns {String|BEM} если передан параметр val, то возвращается сам блок, если не передан -- текущее значение
     */
    val : function(val, data) {

        if(typeof val == 'undefined') return this._val;

        if(this._val != val) {
            var input = this.elem('control');
            input.val() != val && input.val(val);
            this._val = val;
            this.trigger('change', data);
        }

        return this;

    },

    /**
     * @see http://stackoverflow.com/questions/4185821#4186100
     * @return {Number} Позиция конца выделения. Если ничего не выделено, то возвращается 0.
     */
    getSelectionEnd : function() {
        var input = this.elem('control')[0],
            end = 0;
        if(typeof(input.selectionEnd) == 'number') {
            end = input.selectionEnd;
        } else {
            var range = document.selection.createRange();
            if(range && range.parentElement() == input) {
                var len = input.value.length,
                    textInputRange = input.createTextRange();
                textInputRange.moveToBookmark(range.getBookmark());

                var endRange = input.createTextRange();
                endRange.collapse(false);
                end = textInputRange.compareEndPoints('EndToEnd', endRange) > -1 ?
                    len :
                    -textInputRange.moveEnd('character', -len);
            }
        }
        return end;
    },

    name : function(name) {

        return this.elem('control').attr('name');

    },

    _onFocus : function() {

        this._focused = true;
        return this.setMod('focused', 'yes');

    },

    _onBlur : function() {

        this._focused = false;
        return this.delMod('focused');

    },

    /**
     * Нормализует установку фокуса для IE
     * @private
     */
    _focus : function() {

        var input = this.elem('control')[0];
        if(input.createTextRange && !input.selectionStart) {
            var range = input.createTextRange();
            range.move('character', input.value.length);
            range.select();
        } else {
            input.focus();
        }

    },

    _blur : function() {

        this.elem('control').blur();

    },

    destruct : function() {

        this.__base.apply(this, arguments);

        this.params.shortcut && this.unbindFromDoc('keydown');
        instances.splice(this._instanceIndex, 1);

        var i = this._instanceIndex,
            instance;

        while(instance = instances[i++]) --instance._instanceIndex;

    }

}, {

    live : function() {

        this.liveBindTo('clear', 'leftclick', function() {
            this._onClearClick();
        });

        return false;

    }
});

})();

/* ../../libs/bem-components/common.blocks/input/input.js end */
;
/* ../../libs/bem-bl/blocks-common/i-system/i-system.js begin */
(function() {

var timer,
    counter = 0,
    isIdle = false,
    idleInterval = 0,
    channel = BEM.channel('sys'),
    TICK_INTERVAL = 50;

BEM.decl('i-system', {}, {

    start : function() {

        $(document).bind('mousemove keydown', function() {
            idleInterval = 0;
            if(isIdle) {
                isIdle = false;
                channel.trigger('wakeup');
            }
        });

        this._tick();

    },

    _tick : function() {

        var _this = this;

        channel.trigger('tick', { counter : counter++ });

        if(!isIdle && (idleInterval += TICK_INTERVAL) > 3000) {
            isIdle = true;
            channel.trigger('idle');
        }

        timer = setTimeout(function() {
            _this._tick();
        }, TICK_INTERVAL);

    }

}).start();

})();
/* ../../libs/bem-bl/blocks-common/i-system/i-system.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_select.js begin */
BEM.DOM.decl({ block: 'i-glue-field_type_select', baseBlock: 'i-glue-field' }, {
    onSetMod: {
        js: function() {
            this.__base();
            this.select = this.findBlockOn('select');
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this.select.on('change', function() {
            this.model.set(this.name, this.select.val());
        }, this);
    },

    set: function(value) {
        this.__base();
        this.select.val(value);
    },

    onFieldChange: function(e, data) {
        this.select.getMod('focused') !== 'yes' && this.select.val(data.value);
    }

});

/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_select.js end */
;
/* ../../libs/bem-components/common.blocks/button/button.js begin */
/**
 * @namespace
 * @name Button
 */
BEM.DOM.decl('button', /** @lends Button.prototype */ {

    onSetMod : {

        'js' : function() {

            var disabled = this.isDisabled(),
                domElem = this.domElem;

            (this._href = domElem.attr('href')) && disabled &&
                domElem.removeAttr('href');

            domElem.attr('disabled', disabled);

            this._isFocusable = 'a button'.indexOf(domElem[0].tagName.toLowerCase()) > -1;
        },

        'focused' : {

            'yes' : function() {

                if(this.isDisabled())
                    return false;

                this
                    .bindToWin('unload', function() {
                        this.delMod('focused');
                    })
                    .bindTo('keydown', this._onKeyDown);

                this._isFocusable && (this._isControlFocused() || this.domElem.focus());

                this.afterCurrentEvent(function() {
                    this.trigger('focus');
                });

            },

            '' : function() {

                this
                    .unbindFromWin('unload')
                    .unbindFrom('keydown');

                this._isFocusable && this._isControlFocused() && this.domElem.blur();

                this.afterCurrentEvent(function() {
                    this.trigger('blur');
                });

            }

        },

        'disabled' : function(modName, modVal) {

            var disable = modVal == 'yes',
                domElem = this.domElem;

            this._href && (disable?
                domElem.removeAttr('href') :
                domElem.attr('href', this._href));

            disable && domElem.keyup();

            this.afterCurrentEvent(function() {
                domElem.attr('disabled', disable);
            });

        },

        'pressed' : function(modName, modVal) {

            this.setMod('focused', 'yes');

            this.isDisabled() || this.trigger(modVal == 'yes' ? 'press' : 'release');

        },

        'hovered' : {

            '' : function() {

                this.delMod('pressed');

            }

        },

        '*' : function(modName) {

            if(this.isDisabled() && 'hovered pressed'.indexOf(modName) > -1)
                return false;

        }

    },

    /**
     * Шорткат для проверки модификатора disabled_yes
     * @returns {Boolean}
     */
    isDisabled : function() {

        return this.hasMod('disabled', 'yes');

    },

    /**
     * Получение/установка урла (для кнопки-ссылки)
     * @param {String} [val] урл
     */
    url : function(val) {

        if(typeof val == 'undefined') {
            return this._href;
        } else {
            this._href = val;
            this.isDisabled() || this.domElem.attr('href', val);
            return this;
        }

    },

    /**
     * Проверяет в фокусе ли контрол
     * @private
     * @returns {Boolean}
     */
    _isControlFocused : function() {

        try {
            return this.containsDomElem($(document.activeElement));
        } catch(e) {
            return false;
        }

    },

    _onKeyDown : function(e) {

        var keyCode = e.keyCode;
        // имитируем state_pressed по нажатию на enter и space
        if((keyCode == 13 || keyCode == 32) && !this._keyDowned) {
            this._keyDowned = true;
            this
                .setMod('pressed', 'yes')
                .bindTo('keyup', function() {
                    this
                        .delMod('pressed')
                        .unbindFrom('keyup');

                    delete this._keyDowned;

                    // делаем переход по ссылке по space
                    if(keyCode == 32 && this.domElem.attr('href')) {
                        document.location = this.domElem.attr('href');
                    }
                });
        }

    },

    _onClick : function(e) {
        this.isDisabled()?
            e.preventDefault() :
            this.afterCurrentEvent(function() {
                this.trigger('click');
            });
    },

    destruct : function () {

        this.delMod('focused');
        this.__base.apply(this, arguments);

    }

}, /** @lends Button */ {

    live : function() {

        var eventsToMods = {
            'mouseover' : { name : 'hovered', val : 'yes' },
            'mouseout' : { name : 'hovered' },
            'mousedown' : { name : 'pressed', val : 'yes' },
            'mouseup' : { name : 'pressed' },
            'focusin' : { name : 'focused', val : 'yes' },
            'focusout' : { name : 'focused' }
        };

        this
            .liveBindTo('leftclick', function(e) {
                this._onClick(e);
            })
            .liveBindTo('mouseover mouseout mouseup focusin focusout', function(e) {
                var mod = eventsToMods[e.type];
                this.setMod(mod.name, mod.val || '');
            })
            .liveBindTo('mousedown', function(e) {
                var mod = eventsToMods[e.type];
                e.which == 1 && this.setMod(mod.name, mod.val || '');

                // отменяем blur после mousedown, если кнопка в фокусе
                this._isControlFocused() && e.preventDefault();
            });
    }

});

/* ../../libs/bem-components/common.blocks/button/button.js end */
;
/* ../../ya-libs/islands-components/common.blocks/popup/popup.js begin */
(function($) {

var KEYDOWN_EVENT = ($.browser.opera && $.browser.version < 12.10)? 'keypress' : 'keydown',
    /**
     * Шоткаты для некоторых методов
     */
    hasOwn = Object.prototype.hasOwnProperty,

    // NOTE: Используется _generateDirections
    generateDirectionsCache;

/**
 @namespace JS-API блока popup
 @name block */

BEM.DOM.decl('popup',  /** @lends block.prototype */ {

    /**
     * @protected
     * @return {Object} Параметры блока по-умолчанию
     */
    getDefaultParams : function() {

        var tailOffset = {
                left: 15,
                right: 15,

                top: 15,
                bottom: 15
            };

        return {
            directions: [ // FIXME: Острова 2.0 выпилить в пользу _generateDirections при мердже параметров
                {
                    to: 'bottom',
                    axis: 'center',
                    tail: { axis: 'center' }
                },
                {
                    to: 'top',
                    axis: 'center',
                    tail: { axis: 'center' }
                },
                {
                    to: 'right',
                    axis: 'middle',
                    tail: { axis: 'middle' }
                },
                {
                    to: 'left',
                    axis: 'middle',
                    tail: { axis: 'middle' }
                }
            ],
            tail: {
                // Размеры указываются такими, какими они будут если попап будет открыт вниз
                // Тоесть хвост будет наверху
                // В направлениях left, right они свапаются
                width: 24.04,
                height: 12.02,
                offset: tailOffset
            },
            duration: 150
        };

    },

    onSetMod : {

        'js' : function() {

            /**
             * Кэш размеров и позиций
             * @private
             * @type {Object}
             */
            this._cache = { };

            /**
             * Вьюпорт для попапа, в котором он должен быть виден(DOM-нода или window)
             * Блок будет менять направление раскрытия на наилучшее по фактору попадания в _viewport
             * @private
             */
            this._viewport = this.__self.win;

            /**
             * Ссылка на скоуп (по умолчанию `body`)
             * Когда блок показывается он смотрит, является ли он последним
             * потомком скоупа
             * @private
             * @type {BEM}
             */
            this._scope = BEM.DOM.scope;

            /**
             * Канал для управления всеми открытыми блоками на странице
             * @private
             */
            this._channel = BEM.channel('popups');

            /**
             * Перенесен ли попап в контейнер
             * По умолчанию все попапы переносятся в скоуп (`body` или `div`),
             * но есть исключения. Например, фиксированный попап.
             * Если блок обнаруживает, что его родитель — фиксированный попап,
             * то он переместит себя внутрь элемента `content` родителя
             * @private
             * @type {Boolean}
             */
            this._inContainer = null;

            /**
             * У родительского попапа фиксированное позиционирование?
             * @private
             * @type {Boolean}
             */
            this._isParentFixed = false;

            /**
             * DOM-элемент, для которого открывается блок
             * @private
             * @type {jQuery}
             */
            this._owner = null;

            /**
             * Переданные пользователем координаты для отображения блока
             * @private
             * @type {Object}
             */
            this._userPosition = null;

            /**
             * Родитель блока
             * @private
             * @type {BEM}
             */
            this._parent = null;

            /**
             * Потомки блока
             * @private
             * @type {Array}
             */
            this._childs = [ ];

            /**
             * Состояние видимости
             * @private
             * @type Boolean
             */
            this._isShown = false;

            /**
             * Находится ли блок в состоянии анимированного скрытия
             * (Анимация асинхронна)
             * @private
             * @type {Boolean}
             */
            this._isHiding = false;

            /**
             * Посчитанные позиции блока на странице(без учета полного помещения во вьюпорт)
             * @private
             * @type {Object}
             */
            this._positions = { };

            /**
             * Содержит текущую позицию, которая была рассчитана или передана пользователем явно
             * @private
             * @type {Object}
             */
            this._currPos = { };

            /**
             * Текущий показатель видимости
             * @private
             * @type {Nubmer}
             */
            this._visibilityFactor = null;

            /**
             * Направление раскрытия
             * @private
             * @type {Boolean|Object}
             */
            this._direction = false;

            /**
             * Направления открытия блока
             * @private
             * @type {Object}
             */
            this._directions = { };

            var defaultParams = this.getDefaultParams(),
                userParams = this.params,

                defaults = this._repackDirParams(defaultParams.directions),
                user = this._repackDirParams(userParams.generateDirections? this._generateDirections : userParams.directions);
                // FIXME: Острова 2.0
                // Если направления не указаны, то вызываем _generateDirections не смотря на наличие
                // userParams.generateDirections

            userParams.tail &&
                (this.params.tail = this._mergeParams(defaultParams.tail, userParams.tail, {
                    offset: this._offsetParamsHook
                }));

            /**
             * Направления открытия блока по приоритету
             * @private
             * @type {Array[String]}
             */
            this._order = user.keys.map(function(key) {
                var userDirection = user.directions[key],
                    defaultDirection = defaults.directions[key];

                defaultDirection ||
                    (defaultDirection = defaults.directions[userDirection.to]);

                this._directions[key] = this._mergeParams(defaultDirection, userDirection, {
                    offset: this._offsetParamsHook,
                    tail: this._tailParamsHook
                });

                return key;

            }, this);

        },

        'visibility' : {

            'visible' : function() {
                this._onShown();
            },

            '' : function() {
                this._onHidden();
            }

        }

    },

    /**
     * Показывает блок
     * @protected
     * @param {Object|jQuery} params - принимает объект с параметрами
     * @return {BEM}
     */
    show : function(params) {

        var owner;

        if(params instanceof BEM) {
            owner = params.domElem;
        } else if(params instanceof $) {
            owner = params;
        } else if(!params) {
            return;
        }

        /**
         * NOTE: Если нет `owner`, то в `params` хэш с left, top
         */
        if(owner) {
            if(this._owner && owner[0] !== this._owner[0]) {
                this.delMod('visibility');
            }

            this._owner = owner;

            var parent = this.findBlockOutside(owner, 'popup');
            parent && this.setParent(parent);
        } else {
            this._userPosition = params;
        }

        /**
         * NOTE: Необходимо показать блок для подсчета его размеров
         */
        return this.setMod('visibility', 'outside').repaint();

    },

    /**
     * Скрывает блок
     * @protected
     * @return {BEM}
     */
    hide : function() {

        if(this._isHiding) {
            return this;
        }

        if(this._isShown) {
            this._isHiding = true;

            this._childs.forEach(function(child) {
                child.hide();
            });

            if(this.hasMod('animate', 'yes') && !this.hasMod('fade-out', 'no')) {
                var _this = this;

                this.beforeHide(function() {
                    _this.delMod('visibility');
                });

                return this;
            }
        }

        return this.delMod('visibility');

    },

    /**
     * Показывает/скрывает блок в зависимости от текущего состояния
     * @protected
     * @param {jQuery|Object} [owner] DOM-элемент или координаты { left : x, top : y },
     * относительно которых рассчитывается положение
     */
    toggle : function(owner) {

        return this._isShown && !this._isHiding?
            this.hide() :
            this.show(owner || this._owner);

    },

    /**
     * Перерисовывает блок с перерасчетом позиции
     * @protected
     * @return {BEM}
     */
    repaint : function() {

        this._moveToContainer();

        var direction = this._pickDirection();

        this.setMod('to', direction.to)
            ._show(
                this._positions[direction.key],
                this._tailPos && this._tailPos[direction.key]);

        return this;

    },

    /**
     * Возвращает текущую позицию блока
     * @protected
     * @return {Object} Объект с координатами `left`, `top`
     */
    getCurrPos :  function() {
        return this._currPos;
    },

    /**
     * Возвращает настройки текущего направления раскрытия
     * @protected
     * @return {Object|Boolean} Возвращает `false` если направление небыло рассчитано
     * или у этого блока нет направления(пример: popup_position_fixed)
     */
    getCurrDirection : function() {
        return this._direction;
    },

    /**
     * Устанавливает контент блока
     * @protected
     * @param {String|jQuery} content контент
     * @return {BEM}
     */
    setContent : function(content) {

        BEM.DOM.update(this.elem('content'), content);
        this._isShown && this.repaint();

        return this;

    },

    /**
     * Видим ли на данный момент блок
     * По сути шоткат для hasMod('visibility', 'visible')
     * @protected
     * @return {Boolean}
     */
    isShown : function() {
        return this._isShown;
    },

    /**
     * Устанавливает родителя этого блока
     * @protected
     * @param {BEM} - родитель
     * @return {BEM}
     */
    setParent : function(parent) {
        this._parent = parent;

        this._isParentFixed = parent.hasMod('position', 'fixed');

        parent.addChild(this);

        return this;
    },

    /**
     * Добавляет потомка этого блока
     * @protected
     * @param {BEM} - потомок
     */
    addChild : function(child) {

        var len = this._childs.length,
            i;

        for(i = 0; i < len; i++) {
            if(this._childs[i]._uniqId == child._uniqId) {
                return;
            }
        }

        this._childs.push(child);

        child.on('hide', function() {
            this.removeChild(child);
        }, this);

    },

    /**
     * Удаляет связь блока с потомком
     * @protected
     * @param {BEM} - потомок
     */
    removeChild : function(child) {

        var len = this._childs.length,
            i;

        for(i = 0; i < len; i++) {
            if(this._childs[i]._uniqId == child._uniqId) {
                this._childs.splice(i, 1);
                break;
            }
        }

    },

    /**
     * Делает блок видимым
     * @private
     * @param {Object} position - CSS-свойства, описывающие положение popup
     * @param {Object} [tailPos] - CSS-свойства, описывающие положение хвоста
     * @return {BEM}
     */
    _show : function(position, tailPos) {

        this._currPos = position;

        tailPos &&
            this.elem('tail').removeAttr('style').css(tailPos);

        this.domElem.css(position);

        (!this._isShown || this._isHiding) &&
            (this.hasMod('animate', 'yes') && !this.hasMod('fade-in', 'no')) &&
                this.afterShow();

        this._isHiding = false;
        this.setMod('visibility', 'visible');

        return this;
    },

    /**
     * Обработчик показа блока
     * @private
     */
    _onShown : function() {

        this.bindToDoc(KEYDOWN_EVENT, function(e) {
            if (e.which === 27) {
                $(this.__self.doc[0].activeElement).blur();
                this.hide();
            }
        });

        this._attachUnder();

        this._isShown = true;

        /**
         * Нужно чтобы предотвратить мгновенное закрытие
         * фиксированного попапа с паранджой, если он открылся
         * по событию на кнопке, например
         */
        this.hasMod('autoclosable', 'yes') &&
            this.afterCurrentEvent(function() {
                this._enableAutoclosable();
            });

        this.hasMod('adaptive', 'yes') &&
            this._enableAdaptive();

        var bro = $.browser;

        // LEGO-9381
        if(bro.msie && parseInt(bro.version, 10) >= 9) {
            var nodes = [ this.domElem, this.elem('content') ],
                zIndexes = nodes.map(function(node) {
                    return parseInt(node.css('z-index'), 10) || '';
                });

            this.domElem[0].onresize = function() {
                nodes.forEach(function(node, i) {
                    node.css('z-index', zIndexes[i] + 1);
                });

                setTimeout(function() {

                    nodes.forEach(function(node, i) {
                        node.css('z-index', zIndexes[i]);
                    });

                }, 0);
            };
        }

        this._channel.on('hide', this.hide, this);

        this.trigger('show');

    },

    /**
     * Обработчик скрытия блока
     * @private
     */
    _onHidden : function() {

        this.unbindFromDoc(KEYDOWN_EVENT);

        this._detachUnder();

        this.hasMod('autoclosable', 'yes') &&
            this._disableAutoclosable();

        this.hasMod('adaptive', 'yes') &&
            this._disableAdaptive();

        this._cache = { };
        this._isShown = false;
        this._isHiding = false;

        var bro = $.browser;

        // LEGO-9381
        if(bro.msie && parseInt(bro.version, 10) >= 9) {
            this.domElem[0].onresize = null;
        }

        this._channel.un('hide');

        this.trigger('hide');

    },

    /**
     * DeepMerge для доопределения параметров блока
     * Доопределяет дефолтные параметры пользовательскими
     * @private
     * @param {Object} defaultParams
     * @param {Object} userParams
     * @param {Object} hooks - список хуков, которые могут быть
     * задействованы в процессе слияния хэшей. Хук будет вызван
     * при совпадении его ключа с ключем во вливаемом хэше
     * @return {Object}
     */
    _mergeParams : function(defaultParams, userParams, hooks) {

        var res = { };

        hooks || (hooks = { });

        defaultParams && typeof defaultParams == 'object' &&
            Object.keys(defaultParams).forEach(function (key) {
                res[key] = defaultParams[key];
            });

        Object.keys(userParams).forEach(function (key) {
            var hookRes = hasOwn.call(hooks, key)?
                    hooks[key].call(this, defaultParams[key], userParams[key]) :
                    userParams[key];

                res[key] = !hookRes || typeof hookRes != 'object' || Array.isArray(hookRes)?
                    hookRes :
                    defaultParams[key]?
                        this._mergeParams(defaultParams[key], hookRes, hooks) :
                        hookRes;
        }, this);

        return res;
    },

    /**
     * Обработчик для поля `offset` в параметрах направлений раскрытия
     * @private
     * @param {*} defaultParams
     * @param {*} userParams
     * @return {*} userParams
     */
    _offsetParamsHook : function(defaultParams, userParams) {

        return typeof userParams == 'number'? {
                top: userParams,
                bottom: userParams,

                left: userParams,
                right: userParams
            } :
            userParams;

    },

    /**
     * Обработчик для поля `tail` в параметрах направлений раскрытия
     * Отвечает за наследование дефолтных отступов для элемента `tail`
     * @private
     * @param {*} defaultParams
     * @param {*} userParams
     * @return {*} userParams
     */
    _tailParamsHook : function(defaultParams, userParams) {

        userParams.offset ||
            (userParams.offset = this.params.tail.offset);

        return userParams;

    },

    /**
     * Генерирует список возможных направлений раскрытия
     * Потребность возникла для popup в произвольном месте страницы
     * из-за необходимости показывать его с наибольшим попаданием во viewport
     * ISLCOMPONENTS-106
     * @private
     * @returns [Array{Object}]
     */
    _generateDirections: function() {
        if(generateDirectionsCache) return generateDirectionsCache;

        var directions = [
                [ 'bottom', 'top' ], [ 'left', 'right' ]
            ],
            axises = [
                [ 'center', 'left', 'right' ],
                [ 'middle', 'top', 'bottom' ]
            ],
            tailAxises = axises,
            directionsLen = directions.length,
            res = [ ];

        for(var tier = 0; tier < directionsLen; tier++) {
            var directionsTier = directions[tier],
                tierLen = directionsTier.length;

            for(var j = 0; j < tierLen; j++) {
                var axisesTier = axises[tier],
                    axisesTierLen = axisesTier.length;

                for(var k = 0; k < axisesTierLen; k++) {
                var tailAxisesTier = tailAxises[tier],
                    tailAxisesTierLen = tailAxisesTier.length;

                    for(var l = 0; l < tailAxisesTierLen; l++) {
                        res.push({
                            direction: directionsTier[j],
                            axis: axisesTier[k],
                            tail: {
                                axis: tailAxisesTier[l]
                            }
                        });
                    }
                }
            }
        }

        return generateDirectionsCache = res;

    },

    /**
     * Переупаковывает настройки направлений из массива в объект
     * @private
     * @param {Array} dirParams
     * @return {Object.directions} Направления раскрытия
     * @return {Object.keys} Массив ключей направлений по убыванию приоритета
     */
    _repackDirParams : function(dirParams) {

        // XXX: Нужно как-то упростить этот метод
        // возможно через внесение некой внутренней терминологии

        var directions = { },
            keys = [ ];

        /**
         * 'bottom-left'
         * { to: 'bottom' }
         */
        (typeof dirParams == 'string' || $.isPlainObject(dirParams)) &&
            (dirParams = [ dirParams ]);

        keys = dirParams.map(function(direction) {

            /**
             * [ 'bottom', 'top' ]
             */
            if(typeof direction == 'string') {
                var keys = direction.split('-');

                direction = { to: keys[0], tail: { } };
                keys[1] && (direction.axis = keys[1]);
                keys[2] && (direction.tail.axis = keys[2]);
            }

            var key = direction.to;

            directions[key] ||
                (directions[key] = direction);

            direction.axis &&
                (key += '-' + direction.axis);

            direction.key = key;
            directions[key] = direction;

            return key;

        }, this);

        return { directions: directions, keys: keys };

    },

    /**
     * Устанавливает элемент для рассчета фактора попадания. НЕ вызывает перерисовку
     * LEGO-10199
     * @param {jQuery} viewport
     * @returns {BEM}
     */
    setViewport : function(viewport) {
        this._viewport = viewport;
        return this;
    },

    /**
     * Выбирает направление для раскрытия
     * @private
     * @return {Object} Направление раскрытия
     */
    _pickDirection : function() {

        // FIXME: Подумать как можно красивее и правильней реализовать этот метод

        var order = this._order,
            len = this.hasMod('adaptive', 'yes')? order.length : 1,
            i;

        /**
         * NOTE: Нужно обнулить, потомучто мы не знаем на сколько изменилось окно браузера
         */
        this._visibilityFactor = 0;

        for(i = 0; i < len; i++) {
            var key = order[i],
                direction = this._directions[key];

            this
                ._resetPos(key)
                ._pushPos(key, this._calcPos(direction))
                ._pushPos(key, this._calcOffsets(direction));

            this._hasTail() &&
                this
                    ._resetTailPos(key)
                    ._pushTailPos(key, this._calcTailPos(direction))
                    ._pushTailPos(key, this._calcTailOffset(direction))
                    ._pushPos(key, this._calcOffsetByTail(direction));

            this._pushPos(key, this._getParentOffset());

            var visibilityFactor = this._calcVisibilityFactor(direction);

            if(visibilityFactor > this._visibilityFactor || !this._direction) {
                this._visibilityFactor = visibilityFactor;
                this._direction = this._directions[key];

                if(visibilityFactor == 100) {
                    break;
                }
            }

        }

        return this._direction;

    },

    /**
     * Если у родительского элемента есть смещение, то возвращает его
     * Относительное позиционирование ломает отображение если у body есть margin, например
     * LEGO-8709
     * @private
     * @return {Object}
     */
    _getParentOffset : function() {

        var offset = this.domElem.offsetParent().offset();
            //position = parent.position();

        //if(position.left > 0 && position.top > 0) {
            /**
             * NOTE: Фикс для IE7, в котором offset() при наличии margin удваивается о_О
             * а position при этом больше 0
             */
            //offset.left = position.left;
            //offset.top = position.top;
        //}

        offset.left *= -1;
        offset.top *= -1;

        return offset;

    },

    /**
     * Подсчитывает позицию блока в указанном направлении
     * @private
     * @param {Object} direction - параметры открытия блока
     * @return {Object}
     */
    _calcPos : function(direction) {

        var ownerPos = this.getOwnerPos(),
            ownerSize = this.getOwnerSize(),

            popupSize = this.getPopupSize(),

            axis = direction.axis,

            userPos = this.params.position || { },

            position = { };


        switch(direction.to) {
            case 'bottom' :
                position = {
                    top: hasOwn.call(userPos, 'top')?
                        userPos.top :
                        ownerPos.top + ownerSize.height,
                    left: hasOwn.call(userPos, 'left')?
                        userPos.left :
                        this._calcLeft(axis)
                };

                break;

            case 'top' :
                position = {
                    top: hasOwn.call(userPos, 'top')?
                        userPos.top :
                        ownerPos.top - popupSize.height,
                    left: hasOwn.call(userPos, 'left')?
                        userPos.left :
                        this._calcLeft(axis)
                };

                break;

            case 'left' :
                position = {
                    top: hasOwn.call(userPos, 'top')?
                        userPos.top :
                        this._calcTop(axis),
                    left: hasOwn.call(userPos, 'left')?
                        userPos.left :
                        ownerPos.left - popupSize.width
                };

                break;

            case 'right' :
                position = {
                    top: hasOwn.call(userPos, 'top')?
                        userPos.top :
                        this._calcTop(axis),
                    left: hasOwn.call(userPos, 'left')?
                        userPos.left :
                        ownerPos.left + ownerSize.width
                };

                break;

        }

        return position;

    },

    /**
     * Подсчитывает вертикальную координату по оси
     * @private
     * @param {String} axis - имя оси для рассчетов
     * @return {Number}
     */
    _calcTop : function(axis) {

        var top = 0,
            popupSize = this.getPopupSize(),
            ownerPos = this.getOwnerPos(),
            ownerSize = this.getOwnerSize();

        if(axis == 'top') {
            top += ownerPos.top;
        } else if(axis == 'middle') {
            top += (ownerPos.top + ownerSize.height / 2) - popupSize.height / 2;
        } else if(axis == 'bottom') {
            top += (ownerPos.top + ownerSize.height) - popupSize.height;
        }

        return top;

    },

    /**
     * Подсчитывает горизонтальную координату по оси
     * @private
     * @param {String} axis - имя оси для рассчетов
     * @return {Number}
     */
    _calcLeft : function(axis) {

        var left = 0,
            popupSize = this.getPopupSize(),
            ownerPos = this.getOwnerPos(),
            ownerSize = this.getOwnerSize();

        if(axis == 'left') {
            left += ownerPos.left;
        } else if(axis == 'center') {
            left += (ownerPos.left + ownerSize.width / 2) - popupSize.width / 2;
        } else if(axis == 'right') {
            left += (ownerPos.left + ownerSize.width) - popupSize.width;
        }

        return left;

    },

    /**
     * Подсчитывает и кэширует смещение блока по указанным параметрам
     * @private
     * @param {Object} direction
     * @return {Object} Отступы
     */
    _calcOffsets : function(direction) {

        var cache = this._cache.offset || (this._cache.offset = { }),
            key = direction.key,
            offsetParams = direction.offset,
            offset;

        if(cache[key]) {
            return cache[key];
        }

        if(!offsetParams) {
            return false;
        }

        offset = {
            left: 0,
            top: 0
        };

        offsetParams.left &&
            (offset.left += offsetParams.left);
        offsetParams.right &&
            (offset.left -= offsetParams.right);

        offsetParams.top &&
            (offset.top += offsetParams.top);
        offsetParams.bottom &&
            (offset.top -= offsetParams.bottom);

        return cache[key] = offset;

    },

    /**
     * Проверяет, есть ли у блока хвост
     * @private
     * @return {Boolean}
     */
    _hasTail : function() {
        return this.elem('tail').length !== 0;
    },

    /**
     * Перемещает попап в конец скоупа
     * По умолчанию это скоуп (`body` или `div`), но наш родитель — модальное окно
     * (фиксированный попап), то контейнером будет он
     *
     * @param {jQuery} [container] — Контейнер для блока
     * @private
     */
    _moveToContainer : function(container) {

        container ||
            (container = this._parent? this._parent.domElem : this._scope);

        this._inContainer?
            container.children(':last')[0] === this.domElem[0] ||
                this.domElem.appendTo(container) :
            this._inContainer = !!this.domElem.appendTo(container);

    },

    /**
     * Обнуляет позицию во внутреннем хранилище
     * @private
     * @param {String} key - ключ позиции
     * @return {BEM}
     */
    _resetPos : function(key) {

        key?
            this._positions[key] = null :
            this._positions = { };

        return this;
    },

    /**
     * Смещает начало координат на указанную величину
     * @param {Object} target - Координаты, к которым применяется смещение
     * @param {String} [key] - Уникальный ключ направления
     * @param {Object} offset - Объект, описывающий позицию для смещения
     */
    _pushPosTo : function(target, key, offset) {

        if(offset === false) {
            return;
        }

        if(typeof key == 'string') {
            this._sum(target[key] || (target[key] = { }), offset);
        } else {
            offset = key;

            Object.keys(target).forEach(function(key) {
                this._sum(target[key], offset);
            }, this);
        }

    },

    /**
     * Смещает позицию блока на указанные во втором аргументе координаты с учётом текущей позиции
     * @param {String} [key] - Уникальный ключ направления
     * @param {Object} offset - Объект, описывающий позицию для смещения
     * @return {BEM}
     */
    _pushPos : function(key, offset) {

        this._pushPosTo(this._positions, key, offset);

        return this;

    },

    /**
     * Складывает числовые значения в объектах
     * @private
     * @param {Object} source - Объект с исходными числами
     * @param {Object} adds - Объект с прибавляемыми числами
     */
    _sum : function(source, adds) {

        Object.keys(adds).forEach(function(key) {
            source[key] = (source[key] || 0) + adds[key];
        });

    },

    /**
     * Получает размер указанного DOM-элемента
     * @private
     * @param {jQuery} domElem
     * @return {Object}
     */
    _getSizeOf : function(domElem) {

        return {
            height: domElem.outerHeight(),
            width: domElem.outerWidth()
        };

    },

    /**
     * Получает и кэширует размер owner
     * @protected
     * @return {Object}
     */
    getOwnerSize : function() {

        return this._owner?
            this._cache.ownerSize ||
                (this._cache.ownerSize = this._getSizeOf(this._owner)) :
            {
                height: 0,
                width: 0
            };

    },

    /**
     * Получает и кэширует размер popup
     * @protected
     * @return {Object}
     */
    getPopupSize : function() {

        return this._getSizeOf(this.domElem);

    },

    /**
     * Получает позицию указанного DOM-элемента
     * @private
     * @param {jQuery} domElem
     * @return {Object}
     */
    _getPosOf : function(domElem) {

        /**
         * XXX: Если брать offset window, то возвращается null
         */
        return domElem.offset() || {
            left: 0,
            top: 0
        };

    },

    /**
     * Получает позицию owner
     * @protected
     * @return {Object}
     */
    getOwnerPos : function() {

        var pos;

        if(this._owner) {

            pos = this._getPosOf(this._owner);

            if(this.hasMod('position', 'fixed')) {
                var viewport = this._viewport;

                pos.top -= viewport.scrollTop();
                pos.left -= viewport.scrollLeft();
            }
        }

        return pos || this._userPosition;

    },

    /**
     * Подсчитывает "видимость" блока на странице
     * @private
     * @param {Object} direction - параметры направления раскрытия
     * @return {Number}
     */
    _calcVisibilityFactor : function(direction) {

        var viewport = this._viewport,
            viewportSize = this._getSizeOf(viewport),
            popupSize = this.getPopupSize(),
            popupPos = this._positions[direction.key],

            parentOffset = this._parent? this._parent.domElem.offset() : {
                top: 0,
                left: 0
            },

            top = popupPos.top + (this._isParentFixed? parentOffset.top : -viewport.scrollTop()),
            left = popupPos.left + (this._isParentFixed? parentOffset.left : -viewport.scrollLeft()),
            right = (left + popupSize.width) - viewportSize.width,
            bottom = (top + popupSize.height) - viewportSize.height,

            visibleRect = {
                height: popupSize.height,
                width: popupSize.width
            },

            popupArea,
            visibleArea,
            visibility = 100;

        bottom > 0 &&
            (visibleRect.height -= bottom);

        top < 0 &&
            (visibleRect.height += top);

        left < 0 &&
            (visibleRect.width += left);

        right > 0 &&
            (visibleRect.width -= right);


        if(visibleRect.height < 0 || visibleRect.width < 0) {
            visibility = 0;
        } else {
            visibleArea = Math.abs(visibleRect.height * visibleRect.width);
            popupArea = popupSize.height * popupSize.width;

            popupArea != visibleArea &&
                (visibility = (visibleArea / popupArea) * 100);
        }

        return visibility;

    },

    destruct : function() {

        var args = arguments;

        this._channel.un('hide');

        this._childs.forEach(function(child) {
            child.destruct.apply(child, args);
        });

        return this.__base.apply(this, args);

    }

}, /** @lends block */ {

    live : function() {

        this.liveBindTo('close', 'leftclick', function() {
            this.hide();
        });

    }

});

})(jQuery);

/* ../../ya-libs/islands-components/common.blocks/popup/popup.js end */
;
/* ../../ya-libs/islands-components/common.blocks/popup/_autoclosable/popup_autoclosable_yes.js begin */
BEM.DOM.decl({
    block: 'popup',
    modName: 'autoclosable',
    modVal: 'yes'
}, {

    'onSetMod' : {
        'autoclosable' : {
            '' : function() {
                this._disableAutoclosable();
            }
        }
    },

    /**
     * Биндится на события, прячет блок при клике по не связанных жлементам\блокам
     * @private
     */
    _enableAutoclosable : function() {

        var under = this._under;

        if(this.hasMod(under, 'type', 'paranja')) {
            /*
             * NOTE: contentWindow, contentWindow.document для разных браузеров
             * Некоторые не обрабатывают клик на contentWindow
             * Отписываться от события leftclick здесь не нужно
             */
            under.is('iframe') &&
                (under = $([under[0].contentWindow, under[0].contentWindow.document]));

            this.bindTo(under, 'leftclick tap', function(e) {
                e.stopPropagation();
                this.hide();
            });
        }

        this.bindToDoc('leftclick tap', function(domEvent) {
            if(this._isRelatedNode($(domEvent.target))) {
                return;
            }

            var e = $.Event('outside-click');
            this.trigger(e, domEvent);
            e.isDefaultPrevented() || this.hide();
        });

    },

    /**
     * Отписывается от событий
     * @private
     */
    _disableAutoclosable : function() {

        this.hasMod(this._under, 'type', 'paranja') &&
            this.unbindFrom(this._under, 'leftclick tap');

        this.unbindFromDoc('leftclick tap');

    },

    /**
     * Проверяет, является ли нода родственной
     * Метод ищет в потомках блока, owner и самом себе
     * Применяется для предотвращения закрытия блока при
     * клике на родственных ему блоках\элементах
     * @private
     * @param {jQuery} node - что искать
     * @return {Boolean}
     */
    _isRelatedNode : function(node) {
        if(this.containsDomElem(node) || this._owner && this.containsDomElem.call({ // FIXME: container arg
            domElem: this._owner
        }, node)) {
            return true;
        }

        var len = this._childs.length,
            i;

        for(i = 0; i < len; i++) {
            if(this.containsDomElem.call({ // FIXME: container arg
                domElem: this._childs[i].domElem
            }, node)) {
                return true;
            }
        }

        return false;
    }

});

/* ../../ya-libs/islands-components/common.blocks/popup/_autoclosable/popup_autoclosable_yes.js end */
;
/* ../../ya-libs/islands-components/common.blocks/popup/_adaptive/popup_adaptive_yes.js begin */
BEM.DOM.decl({
    block: 'popup',
    modName: 'adaptive',
    modVal: 'yes'
}, {

    onSetMod : {

        'adaptive' : {
            'yes' : function() {
                this._enableAdaptive();
            },

            'no' : function() {
                this._disableAdaptive();
            }
        },

        'watch-scroll' : {
            'yes' : function() {
                this._watchScroll();
            },
            'no' : function() {
                this._unwatchScroll();
            }
        },

        'visibility' : {
            'visible' : function() {

                this.__base();

                this.hasMod('adaptive', 'yes') &&
                    this._enableAdaptive();
            },

            '' : function() {

                this.__base();

                this._disableAdaptive();
            }
        }

    },

    /**
     * Включает адаптивность блока
     * @private
     */
    _enableAdaptive : function() {

        this.bindToWin('resize', this.onResize)
            ._watchScroll();

    },

    /**
     * Отключает адаптивность блока
     * @private
     */
    _disableAdaptive : function() {

        this.unbindFromWin('resize')
            ._unwatchScroll();

    },

    /**
     * Возвращает массив с именами событий скрола
     * Сделал так для удобного доопределения с уровня тачей
     * @public
     * @returns {Array}
     */
    getScrollEvents : function() {
        return [ 'scroll' ];
    },

    /**
     * Подписывается на событие scroll если у блока отстутствует модификатор
     * watch-scroll_no
     * @private
     */
    _watchScroll : function() {

        if(this._owner && !this.hasMod('watch-scroll', 'no')) {
            this.bindTo(
                this._owner.parents().add(this._viewport),
                this.getScrollEvents().join(' '),
                this.onScroll,
                this);
        }

    },

    /**
     * Отписывается от получения событий scroll
     * @private
     */
    _unwatchScroll : function() {

        this._owner &&
            this.unbindFromDomElem(
                this._owner.parents().add(this._viewport),
                this.getScrollEvents().join(' '));

    },

    /**
     * Обработчик события resize
     * Подчищает кэши, инициирует перерисовку блока
     * @param {Event} e
     * @public
     */
    onResize : function(e) {

        this._cache = { };

        this._isHiding || this.repaint();

    },

    /**
     * Обработчик события scroll
     * Подчищает кэши, инициирует перерисовку блока
     * @param {Event} e
     * @public
     */
    onScroll : function(e) {

        this._cache = { };

        this._isHiding || this.repaint();

    },

    destruct : function() {
        this._disableAdaptive();
        this.__base.apply(this, arguments);
    }

});

/* ../../ya-libs/islands-components/common.blocks/popup/_adaptive/popup_adaptive_yes.js end */
;
/* ../../ya-libs/islands-components/common.blocks/popup/_animate/popup_animate_yes.js begin */
BEM.DOM.decl({
    block: 'popup',
    modName: 'animate',
    modVal: 'yes'
}, {

    /**
     * Выполняется при показе блока(когда модификатор visibility_visible уже установлен)
     * Позволяет реализовать эффекты для вывода блока
     * @public
     */
    afterShow : function() {

        var direction = this.getCurrDirection();

        if(!direction) {
            return;
        }

        var to = direction.to,
            position = this.getCurrPos(),
            popupSize = this.getPopupSize(),
            tailOpts = this.params.tail,
            animateOpts = {
                opacity: 1,
                top: position.top,
                left: position.left
            },
            cssOpts = {
                opacity: 0,
                top: position.top,
                left: position.left
            };

        if(to == 'bottom') {
            cssOpts.top += 10;
        } else if(to == 'top') {
            cssOpts.top -= 10;
        } else if(to == 'left') {
            cssOpts.left -= 10;
        } else if(to == 'right') {
            cssOpts.left += 10;
        }

        this
            .domElem
            .stop(true) // NOTE: Не нужно, чтобы выполнялся callback
            .css(cssOpts)
            .animate(animateOpts, this.params.duration);

    },

    /**
     * Выполняется при скрытии блока(когда модификатор visibility_visible ещё не снят)
     * Позволяет реализовать эффекты для скрытия блока
     * @public
     * @param {Function} callback
     */
    beforeHide : function(callback) {

        var direction = this.getCurrDirection();

        if(!direction) {
            return callback();
        }

        var to = direction.to,
            position = this.getCurrPos(),
            popupSize = this.getPopupSize(),
            tailOpts = this.params.tail,
            domElem = this.domElem,
            animateOpts = {
                top: position.top,
                left: position.left,
                opacity: 0
            };

        if(to == 'bottom') {
            animateOpts.top += 10;
        } else if(to == 'top') {
            animateOpts.top -= 10;
        } else if(to == 'left') {
            animateOpts.left -= 10;
        } else if(to == 'right') {
            animateOpts.left += 10;
        }

        return domElem
            .stop(true, true)
            .animate(animateOpts, this.params.duration, function() {

                callback();

                domElem.css('opacity', '');

            }); // NOTE: нужно убрать модификатор visibility_visible только по окончанию эффекта

    }

});

/* ../../ya-libs/islands-components/common.blocks/popup/_animate/popup_animate_yes.js end */
;
/* ../../ya-libs/islands-components/common.blocks/popup/__under/popup__under.js begin */
(function() {

/**
 * Пулл подложек блока
 * Используется чтобы не создавать iframe'ы для каждого инстанса блока на странице
 * @type {Array}
 */
var underPool = [ ];

BEM.DOM.decl('popup', {

    onSetMod : {

        'js' : function() {

            this.__base.call(this);

            var under = this.findElem('under');

            /**
             * Наименование классов оригинальной подложки из DOM
             * @private
             * @type {String}
             */
            this._underClassAttr = under.attr('class');

            /**
             * NOTE: Изначально присутствует div подложка,
             * если её не достаточно, то нужно её удалить,
             * чтобы _getUnder создал iframe подложку
             */
            if(this.isDivEnough()) {
                this._under = under;
            } else {
                under.remove();
                this._under = null;
            }

            /**
             * Сигнализирует наличие подложки от инстанса этого блока в пуле
             * @private
             * @type {Boolean}
             */
            this._underInPool = false;

        }

    },

    /**
     * Метод, позволяющий выбрать между div и iframe
     * по кастомным факторам
     * @public
     * @returns {Boolean}
     */
    isDivEnough : function() {

        // На десктопе пока(LEGO-8537) используем только iframe
        return false;

    },

    /**
     * Создаёт iframe подложку
     * @return {jQuery}
     */
    _createUnder : function() {

        /*
         * NOTE: frameBorder для IE
         * NOTE: другой src для IE, чтобы выделялся текст в инпуте (ISLCOMPONENTS-286)
         */

        return $('<iframe frameBorder="0" src="' + ($.browser.msie ? 'javascript:false' : 'about:blank') + '"/>');

    },

    /**
     * Получить подложку из пула или создать новую
     * @private
     * @return {jQuery}
     */
    _getUnder : function() {

        if(this._under) {
            return this._under;
        }

        var fromPool = underPool.pop();

        fromPool && (this._underInPool = false);

        /**
         * Подложка popup
         * @private
         * @type {jQuery}
         */
        return this._under = fromPool ||
            this._createUnder();

    },

    /**
     * Получает подложку из _getUnder, добавляет в DOM
     * @private
     */
    _attachUnder : function() {

        var under = this._under = this._getUnder();

        under
            .attr('class', this._underClassAttr);

        this.hasMod(under, 'type', 'paranja')?
            under.detach().insertBefore(this.domElem) :
            under.prependTo(this.domElem);

    },

    /**
     * Извлекает подложку из DOM, откладывает её в пул
     * @private
     */
    _detachUnder : function() {

        var under = this._under;

        underPool.push(under.detach());

        this._under = null;
        this._underInPool = true;

    },

    /**
     * Убирает подложку из пула, если этот блок
     * её туда положил
     */
    destruct : function() {

        this._underInPool && underPool.pop();

        return this.__base.apply(this, arguments);

    }
});

})();

/* ../../ya-libs/islands-components/common.blocks/popup/__under/popup__under.js end */
;
/* ../../ya-libs/islands-components/common.blocks/select/select.js begin */
(function($, BEM, undefined) {

var DOM = BEM.DOM,

    KEYDOWN_EVENT = ($.browser.opera && $.browser.version < 12.10) ? 'keypress' : 'keydown',
    isIE = $.browser.msie && parseInt($.browser.version) <= 10,
    USE_NATIVE_CONTROL = null,

    /** {String} */
    BLOCK_NAME = 'select';


/**
 * @namespace
 * @name Select
 */
DOM.decl('select', /** @lends Select.prototype */ {

    onSetMod : {

        'js' : function() {
            this._items = [];
            this._curItemIndex = -1;

            /** {Number} Высота строки в списке по умолчанию */
            this._rowHeight = 22;

            this.on('change', this._redrawParentPopup);

            // тригерим `change` у select-а, для синхронизации надписи на кнопке и выбранного пункта
            this._getSelectedText() !== this._buttonText() &&
                this.elem('control').trigger('change');
        },

        'disabled' : function(modName, modVal) {
            var disabled = modVal === 'yes';

            this.elem('control').attr('disabled', disabled);
            this._getButton().setMod(modName, modVal);

            disabled && this.delMod('opened').delMod('focused');
        },

        'focused' : {

            'yes' : function() {
                if(this.hasMod('disabled', 'yes'))
                    return false;

                this._useNativeControl() || this.bindTo(KEYDOWN_EVENT, this._onKeyDown);

                this.afterCurrentEvent(function() {
                    this.trigger('focus');
                });
            },

            '' : function() {
                this._useNativeControl() || this
                    .delMod('opened')
                    .unbindFrom(KEYDOWN_EVENT);

                this.afterCurrentEvent(function() {
                    this.trigger('blur');
                });
            }

        }

    },

    /**
     * @returns {Boolean}
     */
    isDisabled : function() {
        return this.hasMod('disabled', 'yes');
    },

    /**
     * @returns {Boolean}
     */
    isOpened : function() {
        return this.hasMod('opened', 'yes');
    },

    /**
     * @returns {BEM.DOM}
     */
    open : function() {
        return this.setMod('opened', 'yes');
    },

    /**
     * @returns {BEM.DOM}
     */
    close : function() {
        return this.delMod('opened');
    },

    /**
     * Устанавливает/возвращает выбранное значение
     * @param {String} [val]
     * @returns {String|BEM.DOM}
     */
    val : function(val) {
        if(typeof val === 'undefined') {
            return this.elem('control').val();
        }

        // NOTE: `$(select).val('value')` позволяет выбрать за-disable-нный элемент
        var valIndex = -1, optgroup;
        this.findElem('option').each(function(idx) {
            this.value === val && !this.disabled &&
                (optgroup = $(this).parent('optgroup')[0], !(optgroup && optgroup.disabled)) &&
                (valIndex = idx);
        });

        valIndex > -1 && this._selectedIndex(valIndex);

        return this;
    },

    /**
     * Устанавливает/возвращает номер выбранного элемента
     * @private
     * @param {Number} [index]
     * @returns {Number}
     */
    _selectedIndex : function(index) {
        var prevIdx = this._getSelectedIndex();
        if(typeof index === 'undefined' || index === prevIdx) {
            // LEGO-7139: не тригерить `change` если значение не изменилось
            return prevIdx;
        }

        this.elem('control').prop('selectedIndex',index);

        if(!this._useNativeControl()) {
            this._buttonText(this._getSelectedText());

            this._items[0] && this
                .delMod(this._items, 'selected')
                .setMod(this._items.eq(index), 'selected', 'yes');
        }

        this.trigger('change', { index: index, prev: prevIdx });

        return index;
    },

    /**
     * Устанавливает новое содержимое селекта
     * @param {[Object]} data
     * @returns {BEM.DOM}
     */
    setOptions : function(data) {
        if(!data) return this;

        DOM.update(this.elem('control'), BEMHTML.apply($.map(data, buildOption)));

        return this.redraw();
    },

    /**
     * Обновить контент попапа в соответсвии с контентом селекта
     */
    redraw : function() {
        this._popup && this._redrawList();

        // XXX зачем тригерить DOM-change?
        this.elem('control').trigger('change');

        return this;
    },

    _useNativeControl : function() {
        return USE_NATIVE_CONTROL !== null ?
               USE_NATIVE_CONTROL :
               (USE_NATIVE_CONTROL = this.elem('control').css('display') !== 'none');
    },

    /**
     * Обновляет позиционирование попапа, в котором находится селект
     * @private
     * @returns {BEM.DOM}
     */
    _redrawParentPopup : function() {
        this._isParentPopup() && this._popup._parent.repaint();

        return this;
    },

    /**
     * Возвращает true, если select находится в попапе
     * @private
     * @returns {Boolean}
     */
    _isParentPopup : function() {
        return this._popup && this._popup._parent && !this.hasMod('layout', 'fixed');
    },

    /* Events */

    _onSelectChange : function() {
        var _this = this;

        _this._buttonText(_this._getSelectedText());

        this.trigger('change', {
            index: _this._getSelectedIndex(),
            prev: -1
        });
    },

    _onKeyDown : function(e) {
        var which = e.which;

        if(which === 38 || which === 40) {
            e.preventDefault();

            if(!this.isOpened())
                return this.open(e);

            var len = this._items.length;
            if(len) {
                var direction = which - 39, // пользуемся особенностями кодов клавиш "вверх"/"вниз" ;-)
                    idx = this._curItemIndex,
                    i = 0;

                do {
                    idx += direction;
                } while(idx >= 0 && idx < len &&
                    this._onEnterItem(this._items.eq(idx), true) === false && ++i < len);
            }
        }
    },

    _onEnterItem : function(item, byKeyboard) {
        if(!this._isSelectableItem(item)) {
            return false;
        }

        var items = this._items,
            idx = this._curItemIndex;

        idx > -1 && this.delMod(items.eq(idx), 'hovered');
        idx = this._getItemIndex(item);
        idx > -1 && this.setMod(items.eq(this._curItemIndex = idx), 'hovered', 'yes');

        if(byKeyboard) {
            this._selectedIndex(this._curItemIndex);

            this._scrollToCurrent();
        }
    },

    _onLeaveItem : function(item) {
        var idx = this._curItemIndex;
        if(idx > -1 && idx === this._getItemIndex(item)) {
            this.delMod(this._items.eq(idx), 'hovered')._curItemIndex = -1;
        }
    },

    _onSelectItem : function(item) {
        if(this._isSelectableItem(item)) {
            this._selectedIndex(this._curItemIndex);
        }

        return this.close();
    },

    _onButtonFocus : function() {
        this.setMod('focused', 'yes');
    },

    _onButtonBlur : function() {
        // HACK: LEGO-8548
        if(this.isOpened() && this._isPopupFocused()) {
            this._focusButton();
            return;
        }

        this.delMod('focused');
    },

    _onButtonPress : function() {
        this.toggleMod('opened', 'yes', '');
    },

    /* Helpers */

    _focusButton : function() {
        this._getButton().setMod('focused', 'yes');
        return this;
    },

    _blurButton : function() {
        this._getButton().delMod('focused');
        return this;
    },

    _isPopupFocused : function() {
        try {
            return this._getPopup().containsDomElem($(document.activeElement));
        } catch(e) {
            return false;
        }
    },

    _buttonText : function(text) {
        if(typeof text === 'undefined') {
            return this._getButton().elem('text').text();
        }

        this._getButton().elem('text').html(text || ' &nbsp; ');

        // (HACK): LEGO-7937
        isIE && this.domElem.parent().css('outline', '');
    },

    _isOutsideClicked : function(e, data) {
        return this.containsDomElem($(data.target));
    },

    _getItemIndex : function(item) {
        return $.inArray(item.get(0), this._items);
    },

    _getSelectedText : function() {
        return this.elem('control').find(':selected').text();
    },

    _getSelectedIndex : function() {
        return this.elem('control').prop('selectedIndex');
    },

    _isSelectableItem : function(item) {
        return !(this.hasMod(item, 'disabled', 'yes') || this.hasMod(item, 'label', 'yes'));
    },

    _getButton : function() {
        return this._button || (this._button = this.findBlockOn('button', 'button'));
    },

    _getRowHeight : function() {
        return this.findElem(this._getPopup().domElem, 'item').outerHeight();
    },

    /**
     * Проверяет в фокусе ли контрол
     * @private
     * @returns {Boolean}
     */
    _isControlFocused : function() {

        try {
            return this.containsDomElem($(this.__self.doc[0].activeElement));
        } catch(e) {
            return false;
        }

    },

    destruct : function() {
        this._outPopup && this._outPopup.un('outside-click');

        this.delMod('opened');

        var popup = this._popup;
        popup && popup.domElem && popup.destruct();

        this.__base.apply(this, arguments);
    },

    getDefaultParams : function() {
        return {
            rows: 15,
            popupMods: {
                direction: 'down'
            }
        };
    }

}, /** @lends Select */ {

    live : function() {
        this.liveBindTo('control', 'change', function(e) {
            this._onSelectChange();
        });

        this.liveBindTo('control', 'focusin focusout', function(e) {
            this._useNativeControl() && this.toggleMod('focused', 'yes', '', e.type === 'focusin');
        });

        /*Fix for LEGO-9960*/
        this.liveBindTo('mousedown', function(e) {
            this._isControlFocused() && e.preventDefault();
        });

        return false;
    }

});

/**
  Вариант данных для API
  @example
  var data = [
   {
       item: 'optgroup',
       label: 'Russia',
       disabled: 1,    // optional
       content: [
         { item: 'option', value: '1', content: 'Moscow' },
         { item: 'option', value: '1', content: 'Saint-Peterburg', disabled: 1 }
       ]
   },
   { item: 'option', value: '3', content: 'Paris', selected: 1 },
   { item: 'option', value: '7', content: 'California', disabled: 1 }
  ];

  formSelect.setOptions(data);
 */

/**
 * @private
 * @param {Object} item
 * @param {Number} i
 * @param {Object} [params]
 * @returns {BEMJSON}
 */
function buildOption(item, i, params) {
    var it = {};

    if(item.item === 'option') {

        it = {
            block: BLOCK_NAME,
            elem: 'option',
            tag: 'option',
            attrs: { value: item.value },
            content: item.content
        };

        item.disabled && (it.attrs.disabled = 'disabled');
        item.selected && (it.attrs.selected = 'selected');

    } else if(item.item === 'optgroup') {

        it = {
            elem: 'option-group',
            tag: 'optgroup',
            attrs: { label: item.label }
        };

        item.disabled && (it.attrs.disabled = 'disabled');

        it.content = Array.isArray(item.content) ?
            item.content.map(function(node, i) {
                return buildOption(node, i);
            })
            : item.content;

    }

    it.block = BLOCK_NAME;

    if(params) {
        for(var p in params) if(params.hasOwnProperty(p)) it[k] = val;
    }

    return it;
}

}(jQuery, BEM));


/* ../../ya-libs/islands-components/common.blocks/select/select.js end */
;
/* ../../ya-libs/islands-components/common.blocks/select/__ui/select__ui.js begin */
(function(BEM) {

/**
 * @private
 * @param {JQuery} node
 * @param {String|Object|Array} content
 * @param {Object} elMods
 * @returns {BEMJSON} BEMJSON-представление элемента
 */
function buildItemJson(node, content, elMods) {
    var item = {
            block: 'select',
            elem: 'item',
            content: {
                elem: 'text',
                tag: 'span',
                content: content || ' &nbsp; '
            },
            elemMods: {}
        };

    elMods && (item.elemMods = elMods);

    return item;
}

/**
 * @private
 * @param {Array} data
 * @returns {String}
 */
function buildItemsHtml(data) {
    /** {String} Имя блока */
    var block = 'select',
        /** {BEMJSON} разделитель в списке элементов */
        separatorItem = { block: block, elem: 'separator', tag: 'i' };

    var items = [],
        inGroup = false;

    /**
     * @param {jQuery|[HTMLElement]} data
     * @param {Object} mods
     */
    function iterateNodes(data, mods) {
        var len = data.length;
        if(len) {
            var i = 0;

            do {
                var item = $(data[i]),
                    isDisabled = item.attr('disabled') && { disabled: 'yes' };

                if(item.is('optgroup')) {
                    inGroup = true;

                    !item.prev().is('optgroup') && items.push(separatorItem);
                    items.push(buildItemJson(item, item.attr('label'),
                        $.extend({ label: 'yes' }, isDisabled, mods)));

                    iterateNodes(item.children(), $.extend({ inner: 'yes' }, isDisabled, mods));
                } else {
                    items.push(buildItemJson(item, item.text(),
                        $.extend(isDisabled, item.is(':selected') && { selected: 'yes' }, mods)));
                }
            } while(++i < len || (inGroup && (items.push(separatorItem), inGroup = false)));
        }
    }

    iterateNodes(data);

    return BEMHTML.apply(items);
}


/**
 * @namespace Описывает процесс отрисовки селекта
 * @name Select
 */
BEM.DOM.decl('select', /** @lends Select.prototype */ {

    onSetMod : {

        'js' : function() {
            this.__base.apply(this, arguments);

            this._initButton();
        }

    },

    _initButton : function() {
        this._getButton()
            .on('focus', this._onButtonFocus, this)
            .on('blur', this._onButtonBlur, this)
            .on('press', this._onButtonPress, this);
    },

    _redrawList : function() {
        var _this = this,
            popup = this._getPopup().domElem,
            items;

        BEM.DOM.update(this.findElem(popup, 'list'),
            buildItemsHtml(this.elem('control').children()));


        items = this.findElem(popup, 'item');

        this._curItemIndex = -1;
        this._items = items.filter(function() {
                return !_this.hasMod($(this), 'label', 'yes');
            });

        this.bindTo(items, {
            'mouseup' : function(e) {
                e.which === 1 &&
                    (e.preventDefault(), _this._onSelectItem(e.data.domElem));
            },
            'mouseover' : function(e) {
                _this._onEnterItem(e.data.domElem);
            },
            'mouseout' : function(e) {
                _this._onLeaveItem(e.data.domElem);
            }
        });

        return this;
    }

});

}(BEM));
/* ../../ya-libs/islands-components/common.blocks/select/__ui/select__ui.js end */
;
/* ../../ya-libs/islands-components/common.blocks/select/__popup/select__popup.js begin */
/**
 * @namespace Описывает процесс отрисовки всплывающего окна селекта
 * @name Block
 */
BEM.DOM.decl('select', /** @lends Block.prototype */ {

    onSetMod : {

        'opened' : {

            'yes' : function() {
                if(this.hasMod('disabled', 'yes'))
                    return false;

                this._drawPopup();
            },

            '' : function() {
                this._getPopup().hide();
            }

        }

    },

    /**
     * Ленивое построение попапа
     * @private
     * @returns {BEM.DOM}
     */
    _getPopup : function() {
        if(this._popup) return this._popup;

        var _this = this,
            jsParams = _this.params,
            blockName = _this.__self.getName(),
            list = {
                block: blockName,
                elem: 'list'
            },
            elemPopupMix = {
                block: blockName,
                elem: 'popup',
                elemMods: {}
            },
            blockPopupMods = {
                animate: 'no'
            },
            blockPopupParams = {
                directions: [ 'bottom-left', 'top-left' ]
            };

        // пробрасываем зарезервированные модификаторы из блока в элемент 'select__popup'
        ['size', 'layout', 'theme', 'width'].forEach(function(mod) {
            _this.hasMod(mod) && (elemPopupMix.elemMods[mod] = _this.getMod(mod));
        });

        // пробрасываем пользовательские модификаторы из js-параметра 'elemPopupMods' в элемент 'select__popup'
        $.extend(elemPopupMix.elemMods, jsParams.elemPopupMods);

        // пробрасываем пользовательские модификаторы из js-параметра 'popupMods' в блок 'popup'
        $.extend(blockPopupMods, jsParams.popupMods);

        // пробрасываем пользовательские параметры из js-параметра 'popupParams' в блок 'popup'
        $.extend(blockPopupParams, jsParams.popupParams);

        var popup = $(BEMHTML.apply({
                block: 'popup',
                mods: blockPopupMods,
                mix: [ elemPopupMix ],
                js: blockPopupParams,
                content: {
                    elem: 'content',
                    content: list
                }
            }));

        (_this._popup = _this.findBlockOn(popup, 'popup'))
            .on({
                'show' : function() {
                    _this._curItemIndex = _this._getSelectedIndex();

                    var current = _this._items.eq(_this._curItemIndex);
                    _this
                        .delMod(_this._items, 'selected')
                        .setMod(current, 'hovered', 'yes')
                        .setMod(current, 'selected', 'yes');
                },

                'outside-click' : function(e, data) {
                    _this._isOutsideClicked(e, data) ?
                        e.preventDefault() : _this._blurButton();
                },

                'hide' : function() {
                    _this._curItemIndex = -1;

                    _this
                        .delMod('opened')
                        .delMod(_this._items, 'hovered')
                        .delMod(_this.findElem(_this._popup.domElem, 'popup'), 'scrollable');
                }
            })
            .bindTo('mousedown', function(e) {
                e.preventDefault();
            });

        BEM.DOM.append(BEM.DOM.scope, _this._popup.domElem);

        // see `select__ui` for src
        _this._redrawList();

        /*
         * (HACK, LEGO-7251)
         * TODO: При рефакторинге - убрать, блок popup это уже умеет.
         */
        _this._outPopup = _this.findBlockOutside('button', 'popup');
        _this._outPopup && _this._outPopup.on('outside-click', function(e, data) {
                _this._popup.containsDomElem($(data.target)) &&
                    e.preventDefault();
            });

        return _this._popup;
    },

    _calcPopupDimensions : function () {
        if(!this._popupContent)
            this._popupContent = this._getPopup().findBlockInside('popup').elem('content');

        var rows = parseInt(this.params.rows, 10) || false;
        if(rows && this.findElem(this._popupContent, 'item').size() > rows) {
            this._rowHeight = this._getRowHeight();

            this._popupContent.css('height', rows * this._rowHeight);

            this.setMod(this.findElem(this._getPopup().domElem, 'popup'), 'scrollable', 'yes');
        } else {
            this._popupContent.css('height', 'auto');
        }
    },

    _drawPopup : function() {

        var owner = this.findBlockInside('select'),
            popup = this._getPopup();

        popup.show(owner);

        this._calcPopupDimensions();

        this._scrollToCurrent();
    },

    _scrollToCurrent : function() {
        if(!this._popupContent || this._curItemIndex < 0) return;

        var curOffsetTop = this.findElem(
                this._popup.domElem, 'item', 'selected', 'yes').get(0).offsetTop,
            popContent = this._popupContent,
            popScrollTop = popContent.scrollTop(),

            disp = curOffsetTop - popScrollTop,
            fact = this._rowHeight * 2,
            newScrollTop;

        if(disp > popContent.height() - fact) {
            newScrollTop = curOffsetTop - fact;
        } else if(popScrollTop && disp < fact) {
            newScrollTop = curOffsetTop - popContent.height() + fact;
        }

        newScrollTop && popContent.scrollTop(newScrollTop);
    }

}, /** @lends Block */ {

    SHADOW_OFFSET: 1

});

/* ../../ya-libs/islands-components/common.blocks/select/__popup/select__popup.js end */
;
/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_mod.js begin */
BEM.DOM.decl({ block: 'i-glue-field_type_mod', baseBlock: 'i-glue-field' }, {
    onSetMod: {
        js: function() {
            this.__base();

            this._gluedBlock = this[this.params.elem ? 'findBlockOutside' : 'findBlockOn'](this.domElem, this.params.block || this.__self.getName());
            this._gluedElem = this.params.elem && this._gluedBlock.findElem(this.domElem, this.params.elem);
        }
    },

    init: function() {
        this.__base.apply(this, arguments);

        this._fieldType = this.model.getType(this.name);
    },

    onFieldChange: function(e, data) {
        var modVal = this.model.get(this.name);

        if (this._fieldType == 'boolean')
            modVal = modVal ? 'yes' : '';

        this._gluedBlock.setMod(this._gluedElem, this.params.modName, modVal);
    }

});

/* ../../libs/bem-mvc/common.blocks/i-glue-field/_type/i-glue-field_type_mod.js end */
;
/* ../../ya-libs/romochka/common.blocks/i-request/i-request.js begin */
(function() {

var cache = {};

BEM.decl('i-request', {

    onSetMod : {

        'js' : function() {

            this._preventCache = false;

        }

    },

    get : function(request, onSuccess, onError, params) {

        if(!$.isFunction(onError)) {
            params = onError;
            onError = this.params.onError;
        }

        this._get(request, onSuccess, onError, $.extend({}, this.params, params));

    },

    _get : function(request, onSuccess, onError, params) {

        var key = this._buildCacheKey(request, params),
            cacheGroup = cache[params.cacheGroup];

        params.cache && cacheGroup && key in cacheGroup.data?
            this.afterCurrentEvent(function() {
                onSuccess.call(this.params.callbackCtx, cacheGroup.data[key])
            }, this) :
            this._do(request, onSuccess, onError, params);
    },

    _do : function(request, onSuccess, onError, params) {},

    _onSuccess : function(requestKey, request, data, params) {

        params.cache && !this._preventCache && this.putToCache(params, requestKey, data);
        this._preventCache = false;

    },

    _buildCacheKey : function(obj, params) {

        return typeof obj == 'string' ? obj : $.param(obj);

    },

    putToCache : function(params, request, data) {

        var cacheGroup = cache[params.cacheGroup] || (cache[params.cacheGroup] = { keys : [], data : {}});

        if(cacheGroup.keys.length >= params.cacheSize) {
            delete cacheGroup.data[cacheGroup.keys.shift()];
        }

        var key = this._buildCacheKey(request, params);

        cacheGroup.data[key] = data;
        cacheGroup.keys.push(key);
    },

    dropCache : function() {

        delete cache[this.params.cacheGroup];

    },

    getDefaultParams : function() {

        return {
            cache : false,
            cacheGroup : 'default',
            cacheSize : 100,
            callbackCtx : this
        };

    }

}, {

    _cache: cache

});

})();
/* ../../ya-libs/romochka/common.blocks/i-request/i-request.js end */
;
/* ../../ya-libs/romochka/common.blocks/i-request/_type/i-request_type_ajax.js begin */
BEM.decl({ block : 'i-request_type_ajax', baseBlock : 'i-request' }, {

    onSetMod : {

        'js' : function() {

            this.__base();
            this._requestNumber = this._number = this._preventNumber = this._retryCount = 0;

        }

    },

    _get : function(request, onSuccess, onError, params) {

        this._number++;
        this._requestNumber++;
        this._retryCount = params.retryCount;

        this.__base.apply(this, arguments);

    },

    _do : function(request, onSuccess, onError, params) {

        var _this = this;
        if(_this._number > _this._preventNumber) { // условие на случай, если кто-то синхронно позовет preventCallbacks
            var args = arguments,
                settings = {
                    data : params.data? $.extend({}, params.data, request) : request
                },
                done = _this._wrapCallback(function(respArgs, requestNumber, number) {
                    _this._onSuccess(_this._buildCacheKey(request, params), request, respArgs[0], params);
                    _this._allowCallback(requestNumber, number) &&
                    onSuccess.apply(params.callbackCtx, respArgs);
                }),
                fail = _this._wrapCallback(function(respArgs, requestNumber, number) {
                    _this._allowCallback(requestNumber, number) &&
                    (_this._retryCount-- > 0?
                        setTimeout(
                            function() {
                                _this._do.apply(_this, args);
                            },
                            params.retryInterval) :
                        onError && onError.apply(params.callbackCtx, respArgs));
                });

            $.each(['url', 'dataType', 'timeout', 'type', 'jsonp', 'jsonpCallback'].concat(params.paramsToSettings || []), function(i, name) {
                settings[name] = params[name];
            });

            $.ajax(settings).done(done).fail(fail);
        }

    },

    _wrapCallback : function(callback) {

        var requestNumber = this._requestNumber,
            number = this._number;

        return function(data) {
            data !== null && callback(arguments, requestNumber, number);
        };

    },

    _allowCallback : function(requestNumber, number) {

        return number > this._preventNumber && this._requestNumber == requestNumber;

    },

    _buildCacheKey : function(obj, params) {

        return typeof obj == 'string'?
            obj :
            this.__base(obj) + params.url;

    },

    abort : function() {

        this._preventNumber = ++this._number;

    },

    /**
     * @deprecated использовать abort
     */
    preventCallbacks : function() {

        this.abort();

    },

    getDefaultParams : function() {

        return $.extend(
            this.__base(),
            {
                cache         : true,
                type          : 'GET',
                dataType      : 'jsonp',
                timeout       : 20000,
                retryCount    : 0,
                retryInterval : 2000
            });

    }

});

/* ../../ya-libs/romochka/common.blocks/i-request/_type/i-request_type_ajax.js end */
;
/* ../../desktop.blocks/schedule/__dataprovider/schedule__dataprovider.js begin */
BEM.decl({ name : 'schedule__dataprovider', baseBlock : 'i-request_type_ajax' }, {

    get : function(request, callback) {

        return this.__base(
            { part : request },
            function(data) {
                callback.call(this, data.response)
            });

    }

});

/* ../../desktop.blocks/schedule/__dataprovider/schedule__dataprovider.js end */
;
/* ../../desktop.blocks/underscore/underscore.js begin */
//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
!function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,v=e.reduce,h=e.reduceRight,d=e.filter,g=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,_=Object.keys,w=i.bind,j=function(n){return n instanceof j?n:this instanceof j?(this._wrapped=n,void 0):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.5.1";var A=j.each=j.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a in n)if(j.has(n,a)&&t.call(e,n[a],a,n)===r)return};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var E="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduce===v)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(E);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduceRight===h)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(E);return r},j.find=j.detect=function(n,t,r){var e;return O(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:d&&n.filter===d?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:g&&n.every===g?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var O=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:O(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,function(n){return n[t]})},j.where=function(n,t,r){return j.isEmpty(t)?r?void 0:[]:j[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},j.findWhere=function(n,t){return j.where(n,t,!0)},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&j.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&j.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e};var F=function(n){return j.isFunction(n)?n:function(t){return t[n]}};j.sortBy=function(n,t,r){var e=F(t);return j.pluck(j.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index<t.index?-1:1}),"value")};var k=function(n,t,r,e){var u={},i=F(null==t?j.identity:t);return A(n,function(t,a){var o=i.call(r,t,a,n);e(u,o,t)}),u};j.groupBy=function(n,t,r){return k(n,t,r,function(n,t,r){(j.has(n,t)?n[t]:n[t]=[]).push(r)})},j.countBy=function(n,t,r){return k(n,t,r,function(n,t){j.has(n,t)||(n[t]=0),n[t]++})},j.sortedIndex=function(n,t,r,e){r=null==r?j.identity:F(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var R=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):R(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return R(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.indexOf(t,n)>=0})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var M=function(){};j.bind=function(n,t){var r,e;if(w&&n.bind===w)return w.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));M.prototype=n.prototype;var u=new M;M.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u=null;return function(){var i=this,a=arguments,o=function(){u=null,r||(e=n.apply(i,a))},c=r&&!u;return clearTimeout(u),u=setTimeout(o,t),c&&(e=n.apply(i,a)),e}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=_||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){var t=[];for(var r in n)j.has(n,r)&&t.push(n[r]);return t},j.pairs=function(n){var t=[];for(var r in n)j.has(n,r)&&t.push([r,n[r]]);return t},j.invert=function(n){var t={};for(var r in n)j.has(n,r)&&(t[n[r]]=r);return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;"}};I.unescape=j.invert(I.escape);var T={escape:new RegExp("["+j.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(I.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(T[n],function(t){return I[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n"," ":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}.call(this);

/* ../../desktop.blocks/underscore/underscore.js end */
;
/* ../../desktop.blocks/backbone/backbone.js begin */
(function(){var t=this;var e=t.Backbone;var i=[];var r=i.push;var s=i.slice;var n=i.splice;var a;if(typeof exports!=="undefined"){a=exports}else{a=t.Backbone={}}a.VERSION="1.0.0";var h=t._;if(!h&&typeof require!=="undefined")h=require("underscore");a.$=t.jQuery||t.Zepto||t.ender||t.$;a.noConflict=function(){t.Backbone=e;return this};a.emulateHTTP=false;a.emulateJSON=false;var o=a.Events={on:function(t,e,i){if(!l(this,"on",t,[e,i])||!e)return this;this._events||(this._events={});var r=this._events[t]||(this._events[t]=[]);r.push({callback:e,context:i,ctx:i||this});return this},once:function(t,e,i){if(!l(this,"once",t,[e,i])||!e)return this;var r=this;var s=h.once(function(){r.off(t,s);e.apply(this,arguments)});s._callback=e;return this.on(t,s,i)},off:function(t,e,i){var r,s,n,a,o,u,c,f;if(!this._events||!l(this,"off",t,[e,i]))return this;if(!t&&!e&&!i){this._events={};return this}a=t?[t]:h.keys(this._events);for(o=0,u=a.length;o<u;o++){t=a[o];if(n=this._events[t]){this._events[t]=r=[];if(e||i){for(c=0,f=n.length;c<f;c++){s=n[c];if(e&&e!==s.callback&&e!==s.callback._callback||i&&i!==s.context){r.push(s)}}}if(!r.length)delete this._events[t]}}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!l(this,"trigger",t,e))return this;var i=this._events[t];var r=this._events.all;if(i)c(i,e);if(r)c(r,arguments);return this},stopListening:function(t,e,i){var r=this._listeners;if(!r)return this;var s=!e&&!i;if(typeof e==="object")i=this;if(t)(r={})[t._listenerId]=t;for(var n in r){r[n].off(e,i,this);if(s)delete this._listeners[n]}return this}};var u=/\s+/;var l=function(t,e,i,r){if(!i)return true;if(typeof i==="object"){for(var s in i){t[e].apply(t,[s,i[s]].concat(r))}return false}if(u.test(i)){var n=i.split(u);for(var a=0,h=n.length;a<h;a++){t[e].apply(t,[n[a]].concat(r))}return false}return true};var c=function(t,e){var i,r=-1,s=t.length,n=e[0],a=e[1],h=e[2];switch(e.length){case 0:while(++r<s)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<s)(i=t[r]).callback.call(i.ctx,n);return;case 2:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a);return;case 3:while(++r<s)(i=t[r]).callback.call(i.ctx,n,a,h);return;default:while(++r<s)(i=t[r]).callback.apply(i.ctx,e)}};var f={listenTo:"on",listenToOnce:"once"};h.each(f,function(t,e){o[e]=function(e,i,r){var s=this._listeners||(this._listeners={});var n=e._listenerId||(e._listenerId=h.uniqueId("l"));s[n]=e;if(typeof i==="object")r=this;e[t](i,r,this);return this}});o.bind=o.on;o.unbind=o.off;h.extend(a,o);var d=a.Model=function(t,e){var i;var r=t||{};e||(e={});this.cid=h.uniqueId("c");this.attributes={};h.extend(this,h.pick(e,p));if(e.parse)r=this.parse(r,e)||{};if(i=h.result(this,"defaults")){r=h.defaults({},r,i)}this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};var p=["url","urlRoot","collection"];h.extend(d.prototype,o,{changed:null,validationError:null,idAttribute:"id",initialize:function(){},toJSON:function(t){return h.clone(this.attributes)},sync:function(){return a.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return h.escape(this.get(t))},has:function(t){return this.get(t)!=null},set:function(t,e,i){var r,s,n,a,o,u,l,c;if(t==null)return this;if(typeof t==="object"){s=t;i=e}else{(s={})[t]=e}i||(i={});if(!this._validate(s,i))return false;n=i.unset;o=i.silent;a=[];u=this._changing;this._changing=true;if(!u){this._previousAttributes=h.clone(this.attributes);this.changed={}}c=this.attributes,l=this._previousAttributes;if(this.idAttribute in s)this.id=s[this.idAttribute];for(r in s){e=s[r];if(!h.isEqual(c[r],e))a.push(r);if(!h.isEqual(l[r],e)){this.changed[r]=e}else{delete this.changed[r]}n?delete c[r]:c[r]=e}if(!o){if(a.length)this._pending=true;for(var f=0,d=a.length;f<d;f++){this.trigger("change:"+a[f],this,c[a[f]],i)}}if(u)return this;if(!o){while(this._pending){this._pending=false;this.trigger("change",this,i)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,h.extend({},e,{unset:true}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,h.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!h.isEmpty(this.changed);return h.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?h.clone(this.changed):false;var e,i=false;var r=this._changing?this._previousAttributes:this.attributes;for(var s in t){if(h.isEqual(r[s],e=t[s]))continue;(i||(i={}))[s]=e}return i},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return h.clone(this._previousAttributes)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=this;var i=t.success;t.success=function(r){if(!e.set(e.parse(r,t),t))return false;if(i)i(e,r,t);e.trigger("sync",e,r,t)};R(this,t);return this.sync("read",this,t)},save:function(t,e,i){var r,s,n,a=this.attributes;if(t==null||typeof t==="object"){r=t;i=e}else{(r={})[t]=e}if(r&&(!i||!i.wait)&&!this.set(r,i))return false;i=h.extend({validate:true},i);if(!this._validate(r,i))return false;if(r&&i.wait){this.attributes=h.extend({},a,r)}if(i.parse===void 0)i.parse=true;var o=this;var u=i.success;i.success=function(t){o.attributes=a;var e=o.parse(t,i);if(i.wait)e=h.extend(r||{},e);if(h.isObject(e)&&!o.set(e,i)){return false}if(u)u(o,t,i);o.trigger("sync",o,t,i)};R(this,i);s=this.isNew()?"create":i.patch?"patch":"update";if(s==="patch")i.attrs=r;n=this.sync(s,this,i);if(r&&i.wait)this.attributes=a;return n},destroy:function(t){t=t?h.clone(t):{};var e=this;var i=t.success;var r=function(){e.trigger("destroy",e,e.collection,t)};t.success=function(s){if(t.wait||e.isNew())r();if(i)i(e,s,t);if(!e.isNew())e.trigger("sync",e,s,t)};if(this.isNew()){t.success();return false}R(this,t);var s=this.sync("delete",this,t);if(!t.wait)r();return s},url:function(){var t=h.result(this,"urlRoot")||h.result(this.collection,"url")||U();if(this.isNew())return t;return t+(t.charAt(t.length-1)==="/"?"":"/")+encodeURIComponent(this.id)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return this.id==null},isValid:function(t){return this._validate({},h.extend(t||{},{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=h.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;if(!i)return true;this.trigger("invalid",this,i,h.extend(e||{},{validationError:i}));return false}});var v=["keys","values","pairs","invert","pick","omit"];h.each(v,function(t){d.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.attributes);return h[t].apply(h,e)}});var g=a.Collection=function(t,e){e||(e={});if(e.url)this.url=e.url;if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,h.extend({silent:true},e))};var m={add:true,remove:true,merge:true};var y={add:true,merge:false,remove:false};h.extend(g.prototype,o,{model:d,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return a.sync.apply(this,arguments)},add:function(t,e){return this.set(t,h.defaults(e||{},y))},remove:function(t,e){t=h.isArray(t)?t.slice():[t];e||(e={});var i,r,s,n;for(i=0,r=t.length;i<r;i++){n=this.get(t[i]);if(!n)continue;delete this._byId[n.id];delete this._byId[n.cid];s=this.indexOf(n);this.models.splice(s,1);this.length--;if(!e.silent){e.index=s;n.trigger("remove",n,this,e)}this._removeReference(n)}return this},set:function(t,e){e=h.defaults(e||{},m);if(e.parse)t=this.parse(t,e);if(!h.isArray(t))t=t?[t]:[];var i,s,a,o,u,l;var c=e.at;var f=this.comparator&&c==null&&e.sort!==false;var d=h.isString(this.comparator)?this.comparator:null;var p=[],v=[],g={};for(i=0,s=t.length;i<s;i++){if(!(a=this._prepareModel(t[i],e)))continue;if(u=this.get(a)){if(e.remove)g[u.cid]=true;if(e.merge){u.set(a.attributes,e);if(f&&!l&&u.hasChanged(d))l=true}}else if(e.add){p.push(a);a.on("all",this._onModelEvent,this);this._byId[a.cid]=a;if(a.id!=null)this._byId[a.id]=a}}if(e.remove){for(i=0,s=this.length;i<s;++i){if(!g[(a=this.models[i]).cid])v.push(a)}if(v.length)this.remove(v,e)}if(p.length){if(f)l=true;this.length+=p.length;if(c!=null){n.apply(this.models,[c,0].concat(p))}else{r.apply(this.models,p)}}if(l)this.sort({silent:true});if(e.silent)return this;for(i=0,s=p.length;i<s;i++){(a=p[i]).trigger("add",a,this,e)}if(l)this.trigger("sort",this,e);return this},reset:function(t,e){e||(e={});for(var i=0,r=this.models.length;i<r;i++){this._removeReference(this.models[i])}e.previousModels=this.models;this._reset();this.add(t,h.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return this},push:function(t,e){t=this._prepareModel(t,e);this.add(t,h.extend({at:this.length},e));return t},pop:function(t){var e=this.at(this.length-1);this.remove(e,t);return e},unshift:function(t,e){t=this._prepareModel(t,e);this.add(t,h.extend({at:0},e));return t},shift:function(t){var e=this.at(0);this.remove(e,t);return e},slice:function(t,e){return this.models.slice(t,e)},get:function(t){if(t==null)return void 0;return this._byId[t.id!=null?t.id:t.cid||t]},at:function(t){return this.models[t]},where:function(t,e){if(h.isEmpty(t))return e?void 0:[];return this[e?"find":"filter"](function(e){for(var i in t){if(t[i]!==e.get(i))return false}return true})},findWhere:function(t){return this.where(t,true)},sort:function(t){if(!this.comparator)throw new Error("Cannot sort a set without a comparator");t||(t={});if(h.isString(this.comparator)||this.comparator.length===1){this.models=this.sortBy(this.comparator,this)}else{this.models.sort(h.bind(this.comparator,this))}if(!t.silent)this.trigger("sort",this,t);return this},sortedIndex:function(t,e,i){e||(e=this.comparator);var r=h.isFunction(e)?e:function(t){return t.get(e)};return h.sortedIndex(this.models,t,r,i)},pluck:function(t){return h.invoke(this.models,"get",t)},fetch:function(t){t=t?h.clone(t):{};if(t.parse===void 0)t.parse=true;var e=t.success;var i=this;t.success=function(r){var s=t.reset?"reset":"set";i[s](r,t);if(e)e(i,r,t);i.trigger("sync",i,r,t)};R(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?h.clone(e):{};if(!(t=this._prepareModel(t,e)))return false;if(!e.wait)this.add(t,e);var i=this;var r=e.success;e.success=function(s){if(e.wait)i.add(t,e);if(r)r(t,s,e)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(t instanceof d){if(!t.collection)t.collection=this;return t}e||(e={});e.collection=this;var i=new this.model(t,e);if(!i._validate(t,e)){this.trigger("invalid",this,t,e);return false}return i},_removeReference:function(t){if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(e&&t==="change:"+e.idAttribute){delete this._byId[e.previous(e.idAttribute)];if(e.id!=null)this._byId[e.id]=e}this.trigger.apply(this,arguments)}});var _=["forEach","each","map","collect","reduce","foldl","inject","reduceRight","foldr","find","detect","filter","select","reject","every","all","some","any","include","contains","invoke","max","min","toArray","size","first","head","take","initial","rest","tail","drop","last","without","indexOf","shuffle","lastIndexOf","isEmpty","chain"];h.each(_,function(t){g.prototype[t]=function(){var e=s.call(arguments);e.unshift(this.models);return h[t].apply(h,e)}});var w=["groupBy","countBy","sortBy"];h.each(w,function(t){g.prototype[t]=function(e,i){var r=h.isFunction(e)?e:function(t){return t.get(e)};return h[t](this.models,r,i)}});var b=a.View=function(t){this.cid=h.uniqueId("view");this._configure(t||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()};var x=/^(\S+)\s*(.*)$/;var E=["model","collection","el","id","attributes","className","tagName","events"];h.extend(b.prototype,o,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(t,e){if(this.$el)this.undelegateEvents();this.$el=t instanceof a.$?t:a.$(t);this.el=this.$el[0];if(e!==false)this.delegateEvents();return this},delegateEvents:function(t){if(!(t||(t=h.result(this,"events"))))return this;this.undelegateEvents();for(var e in t){var i=t[e];if(!h.isFunction(i))i=this[t[e]];if(!i)continue;var r=e.match(x);var s=r[1],n=r[2];i=h.bind(i,this);s+=".delegateEvents"+this.cid;if(n===""){this.$el.on(s,i)}else{this.$el.on(s,n,i)}}return this},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid);return this},_configure:function(t){if(this.options)t=h.extend({},h.result(this,"options"),t);h.extend(this,h.pick(t,E));this.options=t},_ensureElement:function(){if(!this.el){var t=h.extend({},h.result(this,"attributes"));if(this.id)t.id=h.result(this,"id");if(this.className)t["class"]=h.result(this,"className");var e=a.$("<"+h.result(this,"tagName")+">").attr(t);this.setElement(e,false)}else{this.setElement(h.result(this,"el"),false)}}});a.sync=function(t,e,i){var r=k[t];h.defaults(i||(i={}),{emulateHTTP:a.emulateHTTP,emulateJSON:a.emulateJSON});var s={type:r,dataType:"json"};if(!i.url){s.url=h.result(e,"url")||U()}if(i.data==null&&e&&(t==="create"||t==="update"||t==="patch")){s.contentType="application/json";s.data=JSON.stringify(i.attrs||e.toJSON(i))}if(i.emulateJSON){s.contentType="application/x-www-form-urlencoded";s.data=s.data?{model:s.data}:{}}if(i.emulateHTTP&&(r==="PUT"||r==="DELETE"||r==="PATCH")){s.type="POST";if(i.emulateJSON)s.data._method=r;var n=i.beforeSend;i.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",r);if(n)return n.apply(this,arguments)}}if(s.type!=="GET"&&!i.emulateJSON){s.processData=false}if(s.type==="PATCH"&&window.ActiveXObject&&!(window.external&&window.external.msActiveXFilteringEnabled)){s.xhr=function(){return new ActiveXObject("Microsoft.XMLHTTP")}}var o=i.xhr=a.ajax(h.extend(s,i));e.trigger("request",e,o,i);return o};var k={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};a.ajax=function(){return a.$.ajax.apply(a.$,arguments)};var S=a.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var $=/\((.*?)\)/g;var T=/(\(\?)?:\w+/g;var H=/\*\w+/g;var A=/[\-{}\[\]+?.,\\\^$|#\s]/g;h.extend(S.prototype,o,{initialize:function(){},route:function(t,e,i){if(!h.isRegExp(t))t=this._routeToRegExp(t);if(h.isFunction(e)){i=e;e=""}if(!i)i=this[e];var r=this;a.history.route(t,function(s){var n=r._extractParameters(t,s);i&&i.apply(r,n);r.trigger.apply(r,["route:"+e].concat(n));r.trigger("route",e,n);a.history.trigger("route",r,e,n)});return this},navigate:function(t,e){a.history.navigate(t,e);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=h.result(this,"routes");var t,e=h.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(A,"\\$&").replace($,"(?:$1)?").replace(T,function(t,e){return e?t:"([^/]+)"}).replace(H,"(.*?)");return new RegExp("^"+t+"$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return h.map(i,function(t){return t?decodeURIComponent(t):null})}});var I=a.History=function(){this.handlers=[];h.bindAll(this,"checkUrl");if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var N=/^[#\/]|\s+$/g;var P=/^\/+|\/+$/g;var O=/msie [\w.]+/;var C=/\/$/;I.started=false;h.extend(I.prototype,o,{interval:50,getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getFragment:function(t,e){if(t==null){if(this._hasPushState||!this._wantsHashChange||e){t=this.location.pathname;var i=this.root.replace(C,"");if(!t.indexOf(i))t=t.substr(i.length)}else{t=this.getHash()}}return t.replace(N,"")},start:function(t){if(I.started)throw new Error("Backbone.history has already been started");I.started=true;this.options=h.extend({},{root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.options.pushState&&this.history&&this.history.pushState);var e=this.getFragment();var i=document.documentMode;var r=O.exec(navigator.userAgent.toLowerCase())&&(!i||i<=7);this.root=("/"+this.root+"/").replace(P,"/");if(r&&this._wantsHashChange){this.iframe=a.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow;this.navigate(e)}if(this._hasPushState){a.$(window).on("popstate",this.checkUrl)}else if(this._wantsHashChange&&"onhashchange"in window&&!r){a.$(window).on("hashchange",this.checkUrl)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}this.fragment=e;var s=this.location;var n=s.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!n){this.fragment=this.getFragment(null,true);this.location.replace(this.root+this.location.search+"#"+this.fragment);return true}else if(this._wantsPushState&&this._hasPushState&&n&&s.hash){this.fragment=this.getHash().replace(N,"");this.history.replaceState({},document.title,this.root+this.fragment+s.search)}if(!this.options.silent)return this.loadUrl()},stop:function(){a.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);I.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getFragment(this.getHash(this.iframe))}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()||this.loadUrl(this.getHash())},loadUrl:function(t){var e=this.fragment=this.getFragment(t);var i=h.any(this.handlers,function(t){if(t.route.test(e)){t.callback(e);return true}});return i},navigate:function(t,e){if(!I.started)return false;if(!e||e===true)e={trigger:e};t=this.getFragment(t||"");if(this.fragment===t)return;this.fragment=t;var i=this.root+t;if(this._hasPushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,i)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getFragment(this.getHash(this.iframe))){if(!e.replace)this.iframe.document.open().close();this._updateHash(this.iframe.location,t,e.replace)}}else{return this.location.assign(i)}if(e.trigger)this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});a.history=new I;var j=function(t,e){var i=this;var r;if(t&&h.has(t,"constructor")){r=t.constructor}else{r=function(){return i.apply(this,arguments)}}h.extend(r,i,e);var s=function(){this.constructor=r};s.prototype=i.prototype;r.prototype=new s;if(t)h.extend(r.prototype,t);r.__super__=i.prototype;return r};d.extend=g.extend=S.extend=b.extend=I.extend=j;var U=function(){throw new Error('A "url" property or function must be specified')};var R=function(t,e){var i=e.error;e.error=function(r){if(i)i(t,r,e);t.trigger("error",t,r,e)}}}).call(this);

/* ../../desktop.blocks/backbone/backbone.js end */
;
/* ../../desktop.blocks/router/router.js begin */
var AppRouter = Backbone.Router.extend({

    routes: {
        "event/:id": "event"
    }

});

BEM.router = new AppRouter;

                BEM.router.on('route:event', function(){
                    console.log('router works2');
                });


/* ../../desktop.blocks/router/router.js end */
;
/* ../../desktop.blocks/schedule/schedule.js begin */
BEM.MODEL.decl('schedule', {

    list: {
        type: 'models-list',
        modelName: 'schedule-item'
    }

});

BEM.MODEL.decl('schedule-item', {
    id: 'string',
    time: 'string',
    'event-name': 'string',
    now: 'boolean'
});

BEM.DOM.decl({ block: 'schedule', baseBlock: 'i-glue' }, {
    onSetMod: {
        'js' : {
            'inited' : function() {

                this.__base();

                this._selectControl = this.findBlockInside(this.elem('select'), 'select');

                this.modelPath = this.model.path();

                BEM.router.on('route', function(){
                    console.log('router works');
                });

                this._selectControl.on('change', function(data){
                    BEM.router.navigate('event/' + this._selectControl.val());
                }, this);

                this.model
                    .on('list', 'add', function(e, data){
                        BEM.DOM.append(this.elem('events'), this._generateScheduleItem(data.model));
                        this._selectControl.redraw();
                    }, this);

                this._initSchedule();

            }
        }
    },

    getDefaultParams: function() {

        return {
            dataprovider: {
                url: '../../data/schedule.json',
                dataType: 'json'
            }
        }

    },

    _initSchedule: function() {

        var schedule = this;

        this.getDataprovider().get(
            {},
            function(competitions) {
                var collection = schedule.model.set('list', competitions);

                var currentEvent = collection.get('list').where({ now: true })[0];
            }
        );

    },

    updateSchedule: function(items) {
        this.elem('events').html('');

        items && BEM.DOM.update(this.elem('events'), BEMHTML.apply(items.map(this._generateScheduleItem, this)))
    },

    _generateScheduleItem: function(event) {
        return BEMHTML.apply({
            block: 'schedule',
            elem: 'event',
            parentPath: this.modelPath,
            time: event.get('time'),
            selected: event.get('now'),
            id: event.get('id'),
            'event-name': event.get('event-name')
        })
    },

    getDataprovider: function() {
        var url = this.params.dataprovider.url;

        return this._dataprovider || (this._dataprovider = BEM.create(
            this.params.dataprovider.name || this.__self.getName() + '__dataprovider',
            $.extend(this.params.dataprovider, {
                url: url,
                callbackCtx : this
            })));
    }

});

/* ../../desktop.blocks/schedule/schedule.js end */
;
/* ../../desktop.blocks/initializer/initializer.js begin */
$(function() {
    Backbone.history.start();
});

/* ../../desktop.blocks/initializer/initializer.js end */
;
