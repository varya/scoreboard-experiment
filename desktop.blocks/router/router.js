var AppRouter = Backbone.Router.extend({

    routes: {
        "event/:id": "event"
    }

});

BEM.router = new AppRouter;

                BEM.router.on('route:event', function(){
                    console.log('router works2');
                });

