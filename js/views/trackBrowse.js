define([
    "underscore",
    "backbone",
    "views/browse"
], function(_, Backbone, BrowseView) { 
    var TrackBrowseView = BrowseView.extend({
        browse: function() {
            var browsePrev = this.options.prev,
                items = this.options.items,
                itemIndex = items.getNowPlayingIndex();
                    
            if ( ( itemIndex === 0 && browsePrev ) ||
                ( itemIndex == items.length && !browsePrev ) ) { 
                return;
            }   

            var nextItemIndex = itemIndex + ( browsePrev ? -1 : 1 );
            items.at(nextItemIndex).get("view").activate();
        }   
    });

    return TrackBrowseView;
});
