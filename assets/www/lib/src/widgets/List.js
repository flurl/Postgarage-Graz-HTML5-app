/**
 * @class Ext.List
 * @extends Ext.DataView
 * <p>A mechanism for displaying data using a list layout template. List uses an {@link Ext.XTemplate}
 * as its internal templating mechanism, and is bound to an {@link Ext.data.Store} so that as the data 
 * in the store changes the view is automatically updated to reflect the changes.</p>
 * <p>The view also provides built-in behavior for many common events that can occur for its contained items
 * including itemtap, containertap, etc. as well as a built-in selection model. <b>In order to use these
 * features, an {@link #itemSelector} config must be provided for the DataView to determine what nodes it
 * will be working with.</b></p>
 * 
 * <h2>Useful Properties</h2>
 * <ul class="list">
 *   <li>{@link #itemTpl}</li>
 *   <li>{@link #store}</li>
 *   <li>{@link #grouped}</li>
 *   <li>{@link #indexBar}</li>
 *   <li>{@link #singleSelect}</li>
 *   <li>{@link #multiSelect}</li>
 * </ul>
 * 
 * <h2>Useful Methods</h2>
 * <ul class="list">
 *   <li>{@link #bindStore}</li>
 *   <li>{@link #getRecord}</li>
 *   <li>{@link #getRecords}</li>
 *   <li>{@link #getSelectedRecords}</li>
 *   <li>{@link #getSelectedNodes}</li>
 *   <li>{@link #indexOf}</li>
 * </ul>
 * 
 * <h2>Useful Events</h2>
 * <ul class="list">
 *   <li>{@link #itemtap}</li>
 *   <li>{@link #itemdoubletap}</li>
 *   <li>{@link #itemswipe}</li>
 *   <li>{@link #selectionchange}</li>
 * </ul>
 * 
 * <h2>Screenshot:</h2>
 * <p><img src="doc_resources/Ext.List/screenshot.png" /></p>
 * 
 * <h2>Example code:</h2>
 * <pre><code>
Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

var store = new Ext.data.JsonStore({
    model  : 'Contact',
    sorters: 'lastName',

    getGroupString : function(record) {
        return record.get('lastName')[0];
    },

    data: [
        {firstName: 'Tommy',   lastName: 'Maintz'},
        {firstName: 'Rob',     lastName: 'Dougan'},
        {firstName: 'Ed',      lastName: 'Spencer'},
        {firstName: 'Jamie',   lastName: 'Avins'},
        {firstName: 'Aaron',   lastName: 'Conran'},
        {firstName: 'Dave',    lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay',     lastName: 'Robinson'}
    ]
});

var list = new Ext.List({
    fullscreen: true,
    
    itemTpl : '{firstName} {lastName}',
    grouped : true,
    indexBar: true,
    
    store: store
});
list.show();
   </code></pre>
 * @constructor
 * Create a new List
 * @param {Object} config The config object
 * @xtype list
 */
Ext.List = Ext.extend(Ext.DataView, {
    componentCls: 'x-list',

    /**
     * @cfg {Boolean} pinHeaders
     * Whether or not to pin headers on top of item groups while scrolling for an iPhone native list experience.
     * Defaults to <tt>false</tt> on Android and Blackberry (for performance reasons)
     * Defaults to <tt>true</tt> on other devices.
     */
    pinHeaders: Ext.is.iOS || Ext.is.Desktop,

    /**
     * @cfg {Boolean/Object} indexBar
     * True to render an alphabet IndexBar docked on the right.
     * This can also be a config object that will be passed to {@link Ext.IndexBar}
     * (defaults to false)
     */
    indexBar: false,

    /**
     * @cfg {Boolean} grouped
     * True to group the list items together (defaults to false). When using grouping, you must specify a method getGroupString
     * on the store so that grouping can be maintained.
     * <pre><code>
Ext.regModel('Contact', {
    fields: ['firstName', 'lastName']
});

var store = new Ext.data.JsonStore({
    model  : 'Contact',
    sorters: 'lastName',

    getGroupString : function(record) {
        // Group by the last name
        return record.get('lastName')[0];
    },

    data: [
        {firstName: 'Tommy',   lastName: 'Maintz'},
        {firstName: 'Rob',     lastName: 'Dougan'},
        {firstName: 'Ed',      lastName: 'Spencer'},
        {firstName: 'Jamie',   lastName: 'Avins'},
        {firstName: 'Aaron',   lastName: 'Conran'},
        {firstName: 'Dave',    lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay',     lastName: 'Robinson'},
        {firstName: 'Tommy',   lastName: 'Maintz'},
        {firstName: 'Rob',     lastName: 'Dougan'},
        {firstName: 'Ed',      lastName: 'Spencer'},
        {firstName: 'Jamie',   lastName: 'Avins'},
        {firstName: 'Aaron',   lastName: 'Conran'},
        {firstName: 'Dave',    lastName: 'Kaneda'},
        {firstName: 'Michael', lastName: 'Mullany'},
        {firstName: 'Abraham', lastName: 'Elias'},
        {firstName: 'Jay',     lastName: 'Robinson'}
    ]
});
       </code></pre>
     */
    grouped: false,

    /**
     * @cfg {Boolean} clearSelectionOnDeactivate
     * True to clear any selections on the list when the list is deactivated (defaults to true).
     */
    clearSelectionOnDeactivate: true,

    renderTpl: [
        '<tpl if="grouped"><h3 class="x-list-header x-list-header-swap x-hidden-display"></h3></tpl>'
    ],

    groupTpl : [
        '<tpl for=".">',
            '<div class="x-list-group x-group-{id}">',
                '<h3 class="x-list-header">{group}</h3>',
                '<div class="x-list-group-items">',
                    '{items}',
                '</div>',
            '</div>',
        '</tpl>'
    ],
    
    /**
     * @cfg {String} itemSelector
     * @private
     * @ignore
     * Not to be used.
     */
    itemSelector: '.x-list-item',
    
    /**
     * @cfg {String} itemCls An additional class that will be added to each item in the List.
     * Defaults to ''.
     */
    itemCls: '',
    
    /**
     * @cfg {String/Array} itemTpl
     * The inner portion of the item template to be rendered. Follows an XTemplate
     * structure and will be placed inside of a tpl for in the tpl configuration.
     */

    /**
     * @cfg {Boolean/Function/Object} onItemDisclosure
     * True to display a disclosure icon on each list item.
     * This won't bind a listener to the tap event. The list
     * will still fire the disclose event though.
     * By setting this config to a function, it will automatically
     * add a tap event listeners to the disclosure buttons which
     * will fire your function.
     * Finally you can specify an object with a 'scope' and 'handler'
     * property defined. This will also be bound to the tap event listener
     * and is useful when you want to change the scope of the handler.
     */
    onItemDisclosure: false,
    
    /**
     * @cfg {Boolean} preventSelectionOnDisclose True to prevent the item selection when the user
     * taps a disclose icon. Defaults to <tt>true</tt>
     */
    preventSelectionOnDisclose: true,

    // @private
    initComponent : function() {
        //<deprecated since=0.99>
        if (Ext.isDefined(this.dockedItems)) {
            console.warn("List: List is not a Panel anymore so you can't dock items to it. Please put this list inside a Panel with layout 'fit'");
        }
        //</deprecated>
        
        //<deprecated since=0.99>
        if (Ext.isDefined(this.components)) {
            console.warn("List: The Experimental components configuration is not currently supported.");
        }
        //</deprecated>
        
        //<deprecated since=0.99>
        if (Ext.isDefined(this.disclosure)) {
            console.warn("List: The disclosure configuration has been renamed to onItemDisclosure and will be removed.");
            this.onItemDisclosure = this.disclosure;
        }
        //</deprecated>
        
        var memberFnsCombo = {};
        //<deprecated since=0.99>
        if (this.tpl) {
            console.warn('Ext.List: The tpl config has been removed and replaced by itemTpl. Please remove tpl and itemSelector from your Lists.');
            // convert from array to string
            if (Ext.isArray(this.tpl)) {
                this.tpl = this.tpl.join('');
            } else if (this.tpl.html) {
                Ext.apply(memberFnsCombo, this.tpl.initialConfig);
                this.tpl = this.tpl.html;
            }
            this.tpl = Ext.util.Format.trim(this.tpl);
            if (this.tpl.indexOf("\"x-list-item\"") !== -1) {
                throw new Error("Ext.List: Using a CSS class of x-list-item within your own tpl will break Ext.Lists. Remove the x-list-item from the tpl/itemTpl");
            }
            var tpl       = this.tpl,
                first     = '<tpl for=".">',
                firstLn   = first.length,
                end       = '</tpl>',
                tplFirst  = this.tpl.substr(0, firstLn),
                tplEndIdx = this.tpl.lastIndexOf(end),
                stripped;
                
            if (tplFirst === first &&  tplEndIdx !== -1) {
                this.itemTpl = tpl.substr(firstLn, tplEndIdx - firstLn);
                this.itemSelector = Ext.List.prototype.itemSelector;
            } else {
                throw new Error("Ext.List: tpl to itemTpl conversion failed.");
            }
        }
        //</deprecated>
        
        if (Ext.isArray(this.itemTpl)) {
            this.itemTpl = this.itemTpl.join('');
        } else if (this.itemTpl && this.itemTpl.html) {
            Ext.apply(memberFnsCombo, this.itemTpl.initialConfig);
            this.itemTpl = this.itemTpl.html;
        }
        
        //<debug>
        if (!Ext.isDefined(this.itemTpl)) {
            throw new Error("Ext.List: itemTpl is a required configuration.");
        }
        // this check is not enitrely fool proof, does not account for spaces or multiple classes
        // if the check is done without "s then things like x-list-item-entity would throw exceptions that shouldn't have.
        if (this.itemTpl && this.itemTpl.indexOf("\"x-list-item\"") !== -1) {
            throw new Error("Ext.List: Using a CSS class of x-list-item within your own tpl will break Ext.Lists. Remove the x-list-item from the tpl/itemTpl");
        }
        //</debug>
        
        this.tpl = '<tpl for="."><div class="x-list-item ' + this.itemCls + '"><div class="x-list-item-body">' + this.itemTpl + '</div>';
        if (this.onItemDisclosure) {
            this.tpl += '<div class="x-list-disclosure"></div>';
        }
        this.tpl += '</div></tpl>';
        this.tpl = new Ext.XTemplate(this.tpl, memberFnsCombo);
       

        if (this.grouped) {
            
            this.listItemTpl = this.tpl;
            if (Ext.isString(this.listItemTpl) || Ext.isArray(this.listItemTpl)) {
                // memberFns will go away after removal of tpl configuration for itemTpl
                // this copies memberFns by storing the original configuration.
                this.listItemTpl = new Ext.XTemplate(this.listItemTpl, memberFnsCombo);
            }
            if (Ext.isString(this.groupTpl) || Ext.isArray(this.groupTpl)) {
                this.tpl = new Ext.XTemplate(this.groupTpl);
            }
        }
        else {
            this.indexBar = false;
        }
        
        if (this.scroll !== false) {
            this.scroll = {
                direction: 'vertical',
                useIndicators: !this.indexBar
            };
        }

        // if (this.enableAutoPaging) {
        //     this.enablePaging = true;
        // }
        
        Ext.List.superclass.initComponent.call(this);

        if (this.onItemDisclosure) {
            // disclosure can be a function that will be called when
            // you tap the disclosure button
            if (Ext.isFunction(this.onItemDisclosure)) {
                this.onItemDisclosure = {
                    scope: this,
                    handler: this.onItemDisclosure
                };
            }
        }

        this.on('deactivate', this.onDeactivate, this);
        
        this.addEvents(
             /**
              * @event disclose
              * Fires when the user taps the disclosure icon on an item
              * @param {Ext.data.Record} record The record associated with the item
              * @param {Ext.Element} node The wrapping element of this node
              * @param {Number} index The index of this list item
              * @param {Ext.util.Event} e The tap event that caused this disclose to fire
              */
             'disclose',
             
             /**
              * @event update
              * Fires whenever the contents of the List is updated.
              * @param {Ext.List} list This list
              */
             'update'
         );
    },

    // @private
    onRender : function() {
        if (this.grouped) {
            Ext.applyIf(this.renderData, {
                grouped: true
            });

            if (this.scroll) {
                Ext.applyIf(this.renderSelectors, {
                    header: '.x-list-header-swap'
                });                
            }
        }
        
        Ext.List.superclass.onRender.apply(this, arguments);
    },

    // @private
    onDeactivate : function() {
        if (this.clearSelectionOnDeactivate) {
            this.getSelectionModel().deselectAll();
        }
    },

    // @private
    afterRender : function() {
        if (!this.grouped) {
            this.el.addCls('x-list-flat');
        }
        this.getTargetEl().addCls('x-list-parent');

        if (this.indexBar) {
            this.indexBar = new Ext.IndexBar(Ext.apply({}, Ext.isObject(this.indexBar) ? this.indexBar : {}, {
                xtype: 'indexbar',
                alphabet: true,
                renderTo: this.el
            }));
            this.addCls('x-list-indexed');
        }
        
        Ext.List.superclass.afterRender.call(this);
        
        if (this.onItemDisclosure) {
            this.mon(this.getTargetEl(), 'singletap', this.handleItemDisclosure, this, {delegate: '.x-list-disclosure'});
        }
    },

    // @private
    initEvents : function() {
        Ext.List.superclass.initEvents.call(this);

        if (this.grouped) {
            if (this.pinHeaders && this.scroll) {
                this.mon(this.scroller, {
                    scrollstart: this.onScrollStart,
                    scroll: this.onScroll,
                    scope: this
                });
            }

            if (this.indexBar) {
                this.mon(this.indexBar, {
                    index: this.onIndex,
                    scope: this
                });
            }
        }
    },

    //@private
    handleItemDisclosure : function(e, t) {
        var node = this.findItemByChild(t),
            record, index;
            
        if (node) {
            record = this.getRecord(node);
            index  = this.indexOf(node);
            if (this.preventSelectionOnDisclose) {
                e.stopEvent();
            }
            this.fireEvent('disclose', record, node, index, e);
     
            if (Ext.isObject(this.onItemDisclosure) && this.onItemDisclosure.handler) {
                this.onItemDisclosure.handler.call(this, record, node, index);
            }
        }
    },

    /**
     * Set the current active group
     * @param {Object} group The group to set active
     */
    setActiveGroup : function(group) {
        var me = this;
        if (group) {
            if (!me.activeGroup || me.activeGroup.header != group.header) {
                me.header.setHTML(group.header.getHTML());
                me.header.show();
            }            
        }
        else {
            me.header.hide();
        }

        this.activeGroup = group;
    },

    // @private
    getClosestGroups : function(pos) {
        // force update if not already done
        if (!this.groupOffsets) {
            this.updateOffsets();
        }
        var groups = this.groupOffsets,
            ln = groups.length,
            group, i,
            current, next;

        for (i = 0; i < ln; i++) {
            group = groups[i];
            if (group.offset > pos.y) {
                next = group;
                break;
            }
            current = group;
        }

        return {
            current: current,
            next: next
        };
    },

    updateIndexes : function() {
        Ext.List.superclass.updateIndexes.apply(this, arguments);
        this.updateList();
    },

    afterComponentLayout : function() {
        Ext.List.superclass.afterComponentLayout.apply(this, arguments);
        this.updateList();
    },

    updateList : function() {
        this.fireEvent('update', this);
        this.updateOffsets();
    },
    
    updateOffsets : function() {
        if (this.grouped) {
            this.groupOffsets = [];

            var headers = this.getTargetEl().query('h3.x-list-header'),
                ln = headers.length,
                header, i;

            for (i = 0; i < ln; i++) {
                header = Ext.get(headers[i]);
                header.setVisibilityMode(Ext.Element.VISIBILITY);
                this.groupOffsets.push({
                    header: header,
                    offset: header.dom.offsetTop
                });
            }
        }
    },

    // @private
    onScrollStart : function() {
        var offset = this.scroller.getOffset();
        this.closest = this.getClosestGroups(offset);
        this.setActiveGroup(this.closest.current);
    },

    // @private
    onScroll : function(scroller, pos, options) {
        if (!this.closest) {
            this.closest = this.getClosestGroups(pos);
        }

        if (!this.headerHeight) {
            this.headerHeight = this.header.getHeight();
        }

        if (pos.y <= 0) {
            if (this.activeGroup) {
                this.setActiveGroup(false);
                this.closest.next = this.closest.current;
            }
            return;
        }
        else if (
            (this.closest.next && pos.y > this.closest.next.offset) ||
            (pos.y < this.closest.current.offset)
        ) {
            this.closest = this.getClosestGroups(pos);
            this.setActiveGroup(this.closest.current);
        }
        if (this.closest.next && pos.y > 0 && this.closest.next.offset - pos.y <= this.headerHeight) {
            var transform = this.headerHeight - (this.closest.next.offset - pos.y);
            Ext.Element.cssTranslate(this.header, {x: 0, y: -transform});
            this.transformed = true;
        }
        else if (this.transformed) {
            this.header.setStyle('-webkit-transform', null);
            this.transformed = false;
        }
    },

    // @private
    onIndex : function(record, target, index) {
        var key = record.get('key').toLowerCase(),
            groups = this.store.getGroups(),
            ln = groups.length,
            group, i, closest, id;

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = this.getGroupId(group);

            if (id == key || id > key) {
                closest = id;
                break;
            }
            else {
                closest = id;
            }
        }

        closest = this.getTargetEl().down('.x-group-' + id);
        if (closest) {
            this.scroller.scrollTo({x: 0, y: closest.getOffsetsTo(this.scrollEl)[1]}, false, null, true);
        }
    },
    
    getGroupId : function(group) {
        return group.name.toLowerCase();
    },

    // @private
    collectData : function(records, startIndex) {
        if (!this.grouped) {
            return Ext.List.superclass.collectData.call(this, records, startIndex);
        }

        var results = [],
            groups = this.store.getGroups(),
            ln = groups.length,
            children, cln, c,
            group, i;

        for (i = 0, ln = groups.length; i < ln; i++) {
            group = groups[i];
            children = group.children;
            for (c = 0, cln = children.length; c < cln; c++) {
                children[c] = children[c].data;
            }
            results.push({
                group: group.name,
                id: this.getGroupId(group),
                items: this.listItemTpl.apply(children)
            });
        }

        return results;
    },

    // Because the groups might change by an update/add/remove we refresh the whole dataview
    // in each one of them
    // @private
    onUpdate : function(store, record) {
        if (this.grouped) {
            this.refresh();
        }
        else {
            Ext.List.superclass.onUpdate.apply(this, arguments);
        }
    },

    // @private
    onAdd : function(ds, records, index) {
        if (this.grouped) {
            this.refresh();
        }
        else {
            Ext.List.superclass.onAdd.apply(this, arguments);
        }
    },

    // @private
    onRemove : function(ds, record, index) {
        if (this.grouped) {
            this.refresh();
        }
        else {
            Ext.List.superclass.onRemove.apply(this, arguments);
        }
    }
});

Ext.reg('list', Ext.List);
