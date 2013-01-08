define([
    "underscore",
    "backbone"
], function(_, Backbone) {
    var ItemsCollection = Backbone.Collection.extend({
        initialize: function(items, options) {
            // connect to player model
            options.player.set({ items: this });
            this.player = options.player;
        },

        getNowPlayingModel: function() {
            var nowPlaying = this.player.get("nowPlaying");
            return this.get(nowPlaying);
        },  

        getNowPlayingIndex: function() {
            return this.indexOf(this.getNowPlayingModel());
        },  

        getNextModel: function() {
            return this.at(this.getNowPlayingIndex() + 1);
        }
    });
    
    return ItemsCollection;
});
