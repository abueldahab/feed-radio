define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {
    var PlayerView = Backbone.View.extend({
        events: {
            "click img, click iframe": "toggleNowPlaying",
            "click a": "scrollToItem"
        },  

        initialize: function() {
            this.model.set({ 
                view: this
            });  
        },  

        render: function() {
            $("#media-wrap").css({ opacity: 0 });
            
            if ( !this.model.get("nowPlaying") ) this.model.setNowPlaying(this.model.get("items").at(0).id, false);

            var nowPlayingIndex = this.model.get("nowPlaying"),
                nowPlayingModel = this.model.get("items").get(nowPlayingIndex),
                template = _.template($("#player_" + nowPlayingModel.attributes.mediaSrc + "_template").html(), 
                    nowPlayingModel.attributes);

            $("#title").html(nowPlayingModel.attributes.title);
            $("#title-wrap a").html("#").attr("href", "#" + nowPlayingModel.attributes.id);
            $("#media-wrap").html(template).css({ opacity: 1 });
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
        },

        scrollToItem: function(event) {
            var itemCoords = $(event.target.id).offset();
            window.scrollTo(itemCoords.top, itemCoords.left);
            return false;
        }
    });

    return PlayerView;
});
