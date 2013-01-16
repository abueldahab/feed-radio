define([
    "underscore",
    "backbone",
    "views/item",
    "youtube"
], function(_, Backbone, ItemView) {
    var YoutubeView = ItemView.extend({
        play: function() {
            window.ytPlayer.playVideo();
        },

        pause: function() {
            var isPlaying = window.ytPlayer.getPlayerState() == 1;
            if ( isPlaying ) { 
                window.ytPlayer.pauseVideo();
            } else {
                window.ytPlayer.playVideo();
            }   
            this.togglePlayClass(isPlaying);
        },  

        createStream: function() {
            window.ytPlayer = new YT.Player(this.id + "-player", {
                height: 300,
                width: 533,
                videoId: this.id,
                playerVars: {
                    autoplay: this.options.player.get("autoplay") ? 1 : 0,
                    controls: 1,
                    showinfo: 0,
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 0,
                    cc_load_policy: 0
                }
            });
    
            var view = this;
            window.ytPlayer.addEventListener("onStateChange", 
                function(state) { 
                    if ( state.data === 0 ) view.player.view.toggleNext();
                }   
            );
        }   
    });

    return YoutubeView;
});
