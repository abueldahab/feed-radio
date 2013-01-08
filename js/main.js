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

    var player = new PlayerModel();

    var playerView = new PlayerView({ 
        model: player, 
        el: $("#player") 
    });

    var allItems = [];
    _.each(itemsJson, function(item, id, list) {
        if ( !item.title || !item.thumbnail ) return;

        item.id = id;
        var itemModel = new ItemModel(item),
            attrs = { 
                model: itemModel,
                id: id, 
                title: item.title,
                link: item.link,
                thumbnail: item.thumbnail,
                player: player
            },
            itemView;

        switch ( item.media_src ) {
            case "youtube":
                itemView = new YoutubeView(attrs);
                break;
            case "soundcloud":
                attrs.soundcloud_stream = item.soundcloud_stream;
                itemView = new SoundcloudView(attrs);
                break;
        }

        itemModel.set({ view: itemView });
        allItems.push(itemModel);
    });

    var itemsCollection = new ItemsCollection(allItems, { player: player }),
        trackPrev = new TrackBrowseView({ el: $(".track-prev"), prev: true, items: itemsCollection }),
        trackNext = new TrackBrowseView({ el: $(".track-next"), prev: false, items: itemsCollection }),
        itemsPrev = new ItemsBrowseView({ el: $(".items-prev"), prev: true, items: itemsCollection }),
        itemsNext = new ItemsBrowseView({ el: $(".items-next"), prev: false, items: itemsCollection });

    player.setNowPlaying(itemsCollection.at(0).get("id"));
});
