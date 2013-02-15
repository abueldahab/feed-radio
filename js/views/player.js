define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {
    var PlayerView = Backbone.View.extend({
        initialize: function() {
            this.model.set({ 
                view: this
            });  
        },  

        render: function() {
            // render player with new item attrs
            var model = this.model,
                items = model.get("items");

            if ( !model.get("nowPlaying") ) {
                model.set({
                    "nowPlaying": items.at(0).id, 
                    "autoplay": false
                });
            }

            var nowPlayingIndex = model.get("nowPlaying"),
                nowPlayingModel = items.get(nowPlayingIndex),
                playerTemplate = _.template($("#" + nowPlayingModel.attributes.mediaSrc + "-player-template").html(), 
                    nowPlayingModel.attributes),
                titleTemplate = _.template($("#title-wrap-template").html(), nowPlayingModel.attributes);
            
            $("#media-wrap").html(playerTemplate);
            $("#title-wrap").html(titleTemplate);

            // init stream
            nowPlayingModel.get("view").createStream();

            return this;
        },  

        toggle: function(target) {
            var items = this.model.get("items");
            if ( target == "prev" ) {
                items.getPrevModel().get("view").activate();
            } else if ( target == "next" ) {
                items.getNextModel().get("view").activate();
            } else {
                items.getNowPlayingModel().get("view").toggle();
            }
        }
    });

    return PlayerView;
});
