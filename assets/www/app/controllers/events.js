app.controllers.events = new Ext.Controller({
    index: function(options) {
    	if (!app.isBigScreen()) {
	    	app.views.viewport.setActiveItem(
		        app.views.eventsList, options.animation
	    	);
	    }
    },
    show: function(options) {
    	var id = parseInt(options.id),
	        event = app.views.eventsList.items.items[0].getStore().getById(id);
	    if (event) {
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