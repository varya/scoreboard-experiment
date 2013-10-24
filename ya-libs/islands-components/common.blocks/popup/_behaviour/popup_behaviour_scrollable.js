BEM.DOM.decl({
    block: 'popup',
    modName: 'behaviour',
    modVal: 'scrollable'
}, {

    getDefaultParams : function() {
        var params = this.__base();

        params.top = 20;

        return params;
    }

});
