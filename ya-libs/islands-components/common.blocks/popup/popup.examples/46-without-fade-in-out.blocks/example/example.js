BEM.DOM.decl('example', {
    'onSetMod' : {

        'js' : function() {

            this.findBlocksInside('example-section').forEach(function(section) {

                var owner = section.findBlockInside('owner'),
                    popup = section
                        .findBlockInside('popup')
                        .show(owner);

                owner.bindTo('leftclick', function() { popup.toggle(owner); });

            });

        }

    }
});
