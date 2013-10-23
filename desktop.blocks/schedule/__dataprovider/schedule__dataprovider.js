BEM.decl({ name : 'schedule__dataprovider', baseBlock : 'i-request_type_ajax' }, {

    get : function(request, callback) {

        return this.__base(
            { part : request },
            function(data) {
                callback.call(this, data.response)
            });

    }

});
