app.views.EventsList = Ext.extend(Ext.Panel, {
    cls: 'eventsList',
    layout: 'fit',
    items: [{
    	id: 'eventsListDataView',
        xtype: 'dataview',
        store: app.stores.events,
        fullscreen: true,
        allowDeselect: false,
        singleSelect: true,
        tpl: new Ext.XTemplate(
	        '<tpl for=".">',
	            '<div class="x-list-item">',
	                '<div class="event-datetime">{datetime:date("D, d.m.Y G:i")}</div>',
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
      	listeners:{
      		itemtap: function(view, index, item, e){
      			var store = view.getStore();
      			//last item tapped => load more events
      			if (store.getCount() == index) {
      				store.nextPage();
      			} else {
		            app.viewstack.push('show', {id: view.getStore().getAt(index).data.id});
		        }
        	},
   		}

        
    },
    ],
    
    listeners: {
    	afterrender: function() {
    		//in bigscreen layout select the first entry to populate detail view
    		if (app.isBigScreen()) {
    			var dv = this.getComponent('eventsListDataView');
    			var store = dv.getStore();
    			var listener = function() {
    				app.views.eventsList.selectItem(0);
    				store.removeListener('load', listener)
    			}
    			store.addListener('load', listener);
    			
    			
    			
    		}
    	},
    },
    
    
    initComponent: function() {
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
							//the settings panel is instantiated here to save resources if not needed
							if (!app.views.settings) {
								app.views.settings = new app.views.Settings();
							}
							app.showFloatingPanel(app.views.settings);
	                    }
	                }
	            }
	        ],
	    }]);
    },
    
    
    selectItem: function(index) {
    	var dv = this.getComponent('eventsListDataView');
    	dv.fireEvent('itemtap', dv, 0);
		
		//if the app started in offline mode, this call fails for god knows what reason
		//when switching to online. Hence the try
		try {
			dv.getSelectionModel().select(0, true)
		} catch(e) {}
    },
    
});