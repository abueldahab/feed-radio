define([
    "jquery", 
    "backbone"
], function($, Backbone) {
    var ItemView = Backbone.View.extend({
        events: {
            "click .list-data, img": "toggle"
        }, 

        toggle: function(event) {
            // ignore click if link element is target
            if ( event && event.target.className == "icon-external-link" ) return;
            
            if ( this.model.collection.player.get("nowPlaying") == this.id ) {
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
            // toggle active class
            $(".active").removeClass("active");
            this.$el.addClass("active");

            if ( window.SM ) window.SM.stop();

            // move player to new item
            this.$el.append($("#player"));
            var autoplay = this.model.collection.player.get("nowPlaying");
            this.model.collection.player.set({ 
                "nowPlaying": this.id, 
                "autoplay": autoplay    
            }); 
            
            window.scrollTo(0, this.$el.offset().top - $("#title-bar").height());
        }   
    });

    return ItemView;
});
