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
