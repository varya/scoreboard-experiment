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
