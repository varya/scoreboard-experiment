BEM.MODEL.decl('schedule', {

    list: {
        type: 'models-list',
        modelName: 'schedule-item'
    }

});

BEM.MODEL.decl('schedule-item', {
    id: 'string',
    time: 'string',
    'event-name': 'string',
    now: 'boolean'
});

BEM.DOM.decl({ block: 'schedule', baseBlock: 'i-glue' }, {
    onSetMod: {
        'js' : {
            'inited' : function() {

                this.__base();

                this._selectControl = this.findBlockInside(this.elem('select'), 'select');

                this.modelPath = this.model.path();

                BEM.router.on('route', function(){
                    console.log('router works');
                });

                this._selectControl.on('change', function(data){
                    BEM.router.navigate('event/' + this._selectControl.val());
                }, this);

                this.model
                    .on('list', 'add', function(e, data){
                        BEM.DOM.append(this.elem('events'), this._generateScheduleItem(data.model));
                        this._selectControl.redraw();
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
                var collection = schedule.model.set('list', competitions);

                var currentEvent = collection.get('list').where({ now: true })[0];
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
            selected: event.get('now'),
            id: event.get('id'),
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
