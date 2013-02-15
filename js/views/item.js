define([
    "jquery", 
    "backbone"
], function($, Backbone) {
    var ItemView = Backbone.View.extend({
        events: {
            "click .list-data": "toggle"
        },  

        initialize: function(attrs) {
            this.player = attrs.player;
        }, 

        toggle: function(event) {
            // ignore click if link element is target
            if ( event && event.target.className == "icon-external-link" ) return;
            
            if ( this.player.get("nowPlaying") == this.id ) {
                this.pause();
            } else {
                this.activate();
            }
        },

        togglePlayClass: function(isPlaying) {
            if ( isPlaying ) {
                $(".active").removeClass("active");
            } else {
                this.$el.addClass("active");
            }
        },

        activate: function() {
            $(".active").removeClass("active");
            this.$el.addClass("active");

            if ( window.SM ) window.SM.stop();

            this.$el.append($("#player"));
            this.player.setNowPlaying(this.id);
            window.scrollTo(0, this.$el.offset().top - $("#title-bar").height());
        }   
    });

    return ItemView;
});
