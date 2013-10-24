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
