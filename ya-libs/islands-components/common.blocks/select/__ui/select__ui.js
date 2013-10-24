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