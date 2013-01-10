<?php 
include "data/MediaData.php";
$media_data = new MediaData();
$google_analytics_account_key = $mediaData->config->account_keys->google_analytics;
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="data"></script>
    <script data-main="js/main<?php echo !isset($_GET["js_debug"]) ? "-built" : "" ?>" src="js/libs/require/require.js"></script>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Goudy+Bookletter+1911' rel='stylesheet' type='text/css'>
</head>
<body> 
    <div id="container" class="container-fluid clearfix">
        <div class="hero-unit clearfix">
            <div class="browse track-browse track-prev">&laquo;</div>
            
            <!-- media player templates by type -->
            <script type="text/template" id="player_youtube_template">
                <p>
                    <a href="<%= link %>" target="_blank">#</a>
                    <%-title %>
                </p>
                <div class="youtube-wrap">
                    <div id="<%= id %>-player" />
                </div>
            </script>
            <script type="text/template" id="player_soundcloud_template">
                <p>
                    <a href="<%= link %>" target="_blank">#</a>
                    <%-title %>
                </p>
                <img src="<%= thumbnail %>" />
            </script>
            <div id="player"></div>
            
            <div class="browse track-browse track-next">&raquo;</div>
        </div>
        <div class="items-view">

            <!-- item template -->
            <script type="text/template" id="item_template">
                <p>
                    <a href="<%= link %>" target="_blank">#</a>
                    <%- title %>    
                </p>
                <img src="img/twinkle_twinkle.png" data-original="<%= thumbnail %>" />
            </script>
            <ul class="items row"></ul>

            <div class="browse items-browse items-prev">&lsaquo;</div>
            <div class="browse items-browse items-next">&rsaquo;</div>
        </div>
    </div>
<?php if ( $google_analytics_account_key ): ?>
    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', '<?php echo $google_analytics_account_key ?>']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
    </script>
<?php endif ?>
</body>
</html>
<?php exec("php data/index.php action=update &> /dev/null &") ?>
