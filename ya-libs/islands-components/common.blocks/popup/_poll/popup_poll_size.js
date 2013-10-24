/**
 * Костылик, который позволяет избежать рассыпания попапа
 * при отсутствии указанных размеров и динамическом контенте
 * как в интентах, например LEGO-9028
 */
BEM.DOM.decl({
    block: 'popup',
    modName: 'poll',
    modVal: 'size'
}, {

    'onSetMod' : {
        'visibility' : {
            'outside' : function() {

                this.__base();

                /**
                 * Размер попапа на предыдущем тике
                 * @private
                 * @type {Object}
                 */
                this._prevSize = this.getPopupSize();

            }
        }
    },

    _onShown : function() {

        this.__base();

        /**
         * Интервал опроса размера попапа
         * @private
         */
        this._sizePollInterval ||
            (this._sizePollInterval = setInterval(this._sizePoller.bind(this),
                                                  this.params.sizePoll || 100));
    },

    /**
     * Перерисовывает попап если его размер изменился
     * @private
     */
    _sizePoller : function() {
        if(!this._isShown || this._isHiding) {
            return;
        }

        var currSize = this.getPopupSize(),
            currPos = this.getCurrPos();

        if(!this._prevSize || !this._prevPos ||
           this._prevSize.height != currSize.height ||
           this._prevSize.width != currSize.width ||
           this._prevPos.left != currPos.left ||
           this._prevPos.top != currPos.top) {

            this._prevSize = currSize;
            this._prevPos = currPos;

            this.repaint();

        }
    },

    _onHidden : function() {

        this.__base();

        clearInterval(this._sizePollInterval);

    }
});
