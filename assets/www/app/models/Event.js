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


//TODO: implement local caching and syncing of the events
/*app.stores.events = new Ext.data.Store({
	model: 'app.models.Event',
	clearOnPageLoad: false,
	pageSize: app.CONF.store_page_size,
	autoLoad: true,
	autoSave: true,
	proxy: new Ext.data.LocalStorageProxy({
		id: 'events',
		//very important for the row update - basicaly, the row number is taken from the id field in the userSettings structure
		proxy: {
		   idProperty: 'id'
		}
	}) ,
	
});
//BUG WORKAROUND
//see http://www.sencha.com/forum/showthread.php?120884-OPEN-719-(1.0.1a)-Store.snapshot-contains-corrupt-data.
app.stores.events.on('load', function (store) {
    store.snapshot = store.data;
});*/

app.stores.events = new Ext.data.Store({
	model: 'app.models.Event',
	clearOnPageLoad: false,
	pageSize: app.CONF.store_page_size,
	proxy: {
	    type: 'ajax',
	    url : 'http://www.postgarage.at/api/events.php?what=FORTH',
	    reader: {
	        type: 'json',
	        root: 'events',
	    },
	}
});

app.stores.events.on('load', function (store) {
    store.snapshot = store.data;
});