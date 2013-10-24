BEM.MODEL.decl('schedule', {

    list: {
        type: 'models-list',
        modelName: 'schedule-item'
    }

});

BEM.MODEL.decl('schedule-item', {
    time: 'string',
    'event-name': 'string'
});

BEM.DOM.decl({ block: 'schedule', baseBlock: 'i-glue' }, {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.__base();

                this.location = BEM.blocks['i-location'].get();

                this.modelPath = this.model.path();

                this.model
                    .on('list', 'add', function(e, data){
                        BEM.DOM.append(this.elem('events'), this._generateScheduleItem(data.model));
                    }, this);

                this._initSchedule();

            }
        }
    },

    getDefaultParams: function() {

        return {
            dataprovider: {
                url: '/data/schedule.json',
                dataType: 'json'
            }
        }

    },

    _initSchedule: function() {

        var schedule = this;

        this.getDataprovider().get(
            {},
            function(competitions) {
                var collection = schedule.model.set('list', competitions)
                schedule.updateSchedule(schedule.model.get('list'));
            }
        );

    },

    updateSchedule: function(items) {
        this.elem('events').html('');

        items && BEM.DOM.update(this.elem('events'), BEMHTML.apply(items.map(this._generateScheduleItem, this)))
    },

    _generateScheduleItem: function(event) {
        return BEMHTML.apply({
            block: 'schedule',
            elem: 'event',
            parentPath: this.modelPath,
            time: event.get('time'),
            'event-name': event.get('event-name')
        })
    },

    getDataprovider: function() {
        var url = this.params.dataprovider.url;

        return this._dataprovider || (this._dataprovider = BEM.create(
            this.params.dataprovider.name || this.__self.getName() + '__dataprovider',
            $.extend(this.params.dataprovider, {
                url: url,
                callbackCtx : this
            })));
    }

});
