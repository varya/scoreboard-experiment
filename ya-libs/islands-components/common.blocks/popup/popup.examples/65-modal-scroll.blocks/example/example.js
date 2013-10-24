BEM.DOM.decl('example', {
    'onSetMod' : {

        'js' : function() {

            var button = this.findBlockInside('button'),
                popup = this
                    .findBlockInside('popup')
                    .show();

            button.bindTo('leftclick', function() {
                popup.show();
            });

        }

    }
});
