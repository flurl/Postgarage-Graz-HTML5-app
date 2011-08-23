app.views.EventsList = Ext.extend(Ext.Panel, {
	/*flex: 1,
    frame:true,
    autoHeight: true,
    collapsible: true,
    width: '100%',*/
    cls: 'eventsList',
    layout: 'fit',
    /*dockedItems: [{
        xtype: 'toolbar',
        title: 'Events',
        items: [
        	{xtype : 'container', html : '<img src="'+app.CONF['icon_small']+'">' },
        	{xtype:'spacer'},
            {
            	id: 'settingsButton',
                text: 'Settings',
                ui: 'action',
                listeners: {
                    'tap': function () {
						app.showActionsheet(app.actionSheets.settings);
                    }
                }
            }
        ],
    }],*/
    items: [{
    	id: 'eventsListDataView',
        xtype: 'dataview',
        store: app.stores.events,
        fullscreen: true,
        //itemTpl: '{title} {datetime}',
        //plugins: [{ptype: 'pullrefresh'}],
        allowDeselect: false,
        singleSelect: true,
        tpl: new Ext.XTemplate(
	        '<tpl for=".">',
	            '<div class="x-list-item">',
	                '<div class="event-datetime">{datetime:date("d.m.Y G:i")}</div>',
	                '<div class="event-title">{title}</div>',
	                '<div class="event-short">{short:ellipsis(100)}</div>',
	                //'<div class="event-bodytext">{[this.stripTags(values.bodytext, 100)]}</div>', 
	            '</div>',
	        '</tpl>',
	        '<div class="x-list-item load-more">Load '+app.CONF.store_page_size+' more...</div>',
	        {
	        	stripTags: function(str, ellipsis){
	        		var tmp = document.createElement('DIV');
					tmp.innerHTML = str;
					return Ext.util.Format.ellipsis((tmp.textContent || tmp.innerText), ellipsis);
	        	}
	        }
	    ),
	    itemSelector: 'div.x-list-item',
	    componentCls: 'x-list events-list',
        /*onItemDisclosure: function (record) {
            app.viewstack.push('show', {id: record.getId()});
        },*/
      	listeners:{
      		itemtap: function(view, index, item, e){
      			console.log('dv itemtap');
      			var store = view.getStore();
      			//last item tapped => load more events
      			if (store.getCount() == index) {
      				console.log('dv itemtap 2');
      				store.nextPage();
      			} else {
      				console.log('dv itemtap 3');
	           		console.log('tap'+store.getAt(index).data.id)
		            app.viewstack.push('show', {id: view.getStore().getAt(index).data.id});
		        }
        	},
   		}

        
    },
    ],
    
    listeners: {
    	'activate': function() {
    		console.log('EventList activate event');
    	},
    	afterrender: function() {
    		console.log('afterrender');
    		if (app.isBigScreen()) {
    			console.log('afterrender2');
    			var dv = this.getComponent('eventsListDataView');
    			var store = dv.getStore();
    			var listener = function() {
    				dv.fireEvent('itemtap', dv, 0);
    				store.removeListener('load', listener)
    			}
    			store.addListener('load', listener);
    			
    			
    			
    		}
    	},
    },
    
    
    initComponent: function() {
    	console.log('EventsList.initComponent');
        app.stores.events.load();
        //console.log(var_dump(this));
        app.views.EventsList.superclass.initComponent.apply(this, arguments);
        
        //add the docked items here and not as config option
    	//due to a sencha bug. see  http://www.sencha.com/forum/showthread.php?114218-OPEN-488-DockLayout-attempts-to-manipulate-DOM-element-after-it-s-been-destroyed
        this.addDocked( [{
	        xtype: 'toolbar',
	        title: 'Events',
	        items: [
	        	{xtype : 'container', html : '<img src="'+app.CONF['icon_small']+'">' },
	        	{xtype:'spacer'},
	            {
	            	id: 'settingsButton',
	                text: 'Settings',
	                ui: 'action',
	                listeners: {
	                    'tap': function () {
							app.showActionsheet(app.actionSheets.settings);
	                    }
	                }
	            }
	        ],
	    }]);
        
        console.log('EventsList.initComponent end');
        //document.removeEventListener('backbutton')
        //document.addEventListener('backbutton', null, true);
    },
    
});