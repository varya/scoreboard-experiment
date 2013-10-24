BEM.DOM.decl({
    block: 'popup',
    modName: 'wrapped',
    modVal: 'yes'
}, {

    onSetMod : {

        'visibility' : {

            'visible' : function() {

                this.__base();
                this._wrap();

            },

            '' : function() {

                this.__base();
                this._unwrap();

            }

        },

        'wrapped' : {
            '' : function() {
                this._unwrap();
            }
        }

    },

    _wrap : function() {

        this._wrapper || (this._wrapper = this.elem('wrapper').detach());

        if(!this._wrapper) {
            return;
        }

        this.domElem.wrap(this._wrapper);

    },

    _unwrap : function() {

        this._wrapper &&
            this.domElem.unwrap();

    },

    destruct: function() {

        this._unwrap();

        this.__base();

    }

});
