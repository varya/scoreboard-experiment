/**
 * @name API
 * @namespace
 * Эта модификация блока ##i-request## предназначена для
 * отправки запросов и уведомлений по протоколу JSON-RPC 2.0.
 *
 * * Общая информация: [[http://en.wikipedia.org/wiki/JSON-RPC en.wikipedia.org/wiki/JSON-RPC]]
 * * Спецификация (2.0): [[http://jsonrpc.org/specification jsonrpc.org/specification]]
 *
 * Особенности:
 * * Скрипт используется клиентской стороной.
 * * [[http://www.jsonrpc.org/specification#batch Группировка]] не поддерживается, запросы отправляются по одному.
 * * Транспорт: HTTP (##$.ajax##)
 * * Тип: POST (содоменные), GET + jsonp (кроссдоменные)
 * * Кеширование по умолчанию выключено
 *
 * Блок не имеет DOM-представления, его нужно прописать
 * в каком-нибудь ##deps.js##, который учитывается при сборке страницы.
 *
 * Создается динамически в других блоках с помощью
 * ##BEM.create('i-request_type_jsonrpc', {...})##.
 * Вторым аргументом передаются парметры блока.
 *
 * Получив инстанс этого блока, его можно
 * многократно использовать, вызывая методы ##get## и ##notify##.
 *
 * Метод ##get## наследуется от базового блока и, соответственно, имеет такую же сигнатуру.
 * Важно лишь понимать, что запрос за данными идет по протоколу JSON-RPC.
 * К примеру колбеки, которые передаются в метод, не про HTTP, а про JSON-RPC, т.е,
 * если с кодом 200 пришла JSON-RPC ошибка, будет вызван onError.
 *
 * Для конкретного вызова параметры, заданные в момент создания блока,
 * можно переопределить.
 */
BEM.decl({ block: 'i-request_type_jsonrpc', baseBlock: 'i-request' }, /** @lends API.prototype */ {

    _get: function(request, onSuccess, onError, params) {

        this._formalizeRequestData(request);

        this.__base.apply(this, arguments);
    },

    /**
     * 'Уведомление': тип запроса, специфичный для JSON-RPC.
     * Сервер может не подтверждать получение такого запроса.
     *
     * @param {Object} [request] Объект с полями method и params
     * @param {Object} [params] Параметры блока
     * @returns {Object} this
     */
    notify: function(request, params) {

        this._formalizeRequestData(request, true);

        this._do(request, false, false, $.extend({}, this.params, params));

        return this;
    },

    /**
     * Формирует валидный объект для отправки
     * запроса или уведомления по протоколу JSON-RPC.
     *
     * @private
     * @param {Object} rawData данные от пользователя
     * @param {Boolean} [isNotification=false]
     * @returns {Object}
     */
    _formalizeRequestData: function(rawData, isNotification) {

        rawData || (rawData = {});

        var mustData = {
                jsonrpc: '2.0',
                method: rawData.method || this.params.data.method,
                params: rawData.params || this.params.data.params
            };

        isNotification || (mustData.id = Math.random().toFixed(10)*1e10);

        return $.extend(rawData, mustData);
    },

    _do: function(request, onSuccess, onError, params) {

        var ajax;

        if (!params.url) {
            throw this._errors.emptyURL;
        }

        params.data = request;

        this._adaptToEnv(params);

        ajax = $.ajax(this._grabAjaxSettings(params));

        // не уведомление: привязываем колбеки
        if (request.id) {

            ajax.done((function(data) {

                // некоторые серверные реализации отдают
                // jsonrpc-ошибки с http-кодом 200
                if (data.error) {
                    onError && onError.call(params.callbackCtx, data.error);
                }
                else if (data.result) {
                    this._onSuccess(this._buildCacheKey(request, params), request, data.result, params);
                    onSuccess && onSuccess.call(params.callbackCtx, data.result);
                }
                else {
                    throw this._errors.invalidSuccessReply;
                }

            }).bind(this));

            ajax.fail((function(data) {

                if (data.error) {
                    onError && onError.call(params.callbackCtx, data.error);
                }
                else if (params.retryCount-- > 0) {

                    setTimeout((function() {
                        this._do(request, onSuccess, onError, params);
                    }).bind(this), params.retryInterval);

                }
                else {
                    throw this._errors.invalidErrorReply;
                }
            }).bind(this));
        }
    },

    _adaptToEnv: function(params) {

        var l = location,
            isOrigin = RegExp('^(?!https?:)|(' + l.protocol + '//' + l.host + ')'),
            originSet = {
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(params.data)
            },
            thirdPartySet = {
                // некоторые серверные реализации ждут данные,
                // раскиданные по cgi-параметрам,
                // некоторые ждут честную json-строку в параметре json.
                type: 'GET',
                dataType: 'jsonp',
                data: $.extend(params.data, {json: JSON.stringify(params.data)})
            };

        return $.extend(params, isOrigin.test(params.url) ? originSet : thirdPartySet);
    },

    _grabAjaxSettings: function(params) {

        var allowed = [
                'url', 'data', 'type', 'dataType', 'contentType',
                'timeout', 'jsonp', 'jsonpCallback',
                'success', 'error'
            ].concat(params.paramsToSettings || []),
            result = {};

        allowed.filter(params.hasOwnProperty, params).forEach(function(name) {
            result[name] = params[name];
        });

        return result;
    },

    _buildCacheKey: function(obj, params) {

        return typeof obj == 'string'
            ? obj
            // Поля id и json (в нем дублируется id) уникальны для каждого запроса,
            // поэтому при кэшировании считаем их незначимыми.
            : $.param($.extend({}, obj, {id:'', json: '', url: params.url}));
    },

    _errors: {
        emptyURL: {
            message: 'i-request_type_jsonrpc: не передан url.'
        },
        invalidSuccessReply: {
            message: 'i-request_type_jsonrpc: ' +
                     'сервер вернул 200 с невалидными jsonrpc-данными.'
        },
        invalidErrorReply: {
            message: 'i-request_type_jsonrpc: ' +
                     'сервер вернул ошибку с невалидными jsonrpc-данными.'
        }
    },

    getDefaultParams: function() {

        return $.extend(
            this.__base(),
            {
                data: {
                    method: 'system.listMethods',
                    params: []
                },
                timeout : 20000,
                retryCount : 0,
                retryInterval : 2000
            }
        )
    }
});