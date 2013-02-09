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

            // only load images if we're in a window wider than 600px
            if ( $(document).width() > 600 ) {
                this.$el.find("img").lazyload({
                    effect: "fadeIn",
                    threshold: 200
                });
            }
        }, 

        toggle: function() {
            if ( this.player.get("nowPlaying") == this.id ) {
                this.pause();
            } else {
                this.activate();
            }
        },

        togglePlayClass: function(isPlaying) {
            if ( isPlaying ) {
                $(".playing").removeClass("playing");
            } else {
                this.$el.addClass("playing");
            }
        },

        activate: function() {
            $(".active_item").removeClass("active_item");
            $(".playing").removeClass("playing");
            this.$el.addClass("playing");

            if ( window.SM ) window.SM.stop();
            this.player.setNowPlaying(this.id);
        }   
    });

    return ItemView;
});
