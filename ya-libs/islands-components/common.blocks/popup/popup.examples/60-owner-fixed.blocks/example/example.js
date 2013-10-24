BEM.DOM.decl('example', {
    'onSetMod' : {

        'js' : function() {

            var owner = this.findBlockInside('owner'),
                popup = this
                    .findBlockInside('popup');

            owner.bindTo('leftclick', function() {
                popup.toggle(owner);
            });

        }

    }
});
