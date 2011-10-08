app.views.Settings = Ext.extend(Ext.form.FormPanel, {
    /**********************************
	* Ext properties
	**********************************/
	styleHtmlContent:true,
    scroll: 'vertical',
    padding: 0,
    bodyPadding: 0,
	cls: 'settings',
    autoRender: true,
    floating: true,
    modal: true,
    centered: true,
    hideOnMaskTap: false,
    height: 385,
    width: 480,
    items: [
    	{
    		xtype: 'togglefield',
    		name: 'animations',
    		label: 'Use Animations',
    		listeners: {
	   			change: function() {app.views.settings.restartRequired = true;},
	   		},
    	},
    	{
    		xtype: 'selectfield',
    		name: 'layout',
    		label: 'Layout',
    		options: [
    			{text: 'Auto', value: 'auto' },
    			{text: 'Phone', value: 'small' },
    			{text: 'Tablet', value: 'big' },
	   		],
	   		listeners: {
	   			change: function() {app.views.settings.restartRequired = true;},
	   		},
    	},
    	{
    		xtype: 'selectfield',
    		name: 'theme',
    		label: 'Theme',
    		options: [
    			{text: 'Postgarage', value: 'postgarage' },
    			{text: 'Cupertino', value: 'apple' },
    			{text: 'Mountain View', value: 'android' },
    			{text: 'Toronto', value: 'blackberry' },
    			{text: 'Sencha', value: 'sencha' },
	   		],
	   		listeners: {
	   			change: function() {app.views.settings.restartRequired = true;},
	   		},
    	},
    ],
    
    dockedItems: [
    	{
    		xtype: 'toolbar',
	        title: 'Settings',
		},
        {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
            	{
                    text: 'Reset Settings',
                    ui: 'cancel',
                    handler: function() {
                    	app.initConfig();
                        app.views.settings.hide();
                        app.mainLaunch();
                    }
                },
                {xtype: 'spacer'},
                {
                    text: 'Save',
                    ui: 'confirm',
                    handler: function() {
                    	app.views.settings.updateConfig();
                    	app.views.settings.hide();
                    	if (app.views.settings.restartRequired) {
                    		app.mainLaunch();
                    	}
                    }
                }
            ]
        }
    ],
    
    listeners: {
    	show: function() {
    		var view = app.views.settings;
    		view.adjustSize();
    		view.CONF = app.CONF;
    		view.setupForm();
    		view.restartRequired = false;
    	},
    	orientationchange: function() {
    		app.views.settings.adjustSize();
    	},
    },
	
	/**********************************
	* custom properties
	**********************************/
	restartRequired: false,
	
	adjustSize: function() {
		app.views.settings.setSize(window.innerWidth-100, window.innerHeight-100);
	},
	
	setupForm: function() {
		var c = app.CONF;
		this.items.items[0].setValue(c.animations);
		this.items.items[1].setValue(c.layout);
		this.items.items[2].setValue(c.theme);
	},
	
	updateConfig: function() {
		var c = app.CONF;
		c.animations = this.items.items[0].getValue();
		c.layout = this.items.items[1].getValue();
		c.theme = this.items.items[2].getValue();
		app.updateConfig(c);
	}
});