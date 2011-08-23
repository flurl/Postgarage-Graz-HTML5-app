app.views.EventDetail = Ext.extend(Ext.Panel, {
    /**********************************
	* Ext properties
	**********************************/
	styleHtmlContent:true,
    scroll: 'vertical',
    fullscreen: true,
    padding: 0,
    bodyPadding: 0,
	cls: 'eventDetail',
	/*dockedItems: [{
        xtype: 'toolbar',
        title: 'Event Detail',
        items: [
            {
            	id: 'backButton',
                text: 'Back',
                ui: 'back',
                listeners: {
                    'tap': function(){app.viewstack.pop();}
                },
            },
            {xtype:'spacer'},
            {
            	id: 'shareButton',
                text: 'Share',
                ui: 'action',
                listeners: {
                    'tap': function () {
						app.showActionsheet(app.views.eventDetail.actionSheet);
                    }
                }
            }
        ]
    }],*/
    /*listeners: {
    	afterrender: {
            fn: function () {
                this.addDocked([{
                    xtype: 'toolbar',
                    title: 'Hello World'
                }]);
            }
        }
    },*/
    styleHtmlContent:true,
    scroll: 'vertical',
    items: [
    	{tpl:[
    	    '<h1>{title}</h1>',
    	    '<h2>{short}</h2>',
    	    '<p>{bodytext}</p>',
    	    '<p>{images}</p>',
    	    '<p>{categories}</p>',
    	    '<p>{files}</p>',
    	    '<p>{link}</p>',
	    ]},
	    /*{tpl:[
	        '<tpl for="files">',
	        	'<tpl if="file != &quot;&quot;">',
		        '<div><button>Flyer</button><img src="http://postgarage.at/uploads/media/{file}"></div>',
		        '</tpl>',
		  	'</tpl>',
    	]},*/
    ],
    
    initComponent: function () {
    	console.log('EventDetail.initComponent');
    	app.views.EventDetail.superclass.initComponent.apply(this, arguments);
    	
    	//add the docked items here and not as config option
    	//due to a sencha bug. see  http://www.sencha.com/forum/showthread.php?114218-OPEN-488-DockLayout-attempts-to-manipulate-DOM-element-after-it-s-been-destroyed
    	this.addDocked([{
	        xtype: 'toolbar',
	        title: 'Event Detail',
	        items: [
	            {
	            	id: 'backButton',
	                text: 'Back',
	                ui: 'back',
	                listeners: {
	                    'tap': function(){app.viewstack.pop();}
	                },
	            },
	            {xtype:'spacer'},
	            {
	            	id: 'shareButton',
	                text: 'Share',
	                ui: 'action',
	                listeners: {
	                    'tap': function () {
							app.showActionsheet(app.views.eventDetail.actionSheet);
	                    }
	                }
	            }
	        ]
	    }]);
    	
    	//hide backbutton in two column layout 
    	if (app.isBigScreen()) {
    		this.getDockedItems()[0].getComponent('backButton').hide();
    	} else {
    		//this.getDockedItems()[0].getComponent('backButton').show();
    	}
    	console.log('EventDetail.initComponent end');
	},
	
	
	
	/**********************************
	* custom properties
	**********************************/
	actionSheet: new Ext.ActionSheet({
	    items: [
	        {
	            text: 'Share',
	            //ui  : 'decline',
	            listeners: {
                    'tap': function(){
                    	//console.log('share: '+var_dump(window.plugins.share.show));
                    	var currData = app.views.eventDetail.currentRecord.data;
                    	console.log('share: '+var_dump(currData, 2));
                    	window.plugins.share.show(
                    		{subject: currData.title, text: encodeURI(currData.link)}, 
                    		function(args){}, 
                    		function(args){}
                    	);
                    	app.hideActionsheet();
                    }
                },
	        },
	        {
	            text: 'Cancel',
	            ui  : 'decline',
	            listeners: {
                    'tap': function(){app.hideActionsheet();}
                },
	        },
	    ]
	}),
    
    currentRecord: undefined,
    
    updateWithRecord: function(record) {
    	console.log('len:'+record.data.files.length+'files:'+record.data.files);
    	
    	app.views.eventDetail.currentRecord = record;
    	
    	//create array from images string
    	if (!(record.data.files instanceof Array)) {
	    	var files = [];
	    	Ext.each(record.data.files.split(','), function(file, idx) {
	    		if (file != '') {
		    		files.push({'file': file});
		    	}
	    	}, this);	
	    	record.data.files = files;
    	}
    	
    	console.log('BP1');
    	
    	if (this.getComponent('flyerBtnContainer')) {
    		console.log('removing flyerBtnContainer');
    		this.remove('flyerBtnContainer');
    	}
    	
    	Ext.each(this.items.items, function(item) {
    		console.log('BP1.5'+item);
        	item.update(record.data);
    	});
    	
		
		if (record.data.files.length > 0) {
			//...create a new one ...
			var flyerBtnContainer = new Ext.Panel({
				id: 'flyerBtnContainer',
				layout: {type: 'hbox', align: 'left'},
			});
			//this.add(flyerBtnContainer);
			
			//... and add the flyer buttons
			Ext.each(record.data.files, function(file, idx){
				var file = file.file;
				console.log('file: '+file+'***'+file.file);
				flyerBtnContainer.add({
					xtype: 'button', 
					text: 'Flyer',
					listeners: {'tap': function(){
								            app.viewstack.push('showImage', {'image': 'http://www.postgarage.at/uploads/media/'+file});
					    				},
					}
				});
					
			});
			
			
			//flyerBtnContainer.rendered = false;
			this.add(flyerBtnContainer);
			
			
			if (this.getComponent('flyerBtnContainer')) {
	    		console.log('flyerBtnContainer available');
	    		if (this.getComponent('flyerBtnContainer').isVisible()) console.log('and it is visible');
 	    	} else console.log('flyerBtnContainer not available');
	    	console.log('record title: '+record.data.title);
	    	
			this.doComponentLayout();
			//sencha bug? according to the docs, doComponentLayout should call doLayout()
			//but without this explicit call, the flyer buttons were not visible, after returning from the image view
			this.doLayout();

		}
    	
    	console.log('BP2');
	    var toolbar = this.getDockedItems()[0];
	    toolbar.setTitle(Ext.util.Format.ellipsis(record.get('title'), 20));
	    //toolbar.getComponent('shareButton').record = record;
	    console.log('BP3');
	},
});