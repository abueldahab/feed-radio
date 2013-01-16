require.config({
    paths: {
        jquery: "libs/jquery/jquery-1.8.3.min",
        underscore: "libs/underscore/underscore-min",
        backbone: "libs/backbone/backbone-min",
        soundcloud: "http://connect.soundcloud.com/sdk",
        youtube: "http://www.youtube.com/iframe_api?",
        lazyload: "libs/jquery/jquery.lazyload.min"
    },  
    shim: {
        underscore: { exports: "_" },  
        backbone: { deps: ["jquery", "underscore"], exports: "Backbone" },  
        lazyload: { deps: ["jquery"], exports: "Lazyload" }   
    }
});

require([
    "jquery", 
    "underscore", 
    "backbone", 
    "soundcloud", 
    "youtube", 
    "lazyload",
    "models/player",
    "models/item",
    "views/player",
    "views/browse",
    "views/trackBrowse",
    "views/itemsBrowse",
    "views/item",
    "views/soundcloud",
    "views/youtube",
    "collections/items"
], function($, _, Backbone, Soundcloud, Youtube, Lazyload, PlayerModel, ItemModel, PlayerView, BrowseView, TrackBrowseView, ItemsBrowseView, ItemView, SoundcloudView, YoutubeView, ItemsCollection) {

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
                id: itemData.mediaId, 
                title: itemData.title,
                link: itemData.link,
                thumbnail: itemData.thumbnail,
                mediaSrc: itemData.mediaSrc,
                player: player
            };
        if ( itemData.soundcloudStream ) attrs.soundcloud_stream = itemData.soundcloudStream;
        var itemModel = new ItemModel(attrs),
            itemView;

        attrs.model = itemModel;

        // use appropriate view based on media_src
        switch ( itemData.mediaSrc ) {
            case "youtube":
                itemView = new YoutubeView(attrs);
                break;
            case "soundcloud":
                itemView = new SoundcloudView(attrs);
                break;
        }

        itemModel.set({ view: itemView });
        allItems.push(itemModel);
    });

    // item collection, browse button views
    var itemsCollection = new ItemsCollection(allItems, { player: player }),
        trackPrev = new TrackBrowseView({ el: $(".track-prev"), prev: true, items: itemsCollection }),
        trackNext = new TrackBrowseView({ el: $(".track-next"), prev: false, items: itemsCollection }),
        itemsPrev = new ItemsBrowseView({ el: $(".items-prev"), prev: true, items: itemsCollection }),
        itemsNext = new ItemsBrowseView({ el: $(".items-next"), prev: false, items: itemsCollection });
});
