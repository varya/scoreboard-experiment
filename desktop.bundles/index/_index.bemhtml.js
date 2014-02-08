var BEMHTML = function() {
  var cache,
      xjst = (function(exports) {
    function $1(__$ctx) {
        var __t = __$ctx._mode;
        if (__t === "default") {
            return $2(__$ctx);
        } else if (__t === "tag") {
            return $138(__$ctx);
        } else if (__t === "attrs") {
            return $215(__$ctx);
        } else if (__t === "mix") {
            return $276(__$ctx);
        } else if (__t === "content") {
            return $107(__$ctx);
        } else if (__t === "bem") {
            return $315(__$ctx);
        } else if (__t === "cls") {
            return $338(__$ctx);
        } else if (__t === "xUACompatible") {
            if (__$ctx.block === "b-page") {
                if (!!__$ctx.elem === false) {
                    return $349(__$ctx);
                } else {
                    return $364(__$ctx);
                }
            } else {
                return $364(__$ctx);
            }
        } else if (__t === "doctype") {
            if (__$ctx.block === "b-page") {
                if (!!__$ctx.elem === false) {
                    return $357(__$ctx);
                } else {
                    return $364(__$ctx);
                }
            } else {
                return $364(__$ctx);
            }
        } else if (__t === "jsAttr") {
            return $363(__$ctx);
        } else if (__t === "js") {
            return $292(__$ctx);
        } else {
            return $364(__$ctx);
        }
    }
    function $2(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "i-jquery") {
            if (!(__$ctx["__$anflg11"] !== true) === false) {
                if (!!__$ctx.elem === false) {
                    return $6(__$ctx);
                } else {
                    return $9(__$ctx);
                }
            } else {
                return $9(__$ctx);
            }
        } else if (__t === "schedule") {
            var __t = __$ctx.elem;
            if (__t === "event") {
                if (!(__$ctx["__$anflg10"] !== true) === false) {
                    return $17(__$ctx);
                } else {
                    return $364(__$ctx);
                }
            } else if (__t === "events") {
                if (!(__$ctx["__$anflg9"] !== true) === false) {
                    return $22(__$ctx);
                } else {
                    return $364(__$ctx);
                }
            } else {
                return $364(__$ctx);
            }
        } else if (__t === "button") {
            return $27(__$ctx);
        } else if (__t === "select") {
            return $44(__$ctx);
        } else if (__t === "popup") {
            if (!(__$ctx["__$anflg7"] !== true) === false) {
                if (!!__$ctx.elem === false) {
                    return $55(__$ctx);
                } else {
                    return $364(__$ctx);
                }
            } else {
                return $364(__$ctx);
            }
        } else if (__t === "input") {
            return $60(__$ctx);
        } else if (__t === "checkbox") {
            return $77(__$ctx);
        } else if (__t === "b-page") {
            if (__$ctx.elem === "css") {
                if (!__$ctx.ctx.hasOwnProperty("ie") === false) {
                    if (!!__$ctx.ctx._ieCommented === false) {
                        return $92(__$ctx);
                    } else {
                        return $97(__$ctx);
                    }
                } else {
                    return $97(__$ctx);
                }
            } else {
                return $97(__$ctx);
            }
        } else {
            return $364(__$ctx);
        }
    }
    function $6(__$ctx) {
        var __r99, __r103, __r100, __r101, __r102;
        return "", __r99 = __$ctx["__$anflg11"], __$ctx["__$anflg11"] = true, __r103 = ("", __r100 = __$ctx.ctx, __$ctx.ctx = {
            block: "b-page",
            elem: "js",
            url: __$ctx.ctx.url || (__$ctx.ctx.protocol ? __$ctx.ctx.protocol + ":" : "") + "//yandex.st/jquery/" + __$ctx.mods.version + "/jquery.min.js"
        }, __r101 = __$ctx._mode, __$ctx._mode = "", __r102 = $364(__$ctx), __$ctx.ctx = __r100, __$ctx._mode = __r101, "", __r102), __$ctx["__$anflg11"] = __r99, "", __r103;
        return;
    }
    function $9(__$ctx) {
        if (__$ctx.elem === "core") {
            var __r49, __r50, __r51;
            return "", __r49 = __$ctx._mode, __$ctx._mode = "", __r50 = __$ctx.ctx, __$ctx.ctx = {
                block: "b-page",
                elem: "js",
                url: "//yandex.st/jquery/1.8.3/jquery.min.js"
            }, __r51 = $364(__$ctx), __$ctx._mode = __r49, __$ctx.ctx = __r50, "", __r51;
            return;
        } else {
            return $364(__$ctx);
        }
    }
    function $17(__$ctx) {
        {
            "";
            var __r96 = __$ctx["__$anflg10"];
            __$ctx["__$anflg10"] = true;
            {
                "";
                var __r97 = __$ctx._mode;
                __$ctx._mode = "";
                var __r98 = __$ctx.ctx;
                __$ctx.ctx = {
                    block: "select",
                    elem: "option",
                    attrs: {
                        value: __$ctx.ctx.id,
                        selected: __$ctx.ctx.selected && "selected"
                    },
                    content: __$ctx.ctx["event-name"]
                };
                $364(__$ctx);
                __$ctx._mode = __r97;
                __$ctx.ctx = __r98;
                "";
            }
            __$ctx["__$anflg10"] = __r96;
            "";
        }
        return;
    }
    function $22(__$ctx) {
        {
            "";
            var __r93 = __$ctx["__$anflg9"];
            __$ctx["__$anflg9"] = true;
            {
                "";
                var __r94 = __$ctx._mode;
                __$ctx._mode = "";
                var __r95 = __$ctx.ctx;
                __$ctx.ctx = {
                    block: "select",
                    mods: {
                        size: "m",
                        theme: "normal"
                    },
                    mix: [ {
                        block: "schedule",
                        elem: "select"
                    } ],
                    content: [ {
                        block: "button"
                    }, {
                        elem: "control",
                        mix: [ {
                            block: "schedule",
                            elem: "events"
                        } ]
                    } ]
                };
                $364(__$ctx);
                __$ctx._mode = __r94;
                __$ctx.ctx = __r95;
                "";
            }
            __$ctx["__$anflg9"] = __r93;
            "";
        }
        return;
    }
    function $27(__$ctx) {
        if (!__$ctx._formSelect === false) {
            if (!!__$ctx.ctx._theme === false) {
                if (!!__$ctx.elem === false) {
                    return $31(__$ctx);
                } else {
                    return $36(__$ctx);
                }
            } else {
                return $36(__$ctx);
            }
        } else {
            return $36(__$ctx);
        }
    }
    function $31(__$ctx) {
        var _$20ctx = __$ctx.ctx, _$20selectMods = __$ctx._formSelect.mods, _$20tabindex = __$ctx._formSelect.tabindex, _$20m = _$20ctx.mods || {};
        _$20m.arrow = "down";
        _$20selectMods.theme && (_$20m.theme = _$20selectMods.theme);
        _$20selectMods.size && (_$20m.size = _$20selectMods.size);
        _$20selectMods.disabled === "yes" && (_$20m.disabled = "yes");
        _$20ctx.mods = _$20m;
        _$20tabindex && (_$20ctx.tabindex = _$20tabindex);
        {
            "";
            var __r90 = __$ctx._mode;
            __$ctx._mode = "";
            var __r91 = __$ctx.ctx, __r92 = __r91._theme;
            __r91._theme = true;
            $364(__$ctx);
            __$ctx._mode = __r90;
            __r91._theme = __r92;
            "";
        }
        undefined;
        return;
    }
    function $36(__$ctx) {
        if (!!__$ctx.elem === false) {
            if (!!(__$ctx.ctx.mods || {}).theme === false) {
                {
                    "";
                    var __r82 = __$ctx.ctx, __r83 = __r82.mods;
                    __r82.mods = __$ctx._.extend(__$ctx.ctx.mods || {}, {
                        theme: "normal"
                    });
                    $27(__$ctx);
                    __r82.mods = __r83;
                    "";
                }
                undefined;
                return;
            } else {
                return $364(__$ctx);
            }
        } else {
            return $364(__$ctx);
        }
    }
    function $44(__$ctx) {
        if (!(__$ctx["__$anflg8"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                return $47(__$ctx);
            } else {
                return $364(__$ctx);
            }
        } else {
            return $364(__$ctx);
        }
    }
    function $47(__$ctx) {
        var _$1uctx = __$ctx.ctx, _$1uid = _$1uctx.id || __$ctx.generateId();
        {
            "";
            var __r87 = __$ctx["__$anflg8"];
            __$ctx["__$anflg8"] = true;
            {
                "";
                var __r88 = __$ctx._controlAttrs;
                __$ctx._controlAttrs = {
                    id: _$1uid,
                    name: _$1uctx.name || _$1uid,
                    tabindex: _$1uctx.tabindex
                };
                var __r89 = __$ctx._formSelect;
                __$ctx._formSelect = {
                    block: __$ctx.block,
                    mods: __$ctx.mods,
                    tabindex: _$1uctx.tabindex
                };
                $44(__$ctx);
                __$ctx._controlAttrs = __r88;
                __$ctx._formSelect = __r89;
                "";
            }
            __$ctx["__$anflg8"] = __r87;
            "";
        }
        undefined;
        return;
    }
    function $55(__$ctx) {
        var _$1tmods = __$ctx.ctx.mods || {};
        _$1tmods.theme || (_$1tmods.theme = "ffffff");
        _$1tmods.autoclosable || (_$1tmods.autoclosable = "yes");
        _$1tmods.adaptive || (_$1tmods.adaptive = "yes");
        _$1tmods.animate || (_$1tmods.animate = "yes");
        __$ctx.ctx.mods = _$1tmods;
        if (__$ctx.ctx.zIndex) {
            var _$1tattrs = __$ctx.ctx.attrs || (__$ctx.ctx.attrs = {});
            _$1tattrs.style || (_$1tattrs.style = "");
            _$1tattrs.style += "z-index:" + __$ctx.ctx.zIndex;
        } else {
            undefined;
        }
        __$ctx.ctx.content = [ {
            elem: "under",
            mods: __$ctx.ctx.underMods
        }, __$ctx.ctx.content ];
        {
            "";
            var __r84 = __$ctx["__$anflg7"];
            __$ctx["__$anflg7"] = true;
            {
                "";
                var __r85 = __$ctx.ctx;
                __$ctx.ctx = __$ctx.ctx;
                var __r86 = __$ctx._mode;
                __$ctx._mode = "";
                $364(__$ctx);
                __$ctx.ctx = __r85;
                __$ctx._mode = __r86;
                "";
            }
            __$ctx["__$anflg7"] = __r84;
            "";
        }
        undefined;
        return;
    }
    function $60(__$ctx) {
        if (__$ctx.elem === "control") {
            if (!(__$ctx["__$anflg4"] !== true) === false) {
                {
                    "";
                    var __r75 = __$ctx["__$anflg4"];
                    __$ctx["__$anflg4"] = true;
                    {
                        "";
                        var __r76 = __$ctx.ctx;
                        __$ctx.ctx = {
                            elem: "box",
                            tag: "span",
                            content: [ __$ctx.ctx, {
                                elem: "clear"
                            } ]
                        };
                        var __r77 = __$ctx._mode;
                        __$ctx._mode = "";
                        $364(__$ctx);
                        __$ctx.ctx = __r76;
                        __$ctx._mode = __r77;
                        "";
                    }
                    __$ctx["__$anflg4"] = __r75;
                    "";
                }
                undefined;
                return;
            } else {
                return $66(__$ctx);
            }
        } else {
            return $66(__$ctx);
        }
    }
    function $66(__$ctx) {
        if (!(__$ctx["__$anflg3"] !== true) === false) {
            if (!!__$ctx._inputId === false) {
                if (!!__$ctx.elem === false) {
                    return $70(__$ctx);
                } else {
                    return $364(__$ctx);
                }
            } else {
                return $364(__$ctx);
            }
        } else {
            return $364(__$ctx);
        }
    }
    function $70(__$ctx) {
        {
            "";
            var __r69 = __$ctx["__$anflg3"];
            __$ctx["__$anflg3"] = true;
            {
                "";
                var __r70 = __$ctx._inputId;
                __$ctx._inputId = __$ctx.ctx.id || __$ctx.generateId();
                var __r71 = __$ctx._name;
                __$ctx._name = __$ctx.ctx.name || "";
                var __r72 = __$ctx._value;
                __$ctx._value = __$ctx.ctx.value || "";
                var __r73 = __$ctx._inputLink;
                __$ctx._inputLink = true;
                var __r74 = __$ctx._disabled;
                __$ctx._disabled = __$ctx.mods.disabled;
                $60(__$ctx);
                __$ctx._inputId = __r70;
                __$ctx._name = __r71;
                __$ctx._value = __r72;
                __$ctx._inputLink = __r73;
                __$ctx._disabled = __r74;
                "";
            }
            __$ctx["__$anflg3"] = __r69;
            "";
        }
        undefined;
        return;
    }
    function $77(__$ctx) {
        if (!(__$ctx["__$anflg2"] !== true) === false) {
            if (!!__$ctx._checkboxAttrs === false) {
                if (!!__$ctx.elem === false) {
                    {
                        "";
                        var __r67 = __$ctx["__$anflg2"];
                        __$ctx["__$anflg2"] = true;
                        {
                            "";
                            var __r68 = __$ctx._checkboxAttrs;
                            __$ctx._checkboxAttrs = (__$ctx.ctx.checkboxAttrs || {}).id ? __$ctx.ctx.checkboxAttrs : {
                                id: "id" + __$ctx.generateId()
                            };
                            $77(__$ctx);
                            __$ctx._checkboxAttrs = __r68;
                            "";
                        }
                        __$ctx["__$anflg2"] = __r67;
                        "";
                    }
                    undefined;
                    return;
                } else {
                    return $364(__$ctx);
                }
            } else {
                return $364(__$ctx);
            }
        } else {
            return $364(__$ctx);
        }
    }
    function $92(__$ctx) {
        var _$11ie = __$ctx.ctx.ie;
        if (_$11ie === true) {
            {
                "";
                var __r61 = __$ctx._mode;
                __$ctx._mode = "";
                var __r62 = __$ctx.ctx;
                __$ctx.ctx = [ 6, 7, 8, 9 ].map(function(v) {
                    return {
                        elem: "css",
                        url: this.ctx.url + ".ie" + v + ".css",
                        ie: "IE " + v
                    };
                }, __$ctx);
                $364(__$ctx);
                __$ctx._mode = __r61;
                __$ctx.ctx = __r62;
                "";
            }
            undefined;
        } else {
            var _$11hideRule = !_$11ie ? [ "gt IE 9", "<!-->", "<!--" ] : _$11ie === "!IE" ? [ _$11ie, "<!-->", "<!--" ] : [ _$11ie, "", "" ];
            {
                "";
                var __r63 = __$ctx._mode;
                __$ctx._mode = "";
                var __r64 = __$ctx.ctx, __r65 = __r64._ieCommented;
                __r64._ieCommented = true;
                var __r66 = __$ctx.ctx;
                __$ctx.ctx = [ "<!--[if " + _$11hideRule[0] + "]>", _$11hideRule[1], __$ctx.ctx, _$11hideRule[2], "<![endif]-->" ];
                $364(__$ctx);
                __$ctx._mode = __r63;
                __r64._ieCommented = __r65;
                __$ctx.ctx = __r66;
                "";
            }
            undefined;
        }
        return;
    }
    function $97(__$ctx) {
        if (!(__$ctx["__$anflg1"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                return $100(__$ctx);
            } else {
                return $364(__$ctx);
            }
        } else {
            return $364(__$ctx);
        }
    }
    function $100(__$ctx) {
        var __r52, __r53, __r54, __r55;
        var _$lctx = __$ctx.ctx, _$ldtype = ("", __r52 = __$ctx._mode, __$ctx._mode = "doctype", __r53 = $357(__$ctx), __$ctx._mode = __r52, "", __r53), _$lxUA = ("", __r54 = __$ctx._mode, __$ctx._mode = "xUACompatible", __r55 = $349(__$ctx), __$ctx._mode = __r54, "", __r55), _$lbuf = [ _$ldtype, {
            elem: "root",
            content: [ {
                elem: "head",
                content: [ {
                    tag: "meta",
                    attrs: {
                        charset: "utf-8"
                    }
                }, _$lxUA, {
                    tag: "title",
                    content: _$lctx.title
                }, _$lctx.favicon ? {
                    elem: "favicon",
                    url: _$lctx.favicon
                } : "", _$lctx.meta, {
                    block: "i-ua"
                }, _$lctx.head ]
            }, _$lctx ]
        } ];
        {
            "";
            var __r56 = __$ctx["__$anflg1"];
            __$ctx["__$anflg1"] = true;
            {
                "";
                var __r57 = __$ctx.ctx;
                __$ctx.ctx = _$lbuf;
                var __r58 = __$ctx._mode;
                __$ctx._mode = "";
                $364(__$ctx);
                __$ctx.ctx = __r57;
                __$ctx._mode = __r58;
                "";
            }
            __$ctx["__$anflg1"] = __r56;
            "";
        }
        undefined;
        return;
    }
    function $107(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "schedule") {
            if (__$ctx.elem === "title") {
                return __$ctx.ctx.content;
                return;
            } else {
                return $137(__$ctx);
            }
        } else if (__t === "button") {
            if (!!__$ctx.elem === false) {
                return {
                    elem: "text",
                    tag: "span",
                    content: __$ctx.ctx.content
                };
                return;
            } else {
                return $137(__$ctx);
            }
        } else if (__t === "input") {
            if (__$ctx.elem === "clear") {
                if (!!__$ctx.ctx.content === false) {
                    return "&nbsp;";
                    return;
                } else {
                    return $137(__$ctx);
                }
            } else {
                return $137(__$ctx);
            }
        } else if (__t === "checkbox") {
            if (!!__$ctx.elem === false) {
                return [ {
                    elem: "box",
                    tag: "span",
                    elemMods: __$ctx.mods.checked === "yes" ? {
                        checked: "yes"
                    } : "",
                    content: [ {
                        elem: "control",
                        attrs: __$ctx.ctx.checkboxAttrs || {}
                    }, {
                        elem: "tick",
                        tag: "i"
                    } ]
                }, __$ctx.ctx.content ];
                return;
            } else {
                return $137(__$ctx);
            }
        } else if (__t === "i-ua") {
            if (!!__$ctx.elem === false) {
                return [ ";(function(d,e,c,r){", "e=d.documentElement;", 'c="className";', 'r="replace";', 'e[c]=e[c][r]("i-ua_js_no","i-ua_js_yes");', 'if(d.compatMode!="CSS1Compat")', 'e[c]=e[c][r]("i-ua_css_standart","i-ua_css_quirks")', "})(document);" ].join("");
                return;
            } else {
                return $137(__$ctx);
            }
        } else {
            return $137(__$ctx);
        }
    }
    function $137(__$ctx) {
        return __$ctx.ctx.content;
        return;
    }
    function $138(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "schedule") {
            if (__$ctx.elem === "title") {
                return "h1";
                return;
            } else {
                return $214(__$ctx);
            }
        } else if (__t === "select") {
            var __t = __$ctx.elem;
            if (__t === "control") {
                return "select";
                return;
            } else if (__t === "text") {
                return "span";
                return;
            } else if (__t === "option-group") {
                return "optgroup";
                return;
            } else if (__t === "option") {
                return "option";
                return;
            } else {
                if (!!__$ctx.elem === false) {
                    return "span";
                    return;
                } else {
                    return $214(__$ctx);
                }
            }
        } else if (__t === "button") {
            if (!__$ctx.ctx.url === false) {
                if (!!__$ctx.elem === false) {
                    return "a";
                    return;
                } else {
                    return $164(__$ctx);
                }
            } else {
                return $164(__$ctx);
            }
        } else if (__t === "input") {
            var __t = __$ctx.elem;
            if (__t === "clear") {
                return "span";
                return;
            } else if (__t === "control") {
                return "input";
                return;
            } else {
                if (!!__$ctx.elem === false) {
                    return "span";
                    return;
                } else {
                    return $214(__$ctx);
                }
            }
        } else if (__t === "checkbox") {
            if (__$ctx.elem === "control") {
                return "input";
                return;
            } else {
                if (!!__$ctx.elem === false) {
                    return "span";
                    return;
                } else {
                    return $214(__$ctx);
                }
            }
        } else if (__t === "b-page") {
            var __t = __$ctx.elem;
            if (__t === "js") {
                return "script";
                return;
            } else if (__t === "css") {
                if (!__$ctx.ctx.url === false) {
                    return "link";
                    return;
                } else {
                    return "style";
                    return;
                }
            } else if (__t === "favicon") {
                return "link";
                return;
            } else if (__t === "meta") {
                return "meta";
                return;
            } else if (__t === "head") {
                return "head";
                return;
            } else if (__t === "root") {
                return "html";
                return;
            } else {
                if (!!__$ctx.elem === false) {
                    return "body";
                    return;
                } else {
                    return $214(__$ctx);
                }
            }
        } else if (__t === "i-ua") {
            if (!!__$ctx.elem === false) {
                return "script";
                return;
            } else {
                return $214(__$ctx);
            }
        } else {
            return $214(__$ctx);
        }
    }
    function $164(__$ctx) {
        if (!!__$ctx.elem === false) {
            return "button";
            return;
        } else {
            return $214(__$ctx);
        }
    }
    function $214(__$ctx) {
        return undefined;
        return;
    }
    function $215(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "select") {
            if (__$ctx.elem === "control") {
                var _$23attrs = [ "id", "name", "tabindex" ], _$23prop = {}, _$23p;
                while (_$23p = _$23attrs.pop()) {
                    __$ctx._controlAttrs[_$23p] && (_$23prop[_$23p] = __$ctx._controlAttrs[_$23p]);
                }
                __$ctx.mods.disabled === "yes" && (_$23prop.disabled = "disabled");
                return __$ctx.ctx.controlAttrs || _$23prop;
                return;
            } else {
                return $275(__$ctx);
            }
        } else if (__t === "button") {
            return $221(__$ctx);
        } else if (__t === "input") {
            if (__$ctx.elem === "control") {
                var _$1ha = {
                    id: __$ctx._inputId,
                    name: __$ctx._name
                };
                __$ctx._value && (_$1ha.value = __$ctx._value);
                __$ctx.mods.disabled && (_$1ha.disabled = "disabled");
                return _$1ha;
                return;
            } else {
                return $275(__$ctx);
            }
        } else if (__t === "checkbox") {
            if (__$ctx.elem === "control") {
                var _$1ca = __$ctx.ctx.attrs || {};
                _$1ca.id = __$ctx._checkboxAttrs.id;
                _$1ca.type = "checkbox";
                __$ctx.mods.disabled && (_$1ca.disabled = "disabled");
                __$ctx.mods.checked && (_$1ca.checked = "checked");
                return _$1ca;
                return;
            } else {
                return $275(__$ctx);
            }
        } else if (__t === "b-page") {
            var __t = __$ctx.elem;
            if (__t === "js") {
                if (!__$ctx.ctx.url === false) {
                    return {
                        src: __$ctx.ctx.url
                    };
                    return;
                } else {
                    return $275(__$ctx);
                }
            } else if (__t === "css") {
                if (!__$ctx.ctx.url === false) {
                    return {
                        rel: "stylesheet",
                        href: __$ctx.ctx.url
                    };
                    return;
                } else {
                    return $275(__$ctx);
                }
            } else if (__t === "favicon") {
                return {
                    rel: "shortcut icon",
                    href: __$ctx.ctx.url
                };
                return;
            } else if (__t === "meta") {
                return __$ctx.ctx.attrs;
                return;
            } else {
                return $275(__$ctx);
            }
        } else {
            return $275(__$ctx);
        }
    }
    function $221(__$ctx) {
        if (!(__$ctx["__$anflg6"] !== true) === false) {
            if (!__$ctx.ctx.url === false) {
                if (!!__$ctx.elem === false) {
                    var __r80, __r81;
                    var _$1qctx = __$ctx.ctx, _$1qp = ("", __r80 = __$ctx["__$anflg6"], __$ctx["__$anflg6"] = true, __r81 = $221(__$ctx), __$ctx["__$anflg6"] = __r80, "", __r81), _$1qa = {
                        href: _$1qctx.url
                    };
                    _$1qctx.target && (_$1qa.target = _$1qctx.target);
                    __$ctx.mods.disabled && (_$1qa["aria-disabled"] = true);
                    return __$ctx._.extend(_$1qp, _$1qa);
                    return;
                } else {
                    return $230(__$ctx);
                }
            } else {
                return $230(__$ctx);
            }
        } else {
            return $230(__$ctx);
        }
    }
    function $230(__$ctx) {
        if (!(__$ctx["__$anflg5"] !== true) === false) {
            if (!!__$ctx.elem === false) {
                if (!!__$ctx.ctx.url === false) {
                    return $234(__$ctx);
                } else {
                    return $239(__$ctx);
                }
            } else {
                return $239(__$ctx);
            }
        } else {
            return $239(__$ctx);
        }
    }
    function $234(__$ctx) {
        var __r78, __r79;
        var _$1pctx = __$ctx.ctx, _$1pp = ("", __r78 = __$ctx["__$anflg5"], __$ctx["__$anflg5"] = true, __r79 = $221(__$ctx), __$ctx["__$anflg5"] = __r78, "", __r79), _$1pa = {
            type: _$1pctx.type ? _$1pctx.type : "button"
        }, _$1pprops = [ "name", "value" ], _$1pi;
        while (_$1pi = _$1pprops.shift()) {
            _$1pctx[_$1pi] && (_$1pa[_$1pi] = _$1pctx[_$1pi]);
        }
        __$ctx.mods.disabled && (_$1pa.disabled = "disabled");
        return __$ctx._.extend(_$1pp, _$1pa);
        return;
    }
    function $239(__$ctx) {
        if (!true === false) {
            if (!!__$ctx.elem === false) {
                var _$1octx = __$ctx.ctx, _$1oa = {
                    role: "button"
                };
                _$1octx.tabindex && (_$1oa.tabindex = _$1octx.tabindex);
                return _$1oa;
                return;
            } else {
                return $275(__$ctx);
            }
        } else {
            return $275(__$ctx);
        }
    }
    function $275(__$ctx) {
        return undefined;
        return;
    }
    function $276(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "button") {
            if (!__$ctx._formSelect === false) {
                if (!!__$ctx.elem === false) {
                    return [ {
                        block: __$ctx._formSelect.block,
                        elem: "button"
                    } ];
                    return;
                } else {
                    return $291(__$ctx);
                }
            } else {
                return $291(__$ctx);
            }
        } else if (__t === "b-page") {
            if (!!__$ctx.elem === false) {
                return [ {
                    elem: "body"
                } ];
                return;
            } else {
                return $291(__$ctx);
            }
        } else {
            return $291(__$ctx);
        }
    }
    function $291(__$ctx) {
        return undefined;
        return;
    }
    function $292(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "select" || __t === "button" || __t === "input" || __t === "checkbox") {
            if (!!__$ctx.elem === false) {
                return true;
                return;
            } else {
                return $314(__$ctx);
            }
        } else {
            return $314(__$ctx);
        }
    }
    function $314(__$ctx) {
        return undefined;
        return;
    }
    function $315(__$ctx) {
        var __t = __$ctx.block;
        if (__t === "b-page") {
            var __t = __$ctx.elem;
            if (__t === "js" || __t === "css" || __t === "favicon" || __t === "meta" || __t === "head" || __t === "root") {
                return false;
                return;
            } else {
                return $337(__$ctx);
            }
        } else if (__t === "i-ua") {
            if (!!__$ctx.elem === false) {
                return false;
                return;
            } else {
                return $337(__$ctx);
            }
        } else {
            return $337(__$ctx);
        }
    }
    function $337(__$ctx) {
        return undefined;
        return;
    }
    function $338(__$ctx) {
        if (__$ctx.block === "b-page") {
            if (__$ctx.elem === "root") {
                return "i-ua_js_no i-ua_css_standard";
                return;
            } else {
                return $345(__$ctx);
            }
        } else {
            return $345(__$ctx);
        }
    }
    function $345(__$ctx) {
        return undefined;
        return;
    }
    function $349(__$ctx) {
        return __$ctx.ctx["x-ua-compatible"] === false ? false : {
            tag: "meta",
            attrs: {
                "http-equiv": "X-UA-Compatible",
                content: __$ctx.ctx["x-ua-compatible"] || "IE=edge"
            }
        };
        return;
    }
    function $357(__$ctx) {
        return __$ctx.ctx.doctype || "<!DOCTYPE html>";
        return;
    }
    function $363(__$ctx) {
        return undefined;
        return;
    }
    function $364(__$ctx) {
        if (!__$ctx.ctx === false) {
            if (!__$ctx.ctx.link === false) {
                if (!!__$ctx._.isSimple(__$ctx.ctx) === false) {
                    return $368(__$ctx);
                } else {
                    return $373(__$ctx);
                }
            } else {
                return $373(__$ctx);
            }
        } else {
            return $373(__$ctx);
        }
    }
    function $368(__$ctx) {
        var __r47, __r48;
        function _$6follow() {
            if (this.ctx.link === "no-follow") {
                return undefined;
            } else {
                undefined;
            }
            var data = this._links[this.ctx.link];
            return "", __r47 = this.ctx, this.ctx = data, __r48 = $1(__$ctx), this.ctx = __r47, "", __r48;
        }
        if (!cache || !__$ctx._cacheLog) {
            return _$6follow.call(__$ctx);
        } else {
            undefined;
        }
        var _$6contents = __$ctx._buf.slice(__$ctx._cachePos).join("");
        __$ctx._cachePos = __$ctx._buf.length;
        __$ctx._cacheLog.push(_$6contents, {
            log: __$ctx._localLog.slice(),
            link: __$ctx.ctx.link
        });
        var _$6res = _$6follow.call(__$ctx);
        __$ctx._cachePos = __$ctx._buf.length;
        return _$6res;
        return;
    }
    function $373(__$ctx) {
        if (!cache === false) {
            if (!__$ctx.ctx === false) {
                if (!__$ctx.ctx.cache === false) {
                    return $377(__$ctx);
                } else {
                    return $382(__$ctx);
                }
            } else {
                return $382(__$ctx);
            }
        } else {
            return $382(__$ctx);
        }
    }
    function $377(__$ctx) {
        var _$5cached;
        function _$5setProperty(obj, key, value) {
            if (key.length === 0) {
                return undefined;
            } else {
                undefined;
            }
            if (Array.isArray(value)) {
                var target = obj;
                for (var i = 0; i < value.length - 1; i++) {
                    target = target[value[i]];
                }
                value = target[value[i]];
            } else {
                undefined;
            }
            var host = obj, previous;
            for (var i = 0; i < key.length - 1; i++) {
                host = host[key[i]];
            }
            previous = host[key[i]];
            host[key[i]] = value;
            return previous;
        }
        if (_$5cached = cache.get(__$ctx.ctx.cache)) {
            var _$5oldLinks = __$ctx._links;
            if (__$ctx.ctx.links) {
                __$ctx._links = __$ctx.ctx.links;
            } else {
                undefined;
            }
            for (var _$5i = 0; _$5i < _$5cached.log.length; _$5i++) {
                if (typeof _$5cached.log[_$5i] === "string") {
                    __$ctx._buf.push(_$5cached.log[_$5i]);
                    continue;
                } else {
                    undefined;
                }
                var _$5log = _$5cached.log[_$5i], _$5reverseLog;
                _$5reverseLog = _$5log.log.map(function(entry) {
                    return {
                        key: entry[0],
                        value: _$5setProperty(this, entry[0], entry[1])
                    };
                }, __$ctx).reverse();
                {
                    "";
                    var __r37 = __$ctx.ctx, __r38 = __r37.cache;
                    __r37.cache = null;
                    var __r39 = __$ctx._cacheLog;
                    __$ctx._cacheLog = null;
                    var __r40 = __$ctx.ctx, __r41 = __r40.link;
                    __r40.link = _$5log.link;
                    $1(__$ctx);
                    __r37.cache = __r38;
                    __$ctx._cacheLog = __r39;
                    __r40.link = __r41;
                    "";
                }
                undefined;
                _$5reverseLog.forEach(function(entry) {
                    _$5setProperty(this, entry.key, entry.value);
                }, __$ctx);
            }
            __$ctx._links = _$5oldLinks;
            return _$5cached.res;
        } else {
            undefined;
        }
        var _$5cacheLog = [], _$5res;
        {
            "";
            var __r42 = __$ctx.ctx, __r43 = __r42.cache;
            __r42.cache = null;
            var __r44 = __$ctx._cachePos;
            __$ctx._cachePos = __$ctx._buf.length;
            var __r45 = __$ctx._cacheLog;
            __$ctx._cacheLog = _$5cacheLog;
            var __r46 = __$ctx._localLog;
            __$ctx._localLog = [];
            {
                _$5res = $1(__$ctx);
                var _$5tail = __$ctx._buf.slice(__$ctx._cachePos).join("");
                if (_$5tail) {
                    _$5cacheLog.push(_$5tail);
                } else {
                    undefined;
                }
            }
            __r42.cache = __r43;
            __$ctx._cachePos = __r44;
            __$ctx._cacheLog = __r45;
            __$ctx._localLog = __r46;
            "";
        }
        cache.set(__$ctx.ctx.cache, {
            log: _$5cacheLog,
            res: _$5res
        });
        return _$5res;
        return;
    }
    function $382(__$ctx) {
        var __t = __$ctx._mode;
        if (__t === "default") {
            return $384(__$ctx);
        } else if (__t === "") {
            if (!__$ctx._.isSimple(__$ctx.ctx) === false) {
                __$ctx._listLength--;
                var _$3ctx = __$ctx.ctx;
                (_$3ctx && _$3ctx !== true || _$3ctx === 0) && __$ctx._buf.push(_$3ctx);
                return;
            } else {
                if (!!__$ctx.ctx === false) {
                    __$ctx._listLength--;
                    return;
                } else {
                    if (!__$ctx._.isArray(__$ctx.ctx) === false) {
                        return $393(__$ctx);
                    } else {
                        if (!true === false) {
                            return $396(__$ctx);
                        } else {
                            return $e(__$ctx);
                        }
                    }
                }
            }
        } else {
            return $e(__$ctx);
        }
    }
    function $384(__$ctx) {
        var __r20, __r8, __r12, __r13, __r14, __r15, __r16, __r17, __r18, __r19, __r9, __r21, __r22, __r23, __r26, __r27, __r28, __r29, __r30, __r31;
        var _$4_this = __$ctx, _$4BEM_ = _$4_this.BEM, _$4v = __$ctx.ctx, _$4buf = __$ctx._buf, _$4tag;
        _$4tag = ("", __r8 = __$ctx._mode, __$ctx._mode = "tag", __r9 = $138(__$ctx), __$ctx._mode = __r8, "", __r9);
        typeof _$4tag != "undefined" || (_$4tag = _$4v.tag);
        typeof _$4tag != "undefined" || (_$4tag = "div");
        if (_$4tag) {
            var _$4jsParams, _$4js;
            if (__$ctx.block && _$4v.js !== false) {
                _$4js = ("", __r12 = __$ctx._mode, __$ctx._mode = "js", __r13 = $292(__$ctx), __$ctx._mode = __r12, "", __r13);
                _$4js = _$4js ? __$ctx._.extend(_$4v.js, _$4js === true ? {} : _$4js) : _$4v.js === true ? {} : _$4v.js;
                _$4js && ((_$4jsParams = {})[_$4BEM_.INTERNAL.buildClass(__$ctx.block, _$4v.elem)] = _$4js);
            } else {
                undefined;
            }
            _$4buf.push("<", _$4tag);
            var _$4isBEM = ("", __r14 = __$ctx._mode, __$ctx._mode = "bem", __r15 = $315(__$ctx), __$ctx._mode = __r14, "", __r15);
            typeof _$4isBEM != "undefined" || (_$4isBEM = typeof _$4v.bem != "undefined" ? _$4v.bem : _$4v.block || _$4v.elem);
            var _$4cls = ("", __r16 = __$ctx._mode, __$ctx._mode = "cls", __r17 = $338(__$ctx), __$ctx._mode = __r16, "", __r17);
            _$4cls || (_$4cls = _$4v.cls);
            var _$4addJSInitClass = _$4v.block && _$4jsParams;
            if (_$4isBEM || _$4cls) {
                _$4buf.push(' class="');
                if (_$4isBEM) {
                    _$4BEM_.INTERNAL.buildClasses(__$ctx.block, _$4v.elem, _$4v.elemMods || _$4v.mods, _$4buf);
                    var _$4mix = ("", __r18 = __$ctx._mode, __$ctx._mode = "mix", __r19 = $276(__$ctx), __$ctx._mode = __r18, "", __r19);
                    _$4v.mix && (_$4mix = _$4mix ? _$4mix.concat(_$4v.mix) : _$4v.mix);
                    if (_$4mix) {
                        var _$4visited = {};
                        function _$4visitedKey(block, elem) {
                            return (block || "") + "__" + (elem || "");
                        }
                        _$4visited[_$4visitedKey(__$ctx.block, __$ctx.elem)] = true;
                        if (!__$ctx._.isArray(_$4mix)) {
                            _$4mix = [ _$4mix ];
                        } else {
                            undefined;
                        }
                        for (var _$4i = 0; _$4i < _$4mix.length; _$4i++) {
                            var _$4mixItem = _$4mix[_$4i];
                            if (!_$4mixItem) {
                                continue;
                            } else {
                                undefined;
                            }
                            var _$4hasItem = _$4mixItem.block || _$4mixItem.elem, _$4block = _$4mixItem.block || _$4mixItem._block || _$4_this.block, _$4elem = _$4mixItem.elem || _$4mixItem._elem || _$4_this.elem;
                            _$4hasItem && _$4buf.push(" ");
                            _$4BEM_.INTERNAL[_$4hasItem ? "buildClasses" : "buildModsClasses"](_$4block, _$4mixItem.elem || _$4mixItem._elem || (_$4mixItem.block ? undefined : _$4_this.elem), _$4mixItem.elemMods || _$4mixItem.mods, _$4buf);
                            if (_$4mixItem.js) {
                                (_$4jsParams || (_$4jsParams = {}))[_$4BEM_.INTERNAL.buildClass(_$4block, _$4mixItem.elem)] = _$4mixItem.js === true ? {} : _$4mixItem.js;
                                _$4addJSInitClass || (_$4addJSInitClass = _$4block && !_$4mixItem.elem);
                            } else {
                                undefined;
                            }
                            if (_$4hasItem && !_$4visited[_$4visitedKey(_$4block, _$4elem)]) {
                                _$4visited[_$4visitedKey(_$4block, _$4elem)] = true;
                                var _$4nestedMix = ("", __r20 = __$ctx.block, __$ctx.block = _$4block, __r21 = __$ctx.elem, __$ctx.elem = _$4elem, __r22 = __$ctx._mode, __$ctx._mode = "mix", __r23 = $276(__$ctx), __$ctx.block = __r20, __$ctx.elem = __r21, __$ctx._mode = __r22, "", __r23);
                                if (_$4nestedMix) {
                                    for (var _$4j = 0; _$4j < _$4nestedMix.length; _$4j++) {
                                        var _$4nestedItem = _$4nestedMix[_$4j];
                                        if (!_$4nestedItem.block && !_$4nestedItem.elem || !_$4visited[_$4visitedKey(_$4nestedItem.block, _$4nestedItem.elem)]) {
                                            _$4nestedItem._block = _$4block;
                                            _$4nestedItem._elem = _$4elem;
                                            _$4mix.splice(_$4i + 1, 0, _$4nestedItem);
                                        } else {
                                            undefined;
                                        }
                                    }
                                } else {
                                    undefined;
                                }
                            } else {
                                undefined;
                            }
                        }
                    } else {
                        undefined;
                    }
                } else {
                    undefined;
                }
                _$4cls && _$4buf.push(_$4isBEM ? " " : "", _$4cls);
                _$4addJSInitClass && _$4buf.push(" i-bem");
                _$4buf.push('"');
            } else {
                undefined;
            }
            if (_$4jsParams) {
                var _$4jsAttr = ("", __r26 = __$ctx._mode, __$ctx._mode = "jsAttr", __r27 = $363(__$ctx), __$ctx._mode = __r26, "", __r27);
                _$4buf.push(" ", _$4jsAttr || "onclick", '="return ', __$ctx._.attrEscape(JSON.stringify(_$4jsParams)), '"');
            } else {
                undefined;
            }
            var _$4attrs = ("", __r28 = __$ctx._mode, __$ctx._mode = "attrs", __r29 = $215(__$ctx), __$ctx._mode = __r28, "", __r29);
            _$4attrs = __$ctx._.extend(_$4attrs, _$4v.attrs);
            if (_$4attrs) {
                var _$4name;
                for (_$4name in _$4attrs) {
                    if (_$4attrs[_$4name] === undefined) {
                        continue;
                    } else {
                        undefined;
                    }
                    _$4buf.push(" ", _$4name, '="', __$ctx._.attrEscape(_$4attrs[_$4name]), '"');
                }
            } else {
                undefined;
            }
        } else {
            undefined;
        }
        if (__$ctx._.isShortTag(_$4tag)) {
            _$4buf.push("/>");
        } else {
            _$4tag && _$4buf.push(">");
            var _$4content = ("", __r30 = __$ctx._mode, __$ctx._mode = "content", __r31 = $107(__$ctx), __$ctx._mode = __r30, "", __r31);
            if (_$4content || _$4content === 0) {
                var _$4isBEM = __$ctx.block || __$ctx.elem;
                {
                    "";
                    var __r32 = __$ctx._notNewList;
                    __$ctx._notNewList = false;
                    var __r33 = __$ctx.position;
                    __$ctx.position = _$4isBEM ? 1 : __$ctx.position;
                    var __r34 = __$ctx._listLength;
                    __$ctx._listLength = _$4isBEM ? 1 : __$ctx._listLength;
                    var __r35 = __$ctx.ctx;
                    __$ctx.ctx = _$4content;
                    var __r36 = __$ctx._mode;
                    __$ctx._mode = "";
                    $364(__$ctx);
                    __$ctx._notNewList = __r32;
                    __$ctx.position = __r33;
                    __$ctx._listLength = __r34;
                    __$ctx.ctx = __r35;
                    __$ctx._mode = __r36;
                    "";
                }
                undefined;
            } else {
                undefined;
            }
            _$4tag && _$4buf.push("</", _$4tag, ">");
        }
        return;
    }
    function $393(__$ctx) {
        var _$1v = __$ctx.ctx, _$1l = _$1v.length, _$1i = 0, _$1prevPos = __$ctx.position, _$1prevNotNewList = __$ctx._notNewList;
        if (_$1prevNotNewList) {
            __$ctx._listLength += _$1l - 1;
        } else {
            __$ctx.position = 0;
            __$ctx._listLength = _$1l;
        }
        __$ctx._notNewList = true;
        while (_$1i < _$1l) {
            var _$1newCtx = _$1v[_$1i++];
            {
                "";
                var __r7 = __$ctx.ctx;
                __$ctx.ctx = _$1newCtx == null ? "" : _$1newCtx;
                $364(__$ctx);
                __$ctx.ctx = __r7;
                "";
            }
            undefined;
        }
        _$1prevNotNewList || (__$ctx.position = _$1prevPos);
        return;
    }
    function $396(__$ctx) {
        var _$0vBlock = __$ctx.ctx.block, _$0vElem = __$ctx.ctx.elem, _$0block = __$ctx._currBlock || __$ctx.block;
        __$ctx.ctx || (__$ctx.ctx = {});
        {
            "";
            var __r0 = __$ctx._mode;
            __$ctx._mode = "default";
            var __r1 = __$ctx._links;
            __$ctx._links = __$ctx.ctx.links || __$ctx._links;
            var __r2 = __$ctx.block;
            __$ctx.block = _$0vBlock || (_$0vElem ? _$0block : undefined);
            var __r3 = __$ctx._currBlock;
            __$ctx._currBlock = _$0vBlock || _$0vElem ? undefined : _$0block;
            var __r4 = __$ctx.elem;
            __$ctx.elem = __$ctx.ctx.elem;
            var __r5 = __$ctx.mods;
            __$ctx.mods = (_$0vBlock ? __$ctx.ctx.mods : __$ctx.mods) || {};
            var __r6 = __$ctx.elemMods;
            __$ctx.elemMods = __$ctx.ctx.elemMods || {};
            {
                __$ctx.block || __$ctx.elem ? __$ctx.position = (__$ctx.position || 0) + 1 : __$ctx._listLength--;
                $2(__$ctx);
                undefined;
            }
            __$ctx._mode = __r0;
            __$ctx._links = __r1;
            __$ctx.block = __r2;
            __$ctx._currBlock = __r3;
            __$ctx.elem = __r4;
            __$ctx.mods = __r5;
            __$ctx.elemMods = __r6;
            "";
        }
        return;
    }
    function $e(__$ctx) {
        throw new Error(this);
        return;
    }
    !function oninit() {
        var BEM_ = {}, toString = Object.prototype.toString, SHORT_TAGS = {
            area: 1,
            base: 1,
            br: 1,
            col: 1,
            command: 1,
            embed: 1,
            hr: 1,
            img: 1,
            input: 1,
            keygen: 1,
            link: 1,
            meta: 1,
            param: 1,
            source: 1,
            wbr: 1
        };
        (function(BEM, undefined) {
            var MOD_DELIM = "_", ELEM_DELIM = "__", NAME_PATTERN = "[a-zA-Z0-9-]+";
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
                NAME_PATTERN: NAME_PATTERN,
                MOD_DELIM: MOD_DELIM,
                ELEM_DELIM: ELEM_DELIM,
                buildModPostfix: function(modName, modVal, buffer) {
                    var res = buffer || [];
                    buildModPostfix(modName, modVal, res);
                    return buffer ? res : res.join("");
                },
                buildClass: function(block, elem, modName, modVal, buffer) {
                    var typeOf = typeof modName;
                    if (typeOf == "string") {
                        if (typeof modVal != "string") {
                            buffer = modVal;
                            modVal = modName;
                            modName = elem;
                            elem = undefined;
                        } else {
                            undefined;
                        }
                    } else {
                        if (typeOf != "undefined") {
                            buffer = modName;
                            modName = undefined;
                        } else {
                            if (elem && typeof elem != "string") {
                                buffer = elem;
                                elem = undefined;
                            } else {
                                undefined;
                            }
                        }
                    }
                    if (!(elem || modName || buffer)) {
                        return block;
                    } else {
                        undefined;
                    }
                    var res = buffer || [];
                    elem ? buildElemClass(block, elem, modName, modVal, res) : buildBlockClass(block, modName, modVal, res);
                    return buffer ? res : res.join("");
                },
                buildModsClasses: function(block, elem, mods, buffer) {
                    var res = buffer || [];
                    if (mods) {
                        var modName;
                        for (modName in mods) {
                            if (!mods.hasOwnProperty(modName)) {
                                continue;
                            } else {
                                undefined;
                            }
                            var modVal = mods[modName];
                            if (modVal == null) {
                                continue;
                            } else {
                                undefined;
                            }
                            modVal = mods[modName] + "";
                            if (!modVal) {
                                continue;
                            } else {
                                undefined;
                            }
                            res.push(" ");
                            if (elem) {
                                buildElemClass(block, elem, modName, modVal, res);
                            } else {
                                buildBlockClass(block, modName, modVal, res);
                            }
                        }
                    } else {
                        undefined;
                    }
                    return buffer ? res : res.join("");
                },
                buildClasses: function(block, elem, mods, buffer) {
                    var res = buffer || [];
                    elem ? buildElemClass(block, elem, undefined, undefined, res) : buildBlockClass(block, undefined, undefined, res);
                    this.buildModsClasses(block, elem, mods, buffer);
                    return buffer ? res : res.join("");
                }
            };
        })(BEM_);
        var buildEscape = function() {
            var ts = {
                '"': "&quot;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;"
            }, f = function(t) {
                return ts[t] || t;
            };
            return function(r) {
                r = new RegExp(r, "g");
                return function(s) {
                    return ("" + s).replace(r, f);
                };
            };
        }();
        function BEMContext(context, apply_) {
            this.ctx = typeof context === null ? "" : context;
            this.apply = apply_;
            this._buf = [];
            this._ = this;
            this._start = true;
            this._mode = "";
            this._listLength = 0;
            this._notNewList = false;
            this.position = 0;
            this.block = undefined;
            this.elem = undefined;
            this.mods = undefined;
            this.elemMods = undefined;
        }
        BEMContext.prototype.isArray = function isArray(obj) {
            return toString.call(obj) === "[object Array]";
        };
        BEMContext.prototype.isSimple = function isSimple(obj) {
            var t = typeof obj;
            return t === "string" || t === "number" || t === "boolean";
        };
        BEMContext.prototype.isShortTag = function isShortTag(t) {
            return SHORT_TAGS.hasOwnProperty(t);
        };
        BEMContext.prototype.extend = function extend(o1, o2) {
            if (!o1 || !o2) {
                return o1 || o2;
            } else {
                undefined;
            }
            var res = {}, n;
            for (n in o1) {
                o1.hasOwnProperty(n) && (res[n] = o1[n]);
            }
            for (n in o2) {
                o2.hasOwnProperty(n) && (res[n] = o2[n]);
            }
            return res;
        };
        BEMContext.prototype.identify = function() {
            var cnt = 0, id = BEM_["__id"] = +(new Date), expando = "__" + id, get = function() {
                return "uniq" + id + ++cnt;
            };
            return function(obj, onlyGet) {
                if (!obj) {
                    return get();
                } else {
                    undefined;
                }
                if (onlyGet || obj[expando]) {
                    return obj[expando];
                } else {
                    return obj[expando] = get();
                }
            };
        }();
        BEMContext.prototype.xmlEscape = buildEscape("[&<>]");
        BEMContext.prototype.attrEscape = buildEscape('["&<>]');
        BEMContext.prototype.BEM = BEM_;
        BEMContext.prototype.isFirst = function isFirst() {
            return this.position === 1;
        };
        BEMContext.prototype.isLast = function isLast() {
            return this.position === this._listLength;
        };
        BEMContext.prototype.generateId = function generateId() {
            return this.identify(this.ctx);
        };
        exports.apply = BEMContext.apply = function _apply() {
            var ctx = new BEMContext(this, apply);
            ctx.apply();
            return ctx._buf.join("");
        };
    }();
    return exports;
    exports.apply = apply;
    function apply(ctx) {
        return applyc(ctx || this);
    }
    function applyc(__$ctx) {
        return $1(__$ctx);
    }
    return exports;
})(typeof exports === "undefined" ? {} : exports);;
  return function(options) {
    var context = this;
    if (!options) options = {};
    cache = options.cache;
    return function() {
      if (context === this) context = undefined;
      return xjst.apply.call(
[context]
      );
    }.call(null);
  };
}();
typeof exports === "undefined" || (exports.BEMHTML = BEMHTML);