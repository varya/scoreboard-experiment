BEM.DOM.decl({
    block: 'popup',
    modName: 'body-scroll',
    modVal: 'no'
}, {

    onSetMod : {

        'visibility' : {
            'visible' : function() {

                this.__base();

                this._scope.css({
                    overflow: 'hidden'
                });

            },

            '' : function() {

                this.__base();

                this._scope.css({
                    overflow: ''
                });

            }

        }

    }

});
