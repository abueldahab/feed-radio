define([
    "underscore",
    "backbone",
    "views/item"
], function(_, Backbone, ItemView) {
    var YoutubeView = ItemView.extend({
        pause: function() {
            if ( window.ytPlayer.getPlayerState() == 1 ) { 
                window.ytPlayer.pauseVideo();
            } else {
                window.ytPlayer.playVideo();
            }   
        },  

        createStream: function() {
            if ( typeof YT == 'undefined' || typeof YT.Player == 'undefined') {
                var view = this;
                window.onYouTubeIframeAPIReady = function() {
                    view.createYoutubeStream();
                };
            } else {
                this.createYoutubeStream();
            }
        },   

        createYoutubeStream: function() {
            var view = this;
            window.ytPlayer = new YT.Player(this.id + "-player", {
                height: 300,
                width: 533,
                videoId: this.id,
                playerVars: {
                    autoplay: this.model.collection.player.get("autoplay") ? 1 : 0,
                    controls: 1,
                    showinfo: 0,
                    rel: 0,
                    modestbranding: 1,
                    iv_load_policy: 0,
                    cc_load_policy: 0
                },
                events: {
                    onStateChange: function(state) {
                        view.handleYoutubeStateChange(state, view);
                    }
                }
            });
        },

        handleYoutubeStateChange: function(state, view) {
            var player = view.model.collection.player;

            // track is finished, toggle next
            if ( state.data === 0 ) {
                player.view.toggle("next");

            // track is playing, toggle active state row item
            } else if ( state.data === 1 && player.get("nowPlaying").id == view.id ) {
                player.view.toggle();
            }
        }
    });

    return YoutubeView;
});
