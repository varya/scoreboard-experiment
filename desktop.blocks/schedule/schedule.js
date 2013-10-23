BEM.DOM.decl({ block: 'schedule', baseBlock: 'i-glue' }, {
    onSetMod: {
        'js' : {
            'inited' : function() {
                this.__base();

                this.modelPath = this.model.path();

                this.model
                    .on('list', 'add', function(e, data){
                        BEM.DOM.append(this.elem('events'), this._generateScheduleItem(data.model));
                    }, this);

                this._initSchedule();

            }
        }
    },

    _initSchedule: function() {

        var schedule = this;

        loader('/data/schedule.json', function(competitions) {
            var collection = schedule.model.set('list', competitions)
            schedule.updateSchedule(schedule.model.get('list'));
        });

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
    }

});
