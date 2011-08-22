
	
	app.views.Viewport = Ext.extend(Ext.Panel, {
	    fullscreen: true,
		cls: 'viewport',
	    initComponent: function() {
	    	console.log('viewport initComponent '+window['app'].views.eventsList);
	    	//this.removeAll();
	        
	        
		    this.setupLayout();
		    
	        console.log('viewport initComponent 4');
        	app.views.Viewport.superclass.initComponent.apply(this, arguments);
	        console.log('viewport initComponent 5');
	        
	        
	        //this.doComponentLayout();
	    },
	    
	    setupLayout: function() {
	    	//console.log('items: '+var_dump(this.items));
	       	
	       	if (this.items) {
	       		this.removeAll(true);
	       	}
	       	
	       	//put instances of cards into app.views namespace
	        Ext.apply(app.views, {
	            eventsList: new app.views.EventsList(),
	            eventDetail: new app.views.EventDetail(),
	            image: new app.views.Image(),
	        });
	       	
	       	
	       		    
	    	//Big screen layout
	        if (app.isBigScreen()) {
	        	console.log('viewport setupLayout 1');
	        	this.layout = 'hbox';
	        	
	        	Ext.apply(this, { items: [
			    	{
			    		flex: 1,
			    		xtype: 'panel',
			    		id: 'leftContainer',
			    		html: 'left',
			    		layout: 'fit',
			    		height: '100%',
			    	},
			    	{
			    		flex: 2,
			    		xtype: 'panel',
			    		id: 'centerContainer',
			    		html: 'center',
			    		layout: 'card',
			    		height: '100%',
			    	},
			    
			    ]});
	        
		        //put instances in center column
		        Ext.apply(this.items[1], {
		            items: [
		                app.views.eventDetail,
		                app.views.image,
		            ]
		        });
		        
		        
		        console.log('viewport initComponent 3');
		        //put instances in left column
		        Ext.apply(this.items[0],
		        	{
		        		items: [app.views.eventsList,],
		        	}
		        );
		        
		    //small screen layout
		    } else {
		    	console.log('viewport setupLayout 2');
		    	this.layout = 'card';
		    	this.cardSwitchAnimation = 'slide';
		    	
		    	//put instances of cards into viewport
		        Ext.apply(this, {
		            items: [
		                app.views.eventsList,
		                app.views.eventDetail,
		                app.views.image,
		                //app.views.contactForm,
		            ]
		        });
		    }
		    
		    this.doComponentLayout();
		    this.doLayout();
	    },
	});