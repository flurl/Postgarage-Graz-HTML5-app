app.models.Config = Ext.regModel('app.models.Config', {
	fields: [
		{
			name: 'id',
			type: 'int',
		},
		{
			name: 'layout',
			type: 'string',
			defaultValue: 'auto',
		},
		{
			name: 'theme',
			type: 'string',
			defaultValue: 'sencha',
		},
	],
	proxy: {
	    type: 'localstorage',
		id  : 'postgarageevents-config',
		idProperty: 'id',
	}
	
});

app.stores.config = new Ext.data.Store({
	model: 'app.models.Config',
});



//BUG WORKAROUND
//see http://www.sencha.com/forum/showthread.php?120884-OPEN-719-(1.0.1a)-Store.snapshot-contains-corrupt-data.
app.stores.config.on('load', function (store) {
    store.snapshot = store.data;
});