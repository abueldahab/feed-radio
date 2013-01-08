define([
    "underscore",
    "backbone"
], function(_, Backbone) {
    var BrowseView = Backbone.View.extend({
        events: {
            click: "browse"
        }   
    }); 

    return BrowseView;
});
