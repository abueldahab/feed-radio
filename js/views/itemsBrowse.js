define([
    "underscore",
    "backbone",
    "views/browse"
], function(_, Backbone, BrowseView) {
    var ItemsBrowseView = BrowseView.extend({

        initialize: function() {
            var _this = this;
            $(".items").on("webkitTransitionEnd transitionend", function() { _this.triggerScrollUpdate() });
        },

        browse: function() {
            var browsePrev = this.options.prev,
                // # pixels +/- to margin-left on click
                leftShift = $(".items-view").width() * ( browsePrev ? 1 : -1 ) * 0.8, 
                // effective width of items
                usableLeftShift = ( $(".item").width() * this.options.items.length ) - Math.abs(leftShift), 
                currentMarginLeft = parseInt($(".items").css("margin-left"), 10);

            // if not enough room to shift left
            if ( leftShift > -1 * currentMarginLeft ) { 
                leftShift = -1 * currentMarginLeft;

            // if not enough room to shift right
            } else if ( leftShift - currentMarginLeft > usableLeftShift ) { 
                leftShift = usableLeftShift;
            }   

            var leftShiftWithSign = ( leftShift < 0 ? "-" : "+" ) + "=" + Math.abs(leftShift);
            $(".items").css({ marginLeft: leftShiftWithSign });
        },

        triggerScrollUpdate: function() {
            $(".items-view").trigger("scroll-update");
        }
    });
    
    return ItemsBrowseView;
});
