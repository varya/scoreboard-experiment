BEM.DOM.decl('example', {
    'onSetMod' : {

        'js' : function() {

            var owner = this.findBlockInside('owner'),
                popup = this
                    .findBlockInside('popup')
                    .show(owner);

            owner.bindTo('leftclick', function() {
                popup.toggle(owner);
            });

        }

    }
});
