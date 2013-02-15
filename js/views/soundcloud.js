define([
    "underscore",
    "backbone",
    "views/item"
], function(_, Backbone, ItemView) {
    var SoundcloudView = ItemView.extend({
        pause: function() {
            window.SM.togglePause();
        },  

        createStream: function() {
            var view = this,
                player = this.model.collection.player;

            SC.stream(this.model.get("soundcloud_stream"), 
                {   
                    autoPlay: player.get("autoplay"),
                    onfinish: function() {
                        player.view.toggle("next");
                    }   
                },  
                function(sound) { 
                    window.SM = sound;
                }   
            );
        }   
    }); 
    
    return SoundcloudView;
});
