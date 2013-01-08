define([
    "jquery", 
    "underscore", 
    "backbone"
], function($, _, Backbone) {
    var ItemView = Backbone.View.extend({
        tagName: "li",
        className: "item span3",

        events: {
            click: "toggle"
        },  

        initialize: function(attrs) {
            this.player = attrs.player;

            this.render(attrs);
            $(".items").append(this.$el);

            this.$el.find("img").lazyload({
                container: $(".items-view"),
                event: "scroll-update",
                effect: "fadeIn",
                threshold: $(window).width()
            });
        },  

        render: function(attrs) {
            var template = _.template($("#item_template").html(), attrs);
            this.$el.html(template);
            return this;                                                                                            
        },

        toggle: function() {
            if ( this.player.get("nowPlaying") == this.id ) {
                this.pause();                                                                                                    
            } else {                                                                                                            
                this.activate();                                                                                                 
            }                                                                                                                   
        },                                                                                                                      
                                                                                                                                
        togglePlayClass: function(isPlaying) {                                                                                  
            if ( isPlaying ) {                                                                                                  
                $(".playing").removeClass("playing");
            } else {                                                                                                            
                this.$el.addClass("playing");                                                                           
            }                                                                                                                   
        },

        activate: function() {
            $(".active_item").removeClass("active_item");
            $(".playing").removeClass("playing");
            this.$el.addClass("playing");

            if ( window.SM ) window.SM.stop();
            this.player.setNowPlaying(this.id);
        }   
    });

    return ItemView;
});
