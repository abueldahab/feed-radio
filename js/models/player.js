define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {

    var PlayerModel = Backbone.Model.extend({
        defaults: {
            soundcloudID: "pmMtnx3RtGTjpsLJQDptsQ"
        },  

        initialize: function() {
            this.on("change:view", function() {
                this.view = this.get("view");
            });

            this.on("change:nowPlaying", function() {
                this.view.render();
            });

            window.SC.initialize({ client_id: this.get("soundcloudID") });
            
            $(document).on("keyup", function(event) {
                if ( event.which == 39 ) { 
                    $(".track-next").trigger("click");
                } else if ( event.which == 37 ) { 
                    $(".track-prev").trigger("click");
                }   
            });
        },  

        setNowPlaying: function(itemId, autoplay) {
            this.set({
                nowPlaying: itemId,
                autoplay: autoplay === false ? false : true
            }); 
        }   
    });

    return PlayerModel;
});
