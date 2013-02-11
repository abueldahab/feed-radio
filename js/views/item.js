define([
    "jquery", 
    "underscore", 
    "backbone"
], function($, _, Backbone) {
    var ItemView = Backbone.View.extend({
        events: {
            click: "toggle"
        },  

        initialize: function(attrs) {
            this.player = attrs.player;
        }, 

        toggle: function(event) {
            if ( event.target.className == "icon-external-link" ) return;
            
            if ( this.player.get("nowPlaying") == this.id ) {
                this.pause();
            } else {
                this.activate();
            }
        },

        togglePlayClass: function(isPlaying) {
            if ( isPlaying ) {
                $(".icon-pause").removeClass("icon-pause").addClass("icon-play");
            } else {
                this.$el.find(".media-button").removeClass("icon-play").addClass("icon-pause");
            }
        },

        activate: function() {
            $(".icon-pause").removeClass("icon-pause").addClass("icon-play");
            this.$el.find(".media-button").removeClass("icon-play").addClass("icon-pause");

            if ( window.SM ) window.SM.stop();
            this.player.setNowPlaying(this.id);
        }   
    });

    return ItemView;
});
