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
