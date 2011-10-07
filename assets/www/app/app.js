Ext.regApplication('app', {
    name: 'app',
    launch: function() {
        this.launched = true;
        this.mainLaunch();
    },
    mainLaunch: function() {
    	console.log('mainLaunch 1'+this.views+'***'+window['app'].views);
        if (!device || !this.launched) {return;}
        console.log('mainLaunch 2'+this.views+'***'+window['app'].views);
        window['app'] = this; //phonegap bug???
		
		app.loadConfig();
		app.appendStyleSheet("lib/resources/css/" + app.themesData[app.CONF.theme].file, function(sheet) {
	                            app.setActiveSheet(sheet);
	                        });
	                        
		Ext.Anim.override({
			disableAnimations:!app.CONF.animations
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
		            animation: {type:app.CONF.page_transition, direction:'right'}
		        });
		        
		app.stores.events.load();
		
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
		pop: function(options) {
			console.log('pop view');
			app.viewstack.views.pop();
			if (app.viewstack.views.length > 0) {
				var request = app.viewstack.views[app.viewstack.views.length-1];
				request.animation = {type:app.CONF.page_transition, direction:'right'};
		        if (options != undefined) {
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
	            animation: {type:app.CONF.page_transition, direction:'left'}
	        };
	        if (options != undefined) {
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
		if (as) {
			//Workaround: when disableAnimations is set to true, the actionsheet doesn't
			//hide correctly. So we set it allways to true
			Ext.Anim.override({ disableAnimations:false });
	        as.hide();
	        //reset to config setting
	        Ext.Anim.override({	disableAnimations:!Ext.Anim.disableAnimations });
		}
	},
	
	

	//returns true, if running probably on a tablet device
	isBigScreen: function() {
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
            	var head = document.head || document.getElementsByTagName('head')[0],
	            	firstLink = document.getElementsByTagName('link')[0],
	            	style = document.createElement('style');
	
	        	style.type = 'text/css';
                style.textContent = response.responseText;
                if (firstLink) {
                    head.insertBefore(style, firstLink);
                } else {
                    head.appendChild(style);
                }
                callback(style.sheet);
            }
        });
    },
    
    setActiveSheet: function(sheet) {
    	var i, ln, regex, j, subLn, origsheet, activeSheet,
    		themeSheets = {},
        	styleSheets = Array.prototype.slice.call(document.styleSheets);

	    Ext.iterate(app.themesData, function(id, theme) {
	        regex = new RegExp(Ext.util.Format.escapeRegex(theme.file) + '$');
	        for (j = 0,subLn = styleSheets.length; j < subLn; j++) {
	            origsheet = styleSheets[j];
	            if (origsheet.href && origsheet.href.search(regex) !== -1) {
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
            'blackberry': {id: 'blackberry', name: 'Toronto', file: 'bb6.css'},
            'postgarage': {id: 'postgarage', name: 'Postgarage', file: 'postgarage.css'},
     },
     
     
     

	/*********************
	* Global action sheets
	**********************/
	actionSheets: {
		'settings': new Ext.ActionSheet({
		    items: [
		        {
		            text: 'Clear Config',
		            listeners: {
	                    'tap': function(){
	                    	app.clearConfig();	                    	
	                    }
	                },
		        },
		        {
		            text: 'Auto Layout',
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
		            text: 'Postgarage Theme',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({theme: 'postgarage'});
	                    	app.appendStyleSheet("lib/resources/css/" + app.themesData['postgarage'].file, function(sheet) {
	                            app.setActiveSheet(sheet);
	                        });
	                    }
	                },
		        },
		        {
		            text: 'Toggle Page Transitions',
		            listeners: {
	                    'tap': function(){
	                    	app.hideActionsheet();
	                    	app.updateConfig({animations: !app.CONF.animations})
					        app.mainLaunch();
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
		//TODO: multiple sources not implemented yet
		'news_sources': [
			{name: 'Postgarage Events', 'url': 'http://www.postgarage.at/?id=26&type=102', type: 'json'},
		],
		'store_page_param': 'tx_ttnews[pointer]',
		'page_transition': 'slide',
		//'page_transition': false,
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
    	s.add({id: 1, layout: 'auto', theme: 'sencha', 'animations': true, });
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
});