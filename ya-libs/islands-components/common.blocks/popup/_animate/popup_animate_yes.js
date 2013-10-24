BEM.DOM.decl({
    block: 'popup',
    modName: 'animate',
    modVal: 'yes'
}, {

    /**
     * Выполняется при показе блока(когда модификатор visibility_visible уже установлен)
     * Позволяет реализовать эффекты для вывода блока
     * @public
     */
    afterShow : function() {

        var direction = this.getCurrDirection();

        if(!direction) {
            return;
        }

        var to = direction.to,
            position = this.getCurrPos(),
            popupSize = this.getPopupSize(),
            tailOpts = this.params.tail,
            animateOpts = {
                opacity: 1,
                top: position.top,
                left: position.left
            },
            cssOpts = {
                opacity: 0,
                top: position.top,
                left: position.left
            };

        if(to == 'bottom') {
            cssOpts.top += 10;
        } else if(to == 'top') {
            cssOpts.top -= 10;
        } else if(to == 'left') {
            cssOpts.left -= 10;
        } else if(to == 'right') {
            cssOpts.left += 10;
        }

        this
            .domElem
            .stop(true) // NOTE: Не нужно, чтобы выполнялся callback
            .css(cssOpts)
            .animate(animateOpts, this.params.duration);

    },

    /**
     * Выполняется при скрытии блока(когда модификатор visibility_visible ещё не снят)
     * Позволяет реализовать эффекты для скрытия блока
     * @public
     * @param {Function} callback
     */
    beforeHide : function(callback) {

        var direction = this.getCurrDirection();

        if(!direction) {
            return callback();
        }

        var to = direction.to,
            position = this.getCurrPos(),
            popupSize = this.getPopupSize(),
            tailOpts = this.params.tail,
            domElem = this.domElem,
            animateOpts = {
                top: position.top,
                left: position.left,
                opacity: 0
            };

        if(to == 'bottom') {
            animateOpts.top += 10;
        } else if(to == 'top') {
            animateOpts.top -= 10;
        } else if(to == 'left') {
            animateOpts.left -= 10;
        } else if(to == 'right') {
            animateOpts.left += 10;
        }

        return domElem
            .stop(true, true)
            .animate(animateOpts, this.params.duration, function() {

                callback();

                domElem.css('opacity', '');

            }); // NOTE: нужно убрать модификатор visibility_visible только по окончанию эффекта

    }

});
