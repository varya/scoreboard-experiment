BEM.DOM.decl('example', {
    'onSetMod' : {

        'js' : function() {

            var pos = { top: 50, left: 50 },
                popup = this.findBlockInside('popup').show(pos);

        }

    }
});
