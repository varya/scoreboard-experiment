(function() {

BEM.DOM.decl('i-lego-example', {

    onSetMod : {

        'js' : function() {

            var kSelect = this.findBlockInside('select');

            kSelect.on('change', function(e, data) {
                $('#val').text('// ' + this.val());
                $('#index').text(data.index);
            });

            kSelect.trigger('change', { index: 1 });

            this.findBlocksInside('b-link').forEach(function(block, i) {
                block.on('click', function() {
                    kSelect.val(this.params.val);
                });
            });

        }

    }

});

}());
