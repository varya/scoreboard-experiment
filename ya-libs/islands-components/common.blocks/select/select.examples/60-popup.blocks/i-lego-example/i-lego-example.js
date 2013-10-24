(function(){

BEM.DOM.decl('i-lego-example', {

    onSetMod: {

        js: function() {

            var popup = this.findBlockInside('popup');
            this.findBlockInside('b-link').on('click', function(e) {
                popup.show(e.block.domElem);
            });

        }

    }

});

}());