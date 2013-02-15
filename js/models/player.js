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
            // map view attr to easier-to-get prop
            this.on("change:view", function() {
                this.view = this.get("view");
            });

            // trigger new player when nowPlaying attribute is changed
            this.on("change:nowPlaying", function() {
                this.view.render();
            });

            // init global Soundcloud 
            window.SC.initialize({ client_id: this.get("soundcloudID") });
        }
    });

    return PlayerModel;
});
