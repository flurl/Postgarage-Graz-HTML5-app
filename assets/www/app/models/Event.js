app.models.Event = Ext.regModel('app.models.Event', {
    fields: [
        {name: 'id', type: 'int'},
        {name: 'title', type: 'string'},
        {name: 'datetime', type: 'date', dateFormat: 'timestamp'},
        {name: 'short', type: 'string'},
        {name: 'bodytext', type: 'string'},
        {name: 'additional_info', type: 'string'},
        {name: 'admission', type: 'string'},
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
		try {
			item.data.datetime = item.data.datetime.format('U');
		} catch(e) {
      		//there's no method 'format'? probably datetime is already a timestamp
		}
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
	listeners: {
		//add the expected parameter for tt_news to the request
		beforeload: function(store, operation) {
			operation.params = operation.params || {};
			//the store counts from 1, tt_news counts from 0
	        operation.params[app.CONF.store_page_param] = store.currentPage - 1;
	    },
	},
	proxy: {
		timeout: app.CONF.network_timeout,
	    type: 'ajax',
	    url : app.CONF.news_sources[0].url,
	    reader: {
	        type: 'json',
	        root: 'events',
	    },
		listeners: {
			exception:function (proxy, response, operation) {
				//when a timeout occurs the exception is triggered twice 
				//this doesn't happen e.g. in airplane mode, since then only one exception occurs
				//the first time request.timedout = true and request.aborted = undefined
				//the second time both properties are true
				//we handle just the first exception
				if (response.aborted != true) {
			        console.log("I think we are offline");
			        var store = app.stores.localEvents;
			        var dv = app.views.eventsList.getComponent('eventsListDataView');
			        dv.bindStore(store);
			        if (app.isBigScreen()) {		        
		    			var listener = function() {
		    				app.views.eventsList.selectItem(0);
		    				store.removeListener('load', listener)
		    			}
		    			store.addListener('load', listener);
		    		}
			        store.load();
			        
			        //offline indicator
				    var btn = new Ext.Panel({
			            x: 100,
			            y: 100,
			            floating: true,
			            hideOnMaskTap: false,
			            html: '<h1>Offline Mode</h1><p>Tap here to try going online</p>',
			            baseCls: 'offline_indicator',
			            listeners: {
			            	//directly binding a click listener didn't work, so we do it here
			            	afterrender: function(cmp){
								cmp.el.on('click', function(){
									cmp.destroy();
									app.mainLaunch();
								});
							},
			            }
			        });
			        btn.show();
			       
			        //position it to the lower right corner
			        var box = Ext.getBody().getBox(),
			            size = btn.getSize();
			        btn.setPosition(box.right - size.width, box.bottom - size.height);
	
					//offline message
			        var dlg = new Ext.Panel({
					    floating: true,
			            modal: true,
			            centered: true,
			            styleHtmlContent: true,
	 		            html: '<h1>Offline Mode</h1><p>You are seeing a cached copy of our events. This usually means that yout internet connection is not working.</p><p>You can not dowload more events or load the event images while offline.</p>',
					});
					dlg.show();
			    }
			},
		},
	}
});

app.stores.events.on('load', function (store) {
    store.snapshot = store.data;
});

//make the timeout field of the store a property so that the config value is always used 
var proxy = app.stores.events.getProxy();
Object.defineProperty(proxy, 'timeout', { get : function(){ return app.CONF.network_timeout; },  
			                               set : function(newValue){},  
			                               enumerable : true,  
			                               configurable : true});



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