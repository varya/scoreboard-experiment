BEM.DOM.decl({
    block: 'popup',
    modName: 'position',
    modVal: 'fixed'
}, {

    addChild : function(child) {
        this.__base.apply(this, arguments);

        child.setMod('watch-scroll', 'no');
    }

});
