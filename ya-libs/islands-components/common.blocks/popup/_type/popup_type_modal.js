BEM.DOM.decl({
    block : 'popup',
    modName : 'type',
    modVal : 'modal'
}, {

    getDefaultParams : function() {
        var params = this.__base();

        params.top = '50%';
        params.left = '50%';

        return params;
    },

    /**
     * Проверяет значение переменной на соответствие строковому типу и
     * наличие знака `%`
     * @private
     * @param {*} val
     * @returns {Boolean}
     */
    _isPercentVal : function(val) {
        return typeof val == 'string' && val.indexOf('%') > 0;
    },

    /**
     * Показывает попап
     * @protected
     * @overrides
     * @param {Object} [position] - координаты `left`, `top`
     * @return {BEM}
     */
    show : function(position) {

        this._moveToContainer();

        /**
         * XXX: Необходимо показать блок для подсчета его размеров
         */
        this.setMod('visibility', 'outside')
            .setMod('adaptive', 'no');

        position ||
            (position = {
                left: this.params.left,
                top: this.params.top
            });

        var popupSize = this.getPopupSize();

        (this._isPercentVal(position.left) && !position.marginLeft) &&
            (position.marginLeft = popupSize.width / -(100 / parseInt(position.left, 10)));

        (this._isPercentVal(position.top) && !position.marginTop) &&
            (position.marginTop = popupSize.height / -(100 / parseInt(position.top, 10)));

        this._show(position);

        return this;

    }

});
