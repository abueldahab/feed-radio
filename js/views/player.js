define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {
    var PlayerView = Backbone.View.extend({
        events: {
            /* map image clicks to pause/play
             * media in iframe, e.g. youtube, doesn't register click so is handled in YoutubeView */
            "click img": "toggleNowPlaying"
        },  

        initialize: function() {
            this.model.set({ 
                view: this
            });  
        },  

        render: function() {
            // render player with new item attrs
            var nowPlayingIndex = this.model.get("nowPlaying") || this.model.setNowPlaying(this.model.get("items").at(0).id, false),
                nowPlayingModel = this.model.get("items").get(nowPlayingIndex);

            var playerTemplate = _.template($("#" + nowPlayingModel.attributes.mediaSrc + "-player-template").html(), 
                    nowPlayingModel.attributes),
                titleTemplate = _.template($("#title-wrap-template").html(), nowPlayingModel.attributes);
            
            $("#media-wrap").html(playerTemplate);
            $("#title-wrap").html(titleTemplate);

            nowPlayingModel.get("view").createStream();

            return this;
        },  

        toggleNowPlaying: function() {
            this.model.get("items").getNowPlayingModel().get("view").toggle();
        },

        toggleNext: function() {
            this.model.get("items").getNextModel().get("view").activate();
        },

        togglePrev: function() {
            itemsCollection.getPrevModel().get("view").activate();
        }
    });

    return PlayerView;
});
