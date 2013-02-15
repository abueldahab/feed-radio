<?php 
include "php/ConfigData.php";
$config_data = new ConfigData();

include "php/MediaData.php";
$media_data = new MediaData($config_data);
$items = $media_data->get();
$first_id = array_shift(array_keys($items));
$first_item = (object) array_shift(array_values($items));

?>

<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Goudy+Bookletter+1911' rel='stylesheet' type='text/css'>
    <script data-main="js/main<?php echo !isset($_GET["js_debug"]) ? "-built" : "" ?>" src="js/libs/require/require.js"></script>
</head>

<body> 
    <div id="container" class="container-fluid clearfix">

        <div id="title-bar">
            <div class="browse track-browse track-prev"><i class="icon-angle-left"></i></div>

            <!-- TITLE BAR TEMPLATE -->
            <script type="text/template" id="title-wrap-template">
                <a id="title-link" href="<%= link %>"><i class="icon-external-link"></i></a>
                <span id="title"><%= title %></span>
            </script>
            <p id="title-wrap"></p>

            <div class="browse track-browse track-next"><i class="icon-angle-right"></i></div>
        </div>

        <!-- MEDIA -->
        <div id="player">
            <!-- MEDIA PLAYER TEMPLATES BY SOURCE -->
            <script type="text/template" id="youtube-player-template">
                <div class="youtube-wrap">
                    <div id="<%= id %>-player" />
                </div>
            </script>
            <script type="text/template" id="soundcloud-player-template">
                <div class="soundcloud-wrap">
                    <div class="soundcloud-center">
                        <img src="<%= thumbnail %>" />
                    </div>
                </div>
            </script>

            <div id="media-wrap"></div>
        </div>


        <!-- ITEMS ROW -->
        <div class="items-view">
            <ul class="items">

            <?php foreach ( $items as $id => $item ): ?>
                <?php $item = (object) $item; ?>
                <li class="item" id="<?php echo $id ?>" data-link="<?php echo $item->link ?>" data-title="<?php echo $item->title ?>" data-thumbnail="<?php echo $item->thumbnail ?>" data-media-src="<?php echo $item->media_src ?>" <?php echo $item->soundcloud_stream ? 'data-soundcloud-stream="' . $item->soundcloud_stream . '"' : '' ?>>
                    <div class="list-data">
                        <i class="media-button icon-play"></i> 
                        <?php echo html_entity_decode($item->title) ?>
                        <a href="<?php echo $item->link ?>" target="_blank"><i class="icon-external-link"></i></a>
                    </div>
                </li>
            <?php endforeach ?>

            </ul>
        </div>
    </div>

<?php $google_analytics_account_key = $config_data->account_keys->google_analytics; ?>
<?php if ( $google_analytics_account_key ): ?>
    <script type="text/javascript">
        var _gaq = _gaq || [];
        var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
        _gaq.push(['_require', 'inpage_linkid', pluginUrl]);
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
<?php # attempt to update data ?>
<?php exec("php php/MediaDataUpdater.php > /dev/null &"); ?>
