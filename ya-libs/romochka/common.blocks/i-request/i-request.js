(function() {

var cache = {};

BEM.decl('i-request', {

    onSetMod : {

        'js' : function() {

            this._preventCache = false;

        }

    },

    get : function(request, onSuccess, onError, params) {

        if(!$.isFunction(onError)) {
            params = onError;
            onError = this.params.onError;
        }

        this._get(request, onSuccess, onError, $.extend({}, this.params, params));

    },

    _get : function(request, onSuccess, onError, params) {

        var key = this._buildCacheKey(request, params),
            cacheGroup = cache[params.cacheGroup];

        params.cache && cacheGroup && key in cacheGroup.data?
            this.afterCurrentEvent(function() {
                onSuccess.call(this.params.callbackCtx, cacheGroup.data[key])
            }, this) :
            this._do(request, onSuccess, onError, params);
    },

    _do : function(request, onSuccess, onError, params) {},

    _onSuccess : function(requestKey, request, data, params) {

        params.cache && !this._preventCache && this.putToCache(params, requestKey, data);
        this._preventCache = false;

    },

    _buildCacheKey : function(obj, params) {

        return typeof obj == 'string' ? obj : $.param(obj);

    },

    putToCache : function(params, request, data) {

        var cacheGroup = cache[params.cacheGroup] || (cache[params.cacheGroup] = { keys : [], data : {}});

        if(cacheGroup.keys.length >= params.cacheSize) {
            delete cacheGroup.data[cacheGroup.keys.shift()];
        }

        var key = this._buildCacheKey(request, params);

        cacheGroup.data[key] = data;
        cacheGroup.keys.push(key);
    },

    dropCache : function() {

        delete cache[this.params.cacheGroup];

    },

    getDefaultParams : function() {

        return {
            cache : false,
            cacheGroup : 'default',
            cacheSize : 100,
            callbackCtx : this
        };

    }

}, {

    _cache: cache

});

})();