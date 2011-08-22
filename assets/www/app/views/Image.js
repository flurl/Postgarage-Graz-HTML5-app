app.views.Image = Ext.extend(Ext.Panel, {
	/**********************************
	* Ext properties
	**********************************/
    styleHtmlContent:true,
    scroll: 'both',
    fullscreen: true,
    padding: 0,
    bodyPadding: 0,
    cls: 'image',
    /*dockedItems: [{
        xtype: 'toolbar',
        title: 'Image',
        items: [
            {
                text: 'Back',
                ui: 'back',
                listeners: {
                    'tap': function(){
                    	app.viewstack.pop();
                    },
                },
            },
    	]
    }],*/
    html: '<div id="image_container"></div>',
   /* items: [
	    {tpl:[
	        '<div id="image_container"><img src="{image}"></div>',
    	]},
    ],*/
    
    listeners: {
    	'deactivate': function() {
    		console.log('Image deactivate event');
    		this.hideLoadingMask();
    	}
    },
    
    initComponent: function () {
    	console.log('Image.initComponent');
    	app.views.Image.superclass.initComponent.apply(this, arguments);
    	
    	//add the docked items here and not as config option
    	//due to a sencha bug. see  http://www.sencha.com/forum/showthread.php?114218-OPEN-488-DockLayout-attempts-to-manipulate-DOM-element-after-it-s-been-destroyed
    	this.addDocked([{
	        xtype: 'toolbar',
	        title: 'Image',
	        items: [
	            {
	                text: 'Back',
	                ui: 'back',
	                listeners: {
	                    'tap': function(){
	                    	app.viewstack.pop();
	                    },
	                },
	            },
	    	]
	    }]);
    	
    	console.log('Image.initComponent end');
	},
	
	
	/**********************************
	* custom properties
	**********************************/
	loadedImages: {},
	
    updateImage: function(image) {
    	console.log('updateImage');
    	//when the image was loaded previously, we asume 
    	//it's already in the cache and the loading mask isn't needed
    	if (!app.views.image.loadedImages[image]) {this.showLoadingMask();}
    	    
    	//remove former image
		var container = Ext.get('image_container');
		while(container.first()) {
			console.log('removing child');
		    container.first().remove();
		}		
    	var img = new Image();
    	img.onload = function(e) {
    		var container = Ext.get('image_container');
			
    		container.appendChild(this);
    		console.log('onload src: '+this.src);
    		app.views.image.loadedImages[this.src] = [this.width, this.height];
    		 		
    		container.first().on('tap', app.views.image.scaleImage);
    		
    		app.views.image.scaleImage();
    		
    		app.views.image.hideLoadingMask();
    	}
    	
    	img.onerror = function(e) {
    		app.views.image.loadedImages[this.src] = false;
    		Ext.Msg.alert('Oops', 'An error occurred while loading the Image. Sorry!', Ext.emptyFn);
    	}
    	
    	img.src = image;
    	
    	this.scroller.scrollTo({x:0,y:0}, false);
    	
    	/*Ext.each(this.items.items, function(item) {
        	item.update({'image': image});
    	});*/
	},
	
	loadingMask: null,
	
	showLoadingMask: function() {
		if (!this.loadingMask) {
			this.loadingMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
		}
		this.loadingMask.show();
	},
	
	hideLoadingMask: function() {
    	if (this.loadingMask) {
    		this.loadingMask.hide();
    	}
	},
	
	scaleImage: function() {
		var img = Ext.get('image_container').first();
		var imgW = img.getWidth();
		var panelW = app.views.image.getWidth();
		console.log('imgW: '+imgW+' panelW: '+panelW+' scaleImage src: '+img.getAttribute('src'));
		if (imgW > panelW-40) {
			img.setWidth(panelW-40, true);
		} else {
			img.setWidth(app.views.image.loadedImages[img.getAttribute('src')][0], true);
		}
	}
	
});