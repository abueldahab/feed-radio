define([
    "jquery",
    "backbone"
], function($, Backbone) {
    var TitleBarView = Backbone.View.extend({
        events: {
            "click #title": "scrollToMedia"
        },

        scrollToMedia: function() {
            var nowPlaying = this.options.items.getNowPlayingModel();
            window.scrollTo(0, nowPlaying.attributes.view.$el.offset().top - this.$el.height());
        }
    });

    return TitleBarView;
});
