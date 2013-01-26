define([
    "jquery",
    "underscore",
    "backbone"
], function($, _, Backbone) {
    var PlayerView = Backbone.View.extend({
        events: {
            "click img, click iframe": "toggleNowPlaying"
        },  

        initialize: function() {
            this.model.set({ 
                view: this
            });  
        },  

        render: function() {
            var _this = this;
            this.setInactive(function() { 
                _this.replaceItemHtml();
            });
            return this;
        },  

        getStyles: function(state) {
            var styles = { 
                active: { opacity: 1 },
                inactive: { opacity: 0 } 
            };
            return styles[state];
        },  

        replaceItemHtml: function() {
            if ( !this.model.get("nowPlaying") ) this.model.setNowPlaying(this.model.get("items").at(0).id, false);

            var nowPlayingIndex = this.model.get("nowPlaying"),
                nowPlayingModel = this.model.get("items").get(nowPlayingIndex),
                template = _.template($("#player_" + nowPlayingModel.attributes.mediaSrc + "_template").html(), 
                    nowPlayingModel.attributes);

            this.$el.html(template);
            this.setActive(function() {
                nowPlayingModel.get("view").createStream();
            });
        }, 

        setState: function(state, callback) {
            this.$el.animate(this.getStyles(state), "fast", callback);
        },

        setActive: function(callback) {
            this.setState("active", callback);
        },

        setInactive: function(callback) {
            this.setState("inactive", callback);
        },

        animateItems: function() {
            var itemModel = this.model.get("items").getNowPlayingModel(),
                itemView = itemModel.get("view"),
                $item = itemView.$el,
                itemLeftOffset = ( -1 * $item.position().left ) + ( $(".items-view").width() * 0.5 ) -
                    ( $(".item").width() * 0.5 );
            if ( itemLeftOffset > 0 ) itemLeftOffset = 0;

            $item.addClass("active_item");

            var playerViewObj = this;
            $(".items").animate({ "margin-left": itemLeftOffset }, "fast",
                function() {
                    $(".items-view").trigger("scroll-update");
                }
            );
            $("body").animate({ scrollTop: 0 }, "fast");
        },

        toggleNowPlaying: function() {
            this.model.get("items").getNowPlayingModel().get("view").toggle();
        },

        toggleNext: function() {
            this.model.get("items").getNextModel().get("view").activate();
        },

        togglePrev: function() {
            itemsCollection.getPrevModel().get("view").activate();
        }
    });

    return PlayerView;
});
