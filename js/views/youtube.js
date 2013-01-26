define([
    "underscore",
    "backbone",
    "views/item"
], function(_, Backbone, ItemView) {
    var YoutubeView = ItemView.extend({
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
            var view = this;
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
                },
                events: {
                    onStateChange: function(state) {
                        // track is finished, toggle next
                        if ( state.data === 0 ) {
                            view.player.view.toggleNext();

                        // track is playing, toggle active state row item
                        } else if ( state.data === 1 && view.player.get("nowPlaying").id == view.id ) {
                            view.player.view.toggleNowPlaying();
                        }
                    }
                }
            });
        }   
    });

    return YoutubeView;
});
