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

