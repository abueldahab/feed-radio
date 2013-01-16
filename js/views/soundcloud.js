define([
    "underscore",
    "backbone",
    "views/item"
], function(_, Backbone, ItemView) {
    var SoundcloudView = ItemView.extend({
        play: function() {
            window.SM.togglePause();
        },

        pause: function() {
            var isPlaying = !window.SM.paused;
            window.SM.togglePause();
            this.togglePlayClass(isPlaying);
        },  

        createStream: function() {
            var item = this;
            SC.stream(this.model.get("soundcloud_stream"), 
                {   
                    autoPlay: this.player.get("autoplay"),
                    onfinish: function() {
                        item.player.view.toggleNext();
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
