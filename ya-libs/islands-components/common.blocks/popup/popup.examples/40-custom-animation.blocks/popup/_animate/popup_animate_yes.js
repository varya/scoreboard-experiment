BEM.DOM.decl({
    block: 'popup',
    modName: 'animate',
    modVal: 'yes'
}, {
    afterShow : function() {
        var direction = this.getCurrDirection();

        /**
         * ВНИМАНИЕ!
         * У popup_position_fixed нет направления раскрытия!
         */
        if(!direction) {
            return;
        }

        var position = this.getCurrPos(),
            popupSize = this.getPopupSize(),
            tailOpts = this.params.tail;

        this
            .domElem
            .css({ left: position.left, top: -(popupSize.height + tailOpts.height), opacity: 0 })
            .stop()
            .animate({
                opacity: 1,
                top: position.top
            }, 500);

    },

    beforeHide : function(callback) {

        var direction = this.getCurrDirection();

        /**
         * ВНИМАНИЕ!
         * У popup_position_fixed нет направления раскрытия!
         * Если не вызвать callback, то модификатор visibility_visible не будет удалён
         */
        if(!direction) {
            return callback();
        }

        var popupSize = this.getPopupSize(),
            tailOpts = this.params.tail;

        this
            .domElem
            .stop()
            .animate({
                opacity: 0,
                top: -(popupSize.height + tailOpts.height)
            }, 500, callback);
    }
});
