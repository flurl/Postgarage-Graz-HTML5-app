Ext.regApplication('app', {
    name: 'app',
    launch: function() {
        this.launched = true;
        /*if (window['app'] != undefined) console.log('launch: '+this.views+'***'+window['app'].views);
		else console.log('launch: app not defined');*/
        this.mainLaunch();
    },
    mainLaunch: function() {
    	console.log('mainLaunch 1'+this.views+'***'+window['app'].views);
        if (!device || !this.launched) {return;}
        console.log('mainLaunch 2'+this.views+'***'+window['app'].views);
        window['app'] = this; //phonegap bug???
       /* Ext.iterate(this.views, function(view) {
        	console.log('destroying view');
        	if (this.views[view].destroy) this.views[view].destroy();
        	else console.log('view '+this.views[view]+' could not be destroyed');
        }, this);*/
        /*if (this.views.viewport) {
	        console.log('destroying');
	        app.views.viewport.removeAll();
	        this.views.eventsList.removeAll();
	        this.views.eventDetail.removeAll();
	        this.views.image.removeAll();
	        this.views.viewport.removeAll();
	        delete this.views.eventsList.dockedItems;
	        delete this.views.eventDetail.dockedItems;
	        delete this.views.image.dockedItems;
	        delete this.views.viewport.dockedItems;
	        this.views.eventsList.destroy();
	        this.views.eventDetail.destroy();
	        this.views.image.destroy();
	        this.views.viewport.destroy();
	        delete this.views.eventsList;
	        delete this.views.eventDetail;
	        delete this.views.image;
	        delete this.views.viewport;
		}*/	
		
		app.loadConfig();
		app.appendStyleSheet("lib/resources/css/" + app.themesData[app.CONF.theme].file, function(sheet) {
	                            app.setActiveSheet(sheet);
	                        });
			
		if (!this.views.viewport) {
			console.log('instantiating viewport');
	        this.views.viewport = new this.views.Viewport();
	        console.log('instantiated viewport');
	    } else {
	    	this.views.viewport.destroy();
	    	delete this.views.viewport;
	    	this.views.viewport = new this.views.Viewport();
	    }        
	    
	    //init viewstack
	    this.viewstack.views.length = 0;
	    this.viewstack.views.push({
		            controller: app.controllers.events,
		            action: 'index',
		            animation: {type:'slide', direction:'right'}
		        });
        document.addEventListener('backbutton', app.handleBackButton, true);
    },
    
    handleBackButton: function() {
    	console.log('Backbutton');
    	if (app.activeActionSheets.length == 0) {
    		app.viewstack.pop();
    	} else {
    		app.hideActionsheet();
    	}
    	
    },
    
    //to have a viewstack is nice for back navigation
    viewstack: {
		views: [],
		//views: ['index'],
		
		pop: function(options) {
			console.log('pop view');
			app.viewstack.views.pop();
			if (app.viewstack.views.length > 0) {
				var request = app.viewstack.views[app.viewstack.views.length-1];
				//request.controller = app.controllers.events;
				request.animation = {type:'slide', direction:'right'};
				//request.animation = {type:'slide', direction:'left'};
				//console.log('pop view - action: '+action);
				/*var request = {
		            controller: app.controllers.events,
		            'action': action,
		            animation: {type:'slide', direction:'right'}
		        };*/
		        if (options != undefined) {
		        	//for (attrname in options) { request[attrname] = options[attrname]; }
		        	Ext.apply(request, options);
		        }
				Ext.dispatch(request);
			} else {
				navigator.app.exitApp();
			}
		},
		
		
		push: function(action, options) {
			console.log('push view - action: '+action);
			var request = {
	            controller: app.controllers.events,
	            'action': action,
	            animation: {type:'slide', direction:'left'}
	        };
	        if (options != undefined) {
	        	//for (attrname in options) { request[attrname] = options[attrname]; }
	        	Ext.apply(request, options);
	        }
	        app.viewstack.views.push(request);
			Ext.dispatch(request);
		}	
	},
	
	
	//keep track of used actionsheets for handling them in the backbutton handler
	activeActionSheets: [],
	showActionsheet: function(as) {
		app.activeActionSheets.push(as);
		as.show();	
	},
	
	hideActionsheet: function() {
		var as = app.activeActionSheets.pop();
		if (as) {as.hide();}
	},
	
	

	//returns true, if running probably on a tablet device
	isBigScreen: function() {
		//return false;
		console.log('window height: '+window.innerHeight+'window width: '+window.innerWidth+'screen height: '+screen.height+'screen width: '+screen.width);
		if (app.CONF.layout == 'auto') {        
			if (screen.width > 600) {
				return true;
			} else {
				return false;
			}
		} else if (app.CONF.layout == 'big') {
			return true;
		} else {
			return false;
		}
	},
	
	
	/****************************
	* Theme switching
	*****************************/
	appendStyleSheet: function(url, callback) {
        

        Ext.Ajax.request({
            url: url,
            success: function(response) {
            	console.log('success callback');
            	var head = document.head || document.getElementsByTagName('head')[0],
	            	firstLink = document.getElementsByTagName('link')[0],
	            	style = document.createElement('style');
	
	        	style.type = 'text/css';
            	console.log('success callback2');
                style.textContent = response.responseText;
                if (firstLink) {
                    head.insertBefore(style, firstLink);
                } else {
                    head.appendChild(style);
                }
				console.log('success callback3');
                callback(style.sheet);
            }
        });
    },
    
    setActiveSheet: function(sheet) {
    	console.log('setting active sheet');
    	
    	var i, ln, regex, j, subLn, origsheet, activeSheet,
    		themeSheets = {},
        	styleSheets = Array.prototype.slice.call(document.styleSheets);

	    Ext.iterate(app.themesData, function(id, theme) {
	        //theme = app.themesData[i];
	
	        regex = new RegExp(Ext.util.Format.escapeRegex(theme.file) + '$');
			console.log('theme'+theme.id);
	        for (j = 0,subLn = styleSheets.length; j < subLn; j++) {
	            origsheet = styleSheets[j];
				console.log('href'+origsheet.href);
	            if (origsheet.href && origsheet.href.search(regex) !== -1) {
	            	console.log('found');
	                themeSheets[theme.id] = origsheet;
	                app.activeSheet = origsheet;
	                break;
	            }
	        }
	    });
        app.activeSheet.disabled = true;
        app.activeSheet = sheet;
        app.activeSheet.disabled = false;
    },
    

    activeSheet: {disabled: false},
    themesData: {
            'sencha': {id: 'default', name: 'Sencha', file: 'sencha-touch.css'},
            'apple': {id: 'apple', name: 'Cupertino', file: 'apple.css'},
            'android': {id: 'android', name: 'Mountain View', file: 'android.css'},
            'blackberry': {id: 'blackberry', name: 'Toronto', file: 'bb6.css'}
     },


	/*********************
	* Global action sheets
	**********************/
	actionSheets: {
		'settings': new Ext.ActionSheet({
		    items: [
		        {
		            text: 'Clear Config',
		            //ui  : 'decline',
		            listeners: {
	                    'tap': function(){
	                    	app.clearConfig();	                    	
	                    }
	                },
		        },
		        {
		            text: 'Auto Layout',
		            //ui  : 'decline',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({layout: 'auto'})
	                    	app.mainLaunch();	                    	
	                    }
	                },
		        },
		        {
		            text: 'Tablet Layout',
		            //ui  : 'decline',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({layout: 'big'});
	                    	app.mainLaunch();                    	
	                    }
	                },
		        },
		        {
		            text: 'Phone Layout',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({layout: 'small'});
	                    	app.mainLaunch();
	                    	                	
	                    }
	                },
		        },
		        {
		            text: 'Cupertino Theme',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({theme: 'apple'});
	                    	app.appendStyleSheet("lib/resources/css/" + app.themesData['apple'].file, function(sheet) {
	                            app.setActiveSheet(sheet);
	                        });
	                    }
	                },
		        },
		        {
		            text: 'Mountain View Theme',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({theme: 'android'});
	                    	app.appendStyleSheet("lib/resources/css/" + app.themesData['android'].file, function(sheet) {
	                            app.setActiveSheet(sheet);
	                        });
	                    }
	                },
		        },
		        {
		            text: 'Toronto Theme',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({theme: 'blackberry'});
	                    	app.appendStyleSheet("lib/resources/css/" + app.themesData['blackberry'].file, function(sheet) {
	                            app.setActiveSheet(sheet);
	                        });
	                    }
	                },
		        },
		        {
		            text: 'Sencha Theme',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({theme: 'sencha'});
	                    	app.appendStyleSheet("lib/resources/css/" + app.themesData['sencha'].file, function(sheet) {
	                            app.setActiveSheet(sheet);
	                        });
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
	},
	
	
	/******************
	* App Configuration
	*******************/ 
	CONF: {
		'icon_small': 'images/logo.png',
		'store_page_size': 5, //page size used in event store
	},
	
	loadConfig: function() {
		console.log('loadConfig');
		var s = app.stores.config;
		s.load();
		if (s.getCount() != 1) {
			app.initConfig();
		}
		console.log(var_dump(s.first().data));
		Ext.apply(app.CONF, s.first().data);
	},
	
	initConfig: function () {
		console.log('initConfig');
		app.clearConfig();
    	var s = app.stores.config;
    	s.load();
    	s.add({id: 1, layout: 'auto', theme: 'sencha', });
    	s.sync();
	},
	
	updateConfig: function(values) {
		console.log('updateConfig');
		var s = app.stores.config;
		s.load();
		var conf = s.first();
		conf.set(values);
		conf.save();
		s.sync();
		app.loadConfig();
	},
	
	clearConfig: function() {
		console.log('clearConfig');
		var s = app.stores.config;
    	s.load();
    	s.each(function(record){
    		s.remove(record);
    	});
    	s.sync();
	},
	
	
	/*********************
	* Debuging
	**********************/
	varDump: function(arr,level) {
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += app.varDump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else { //Stings/Chars/Numbers etc.
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		}
		return dumped_text;
	},
});