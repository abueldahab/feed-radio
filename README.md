# feed-radio

_**Note**: This largely incomplete project was built for my own consumption.  While it strives for best-practices-level code and UI, it remains humbly far from authoritative in those respects.  There is also clearly room for design improvement._

**feed-radio** is a single-page interface for streaming aggregated audio and video content found in RSS feeds.  See a demo <a href="http://6feetofsnow.com" target="_blank">here</a> that uses RSS feeds from a handful of music blogs.

## How it works
* A config file contains database credentials and a list of RSS feed URLs.
* PHP code goes through the feed URLs, doing the following for each:
  * Get the content of recent posts.
  * Parse post content for links to and embed codes for audio/video media (currently supports YouTube and SoundCloud).
  * Query the API of the media source (e.g. YouTube) for data fields, such as media title, thumbnail, etc.
  * Store the media data in the database.
* On page load, media items are printed to the page with their fields in data attributes.  They are then loaded into Backbone models and views that handle their playback behavior.

## Tools used
* <a href="http://requirejs.org/" target="_blank">RequireJS</a>
* <a href="http://documentcloud.github.com/backbone/" target="_blank">Backbone.js</a>
* <a href="http://jquery.com/" target="_blank">jQuery</a>
* <a href="http://twitter.github.com/bootstrap/" target="_blank">Bootstrap</a>
* <a href="https://developers.google.com/feed/" target="_blank">Google Feeds API</a>
* <a href="https://developers.google.com/youtube/" target="_blank">YouTube API</a>
* <a href="http://developers.soundcloud.com/" target="_blank">SoundCloud API</a>

## Additional notes
* Config details are read from a file called config.json, not config.example.json as is in this repo.  The example file is included to demonstrate the structure of a working config file, while keeping config data private.
* An update to the media data is automatically attempted (as a background process, see index.php) on every page load; if more than 5 minutes have passed since the last update, the update is allowed to run.
* All of the included JS files are optimized into one minified file, main-built.js, with Require.js: `node libs/require/r.js -o app.build.js`
