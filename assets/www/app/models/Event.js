app.models.Event = Ext.regModel('app.models.Event', {
    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'datetime', type: 'date', dateFormat: 'timestamp'},
        {name: 'short', type: 'string'},
        {name: 'bodytext', type: 'string'},
        {name: 'images', type: 'string', mapping: 'galleryimages'},
        {name: 'categories', type: 'string'},
        {name: 'files', type: 'string', mapping: 'news_files'},
        {name: 'link', type: 'string'},
    ],
    
   /* getDatetimeF: function() {
    	return this.get('datetime');
    },*/
});


/**************
* local Store
***************/
app.stores.localEvents = new Ext.data.Store({
	model: 'app.models.Event',
	clearOnPageLoad: false,
	pageSize: app.CONF.store_page_size,
	autoLoad: false,
	proxy: {
		idProperty: 'id',
		type: 'localstorage',
		id  : 'postgarage-localCache',
	},
});
//BUG WORKAROUND
//see http://www.sencha.com/forum/showthread.php?120884-OPEN-719-(1.0.1a)-Store.snapshot-contains-corrupt-data.
app.stores.localEvents.on('load', function (store) {
    store.snapshot = store.data;
});

app.stores.localEvents.addListener('beforesync', function(options) {
	//save the date as timestamp
	Ext.each(options.create, function(item) {
		item.data.datetime = item.data.datetime.format('U');
	});
});



/**************
* remote Store
***************/
app.stores.events = new Ext.data.Store({
	model: 'app.models.Event',
	clearOnPageLoad: false,
	autoLoad: false,
	pageSize: app.CONF.store_page_size,
	proxy: {
		timeout: 2000,
	    type: 'ajax',
	    url : 'http://www.postgarage.at/api/events.php?what=FORTH',
	    reader: {
	        type: 'json',
	        root: 'events',
	    },
		listeners: {
			exception:function () {
		        console.log("I think we are offline");
		        var store = app.stores.localEvents;
		        var dv = app.views.eventsList.getComponent('eventsListDataView');
		        dv.bindStore(store);		        
    			var listener = function() {
    				dv.fireEvent('itemtap', dv, 0);
    				store.removeListener('load', listener)
    			}
    			store.addListener('load', listener);
		        store.load();
		        
		        var dlg = new Ext.Panel({
				    floating: true,
		            modal: true,
		            centered: true,
		            styleHtmlContent: true,
 		            html: '<h1>Offline Mode</h1><p>You are seeing a cached copy of our events. This usually means that yout internet connection is not working.</p><p>You can not dowload more events or load the event images while offline.</p>',
				});
				dlg.show();
		    },
		},
	}
});

app.stores.events.on('load', function (store) {
    store.snapshot = store.data;
});



/*****************
* Offline caching
*****************/
app.stores.events.addListener('load', function(){
	console.log("I think we are online");
    app.stores.localEvents.proxy.clear();
    this.each(function (record) {
        app.stores.localEvents.add(record.data);
    });
    app.stores.localEvents.sync();
});