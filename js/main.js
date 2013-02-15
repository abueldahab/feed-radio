require.config({
    paths: {
        jquery: "libs/jquery/jquery-1.8.3.min",
        underscore: "libs/underscore/underscore-min",
        backbone: "libs/backbone/backbone-min",
        soundcloud: "http://connect.soundcloud.com/sdk",
        youtube: "http://www.youtube.com/iframe_api?"
    },  
    shim: {
        underscore: { exports: "_" },  
        backbone: { deps: ["jquery", "underscore"], exports: "Backbone" }
    }
});

require([
    "jquery", 
    "underscore", 
    "backbone", 
    "soundcloud", 
    "youtube", 
    "models/player",
    "models/item",
    "views/player",
    "views/titleBar",
    "views/browse",
    "views/item",
    "views/soundcloud",
    "views/youtube",
    "collections/items"
], function($, _, Backbone, Soundcloud, Youtube, PlayerModel, ItemModel, PlayerView, TitleBarView, BrowseView, ItemView, SoundcloudView, YoutubeView, ItemsCollection) {

    // player model, view
    var player = new PlayerModel();
    var playerView = new PlayerView({ 
        model: player, 
        el: $("#player") 
    });

    // item models, views from JSON object
    var allItems = [];
    _.each($(".item"), function(itemEl, id, list) {
        var itemData = $(itemEl).data(),
            attrs = { 
                el: itemEl,
                id: $(itemEl).attr("id"), 
                title: itemData.title,
                link: itemData.link,
                thumbnail: itemData.thumbnail,
                mediaSrc: itemData.mediaSrc
            };
        if ( itemData.soundcloudStream ) attrs.soundcloud_stream = itemData.soundcloudStream;
        attrs.model = new ItemModel(attrs);

        // use appropriate view based on media src
        var itemView;
        switch ( itemData.mediaSrc ) {
            case "youtube":
                itemView = new YoutubeView(attrs);
                break;
            case "soundcloud":
                itemView = new SoundcloudView(attrs);
                break;
        }

        attrs.model.set({ view: itemView });
        allItems.push(attrs.model);
    });

    // item collection, browse button views
    var itemsCollection = new ItemsCollection(allItems, { player: player }),
        trackPrev = new BrowseView({ el: $(".track-prev"), prev: true, items: itemsCollection }),
        trackNext = new BrowseView({ el: $(".track-next"), prev: false, items: itemsCollection }),
        titleBar = new TitleBarView({ el: $("#title-bar"), items: itemsCollection });

    // queue first item
    itemsCollection.at(0).attributes.view.toggle();
});
