BEM.DOM.decl({'name': 'button', 'modName': 'pseudo', 'modVal': 'yes'}, {

    _onClick : function(e) {

        this.__base.apply(this, arguments);

        this._href && e.preventDefault();

    }

});
