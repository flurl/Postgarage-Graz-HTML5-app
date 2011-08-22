app.controllers.events = new Ext.Controller({
    index: function(options) {
    	if (!app.isBigScreen()) {
	    	app.views.viewport.setActiveItem(
		        app.views.eventsList, options.animation
	    	);
	    }
    },
    show: function(options) {
    	console.log('show'+options.id);
    	var id = parseInt(options.id),
	        event = app.stores.events.getById(id);
	    if (event) {
	    	console.log('event available');
	        app.views.eventDetail.updateWithRecord(event);
	        if (!app.isBigScreen()) {
		 		var container = app.views.viewport;
		    } else {
		    	var container = app.views.viewport.getComponent('centerContainer');
		    }
	        container.setActiveItem(app.views.eventDetail, options.animation);
	    }
    },
    showImage: function(options) {
    	console.log('showImage: '+options.image);
    	var img = options.image;
    	app.views.image.updateImage(img);
    	if (!app.isBigScreen()) {
	 		var container = app.views.viewport;
	    } else {
	    	var container = app.views.viewport.getComponent('centerContainer');
	    }
		container.setActiveItem(app.views.image, options.animation);
    },
});