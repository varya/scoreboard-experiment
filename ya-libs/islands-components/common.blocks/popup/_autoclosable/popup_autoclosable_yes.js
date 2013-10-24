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
