Ext.regApplication('app', {
    name: 'app',
    launch: function() {
        this.launched = true;
        this.mainLaunch();
    },
    mainLaunch: function() {
        if (!device || !this.launched) {return;}
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
    	
    	if (app.floatingPanelsStack.length != 0) {
    		app.hideFloatingPanel();
    		return;
    	}    	
    	
    	if (app.activeActionSheets.length != 0) {
    		app.hideActionsheet();
    		return;
    	}
    	
    	app.viewstack.pop();
    	
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
	
	/*****************************************
	* keep track of used actionsheets for 
	* handling them in the backbutton handler
	******************************************/ 
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
	
	
	
	/*****************************************
	* keep track of display floating panels for 
	* handling them in the backbutton handler
	******************************************/	
	floatingPanelsStack: [],
	showFloatingPanel: function(panel) {
		app.floatingPanelsStack.push(panel);
		//Workaround: when disableAnimations is set to true, the selectfields
		//on the settings panel didn't work correctly
		Ext.Anim.override({ disableAnimations:false });
		panel.show();
	},
	
	hideFloatingPanel: function() {
		var panel = app.floatingPanelsStack.pop();
		panel.hide();
		//reset to config setting
		Ext.Anim.override({	disableAnimations:!Ext.Anim.disableAnimations });
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
		'network_timeout': 3000,
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
    	s.add({id: 1, layout: 'auto', theme: 'postgarage', 'animations': true, });
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