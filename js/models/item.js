define([
    "underscore",
    "backbone"
], function(_, Backbone) {
    var ItemModel = Backbone.Model.extend({
        initialize: function(attrs) {
            this.set(attrs);
        }   
    });

    return ItemModel;
});
