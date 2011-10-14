Ext.ns('Ext.ux');
Ext.ux.CustomSlider = Ext.extend(Object, {
    valueTextClass: 'x-slider-value-text',
    valueUnit: '',
    valueUnitPos: 'before',
    tooltipStyle: 'background-color: #FFF; text-align: center',
    showSliderBothEndValue: true,
    sliderEndValuePos: 'under',
    sliderEndValueStyle: 'color: green',

    constructor: function(config){
        Ext.apply(this, config);
        Ext.ux.CustomSlider.superclass.constructor.apply(this, arguments);
    },
    init: function(parent) {
        var me = this;
        parent.on({
            drag: {
                fn: function(slider, thumb, value) {
                    me.sliderTooltip.setWidth(value.length * 1.5);
                    me.sliderTooltip.showBy(thumb);
                    me.sliderTooltip.el.setHTML(value);
                }
            },
            dragend: {
                fn: function (slider, thumb, value) {
                    me.sliderTooltip.hide();
                    me.showSliderValue(this.valueTextEl, slider, thumb, value);
                }
            },
            afterrender: {
                fn: function(component) {
                    me.createSliderToolTip();
                    if (me.showSliderBothEndValue) me.showSliderEndValue(this);
                    if (!this.valueTextEl) {
                        this.valueTextEl = component.getEl().createChild({
                            cls: me.valueTextClass
                        });
                    }
                }
            }
        });
    },
    showSliderValue: function(valueTextEl, slider, thumb, value) {
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
                style: this.tooltipStyle
            });
        }   
    }
});