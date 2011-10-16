Ext.ns('Ext.ux');
Ext.ux.CustomSlider = Ext.extend(Object, {
    valueTextClass: 'x-slider-value-text',
    valueUnit: '',
    valueUnitPos: 'before',
    tooltipStyle: 'background-color: #FFF; text-align: center',
    showSliderBothEndValue: true,
    sliderEndValuePos: 'under',
    sliderEndValueStyle: 'color: green',
    displaySliderValue: true,
    hideDelay: 1000, //time in ms after which the tooltip should be hidden on dragend 
    
    tooltipHideTimer: null,
    parent: null,

    constructor: function(config){
        Ext.apply(this, config);
        Ext.ux.CustomSlider.superclass.constructor.apply(this, arguments);
    },
    init: function(parent) {
        var me = this;
        this.parent = parent;
        parent.on({
            drag: {
                fn: function(slider, thumb, value) {
                    me.showTooltip(value);
                }
            },
            dragend: {
                fn: function (slider, thumb, value) {
                	me.hideTooltip();
                }
            },
            afterrender: {
                fn: function(component) {
                    if (me.showSliderBothEndValue) me.showSliderEndValue(this);
                    if (!this.valueTextEl) {
                        this.valueTextEl = component.getEl().createChild({
                            cls: me.valueTextClass
                        });
                    }

                }
            },
            change: function(slider, thumb, newValue, oldValue) {
            	me.showTooltip(newValue);
            	me.hideTooltip();
            },
        });
    },
    
    showTooltip: function(value) {
    	var thumb = this.parent.getThumb();
    	var pos = [thumb.el.getXY()[0], thumb.el.getXY()[1]];
    	var width = value.toString().length * 20;  //number of digits
        
        this.createSliderToolTip();
        
        //clear hide timer
        if (this.tooltipHideTimer !== null) {
        	clearTimeout(this.tooltipHideTimer);
        	this.tooltipHideTimer = null;
        }
        
        this.sliderTooltip.hide();
        this.sliderTooltip.setWidth(width);
        this.sliderTooltip.x = (pos[0]-width-50);
        this.sliderTooltip.y = (pos[1]);
        this.sliderTooltip.show();
        this.sliderTooltip.el.setHTML(value);
    },
    
    hideTooltip: function() {
    	var me = this; 
    	me.tooltipHideTimer = setTimeout( function() {
    		me.sliderTooltip.hide();
        	//me.showSliderValue(me.valueTextEl, slider, thumb, value);
    	}, me.hideDelay);
    },
    
    showSliderValue: function(valueTextEl, slider, thumb, value) {
    	if (this.displaySliderValue) {
	        if (this.valueUnitPos == 'before') {
	            valueTextEl.setHTML(this.valueUnit + value);
	        } else {
	            if (parseFloat(value) > 1) {
	                valueTextEl.setHTML(value + '&amp;nbsp' + this.valueUnit + 's');
	            } else {
	                valueTextEl.setHTML(value + '&amp;nbsp' + this.valueUnit);
	            }
	        }
	        
	        var left = thumb.getEl().getX(),
	        thumbWidth = thumb.getEl().getWidth(),
	        thumbHeight = thumb.getEl().getHeight(),
	        top = thumbHeight / 2,
	        textWidth = valueTextEl.getWidth(),
	        sliderLength = slider.getWidth();
	        
	        if (left > sliderLength - textWidth - thumbWidth) {
	            left = left - textWidth - thumbWidth / 2;
	        } else {
	            left = left + thumbWidth / 2;
	        }
	
	        valueTextEl.setLeft(left);
	        valueTextEl.setTop(top);        
		}
    },
    showSliderEndValue: function(slider) {
        var sliderPosX = slider.getThumb().getEl().getX();
        var minValueEl = slider.getEl().createChild();
        minValueEl.setHTML(slider.minValue);
        minValueEl.applyStyles('overflow:hidden;position:absolute');
        minValueEl.applyStyles(this.sliderEndValueStyle);
        
        var thumbHeight = slider.getThumb().getEl().getHeight();
        minValueEl.setLeft(sliderPosX - 2);
        if (this.sliderEndValuePos == 'above') {
            minValueEl.setTop(-4);                            
        } else {
            minValueEl.setTop(thumbHeight + 2);
        }
        
        var maxValueEl = slider.getEl().createChild();
        maxValueEl.setHTML(slider.maxValue);
        maxValueEl.applyStyles('overflow:hidden;position:absolute');
        maxValueEl.applyStyles(this.sliderEndValueStyle);
        
        var sliderLength = slider.getEl().getWidth();
        var maxTextWidth = maxValueEl.getWidth();
        maxValueEl.setLeft(sliderLength - maxTextWidth - 25);
        if (this.sliderEndValuePos == 'above') {
            maxValueEl.setTop(-4);
        } else {
            maxValueEl.setTop(thumbHeight + 2);
        }
    },
    createSliderToolTip: function() {
        if (! this.sliderTooltip) {
            this.sliderTooltip = new Ext.Panel({
                floating: true,
                height: 30,
                styleHtmlContent: true,
                style: this.tooltipStyle,
                hideOnMaskTap: false,
            });
        }   
    }
});