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

    styleHtmlContent:true,
    scroll: 'vertical',
    items: [
    	{tpl:[
    		'<h3>{datetime:date("l, d.m.Y G:i")}</h3>',
    	    '<h1>{title}</h1>',
    	    '<h2>{short}</h2>',
    	    '<p>{admission}</p>',
    	    '<p>{bodytext}</p>',
    	    //'<p>{images}</p>',
    	    //'<p>{categories}</p>',
    	    '<p>{additional_info}</p>',
    	    //'<p>{files}</p>',
    	    //'<p>{link}</p>',
	    ]},
    ],
    
    listeners: {
    	show: function() {
    		app.views.eventDetail.setSize(window.innerWidth, window.innerHeight);
    	},
    },
    
    initComponent: function () {
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
							//app.showActionsheet(app.views.eventDetail.actionSheet);
							app.views.eventDetail.share();
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
	},
	
	
	
	/**********************************
	* custom properties
	**********************************/
	actionSheet: new Ext.ActionSheet({
	    items: [
	        {
	            text: 'Share',
	            listeners: {
                    'tap': function(){
                    	app.views.eventDetail.share();
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
    	
    	if (this.getComponent('flyerBtnContainer')) {
    		this.remove('flyerBtnContainer');
    	}
    	Ext.each(this.items.items, function(item) {
        	item.update(record.data);
    	});
    	
		
		if (record.data.files.length > 0) {
			//...create a new one ...
			var flyerBtnContainer = new Ext.Panel({
				id: 'flyerBtnContainer',
				layout: {type: 'hbox', align: 'left'},
			});
			
			//... and add the flyer buttons
			Ext.each(record.data.files, function(file, idx){
				var file = file.file;
				flyerBtnContainer.add({
					xtype: 'button', 
					text: 'Flyer',
					cls: 'flyer_btn',
					listeners: {'tap': function(){
								            app.viewstack.push('showImage', {'image': 'http://www.postgarage.at/uploads/media/'+file});
					    				},
					}
				});
					
			});
			
			this.add(flyerBtnContainer);
				    	
			this.doComponentLayout();
			//sencha bug? according to the docs, doComponentLayout should call doLayout()
			//but without this explicit call, the flyer buttons were not visible, after returning from the image view
			this.doLayout();

		}
    	
	    var toolbar = this.getDockedItems()[0];
	    toolbar.setTitle(Ext.util.Format.ellipsis(record.get('title'), 20));
	    
	    this.scroller.scrollTo({'x': 0, 'y': 0}, true);
	},
	
	share: function() {
		var currData = app.views.eventDetail.currentRecord.data;
    	window.plugins.share.show(
    		{subject: currData.title, text: encodeURI(currData.link)}, 
    		function(args){}, 
    		function(args){}
    	);
	},
});