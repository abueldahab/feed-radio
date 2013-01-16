<?php

class MediaDataUpdater {
    /*  passed a MediaData object,
        this gets latest data and stores it */
    
    function __construct($config_data) {
        $this->config_data = $config_data;
    }

    function connectToDB() {
        $db = $this->config_data->database;
        $this->mysqli = new mysqli($db->host, $db->username, $db->password, $db->db_name);
        if ( $this->mysqli->connect_error ) die("Connect error " . $this->db->connect_error);
    }  

    function update() {
        # get latest items from feeds, update db
        $this->connectToDB();

        # if update has happened recently, don't update again
        if ( !$this->updateNecessary() ) return;

        foreach ( $this->config_data->feeds as $feed ) {
            $feedURL = $feed->xmlUrl;

            # google feed API
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=20&q=" . $feedURL);
            curl_setopt($ch, CURLOPT_REFERER, $this->config_data->site_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $response = curl_exec($ch);
            curl_close($ch);

            $response = json_decode($response);
            foreach ( $response->responseData->feed->entries as $item ) $this->getMediaMatches($item);
        }

        # batch-query youtube API for videos' data 
        # ( soundcloud does this on a per-track basis )
        $this->storeYoutubeAPIData();

        function dateSort($a, $b){
            $a = $a["published"];
            $b = $b["published"];
            return $a >= $b ? -1 : 1;
        }
        uasort($this->items, "dateSort");

        if ( !$this->mysqli->ping() ) $this->connectToDB();

        $items = $this->mysqli->real_escape_string(serialize($this->items));
        $update_query = "UPDATE data_cache SET data_value = '$items', timestamp='" . date('Y-m-d H:i:s') . "'  WHERE data_name = 'items'";
        $update_result = $this->mysqli->query($update_query);

        if ( !$update_result ) print_r($this->mysqli->error);

        $this->mysqli->close();
    }

    function updateNecessary() {
        # do update if previous update happened > 5 minute ago
        $timestamp_query = "SELECT TIMEDIFF('00:05:00', TIMEDIFF(NOW(), timestamp)) < 0 FROM data_cache WHERE data_name = 'items'";
        $result = $this->mysqli->query($timestamp_query);
        return array_shift($result->fetch_row());
    }

    function getMediaMatches($item) {
        $youtube_regex = "/youtube\.com\/[^user][embed\/]*[v\/]*[watch\?v=]*([^\"\?\&]+)/";
        $soundcloud_regex = "/soundcloud\.com\/([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\-]+[\/^download[a-zA-Z0-9\-]]*)/";
        #$vimeo_regex = "/player\.vimeo\.com\/video\/([0-9]+)/";

        # check for youtube matches in post content
        preg_match_all($youtube_regex, $item->content, $youtube_matches);
        if ( count($youtube_matches[1]) != 0 ) $this->handleYoutubeMatches($item, $youtube_matches);

        # check for soundcloud matches in post content
        preg_match_all($soundcloud_regex, $item->content, $soundcloud_matches);
        if ( count($soundcloud_matches[1]) != 0 ) $this->handleSoundcloudMatches($item, $soundcloud_matches);

        # check 
        if ( $item->enclosure ) {
            foreach ( $item->enclosure as $encl ) {
                if ( $encl->type == "audio/mpeg" && preg_match_all($soundcloud_regex, $encl->href, $soundcloud_matches) &&
                    count($soundcloud_matches[1]) != 0 )
                {
                    $this->handleSoundcloudMatches($item, $soundcloud_matches);
                }
            }
        }
    }

    function handleYoutubeMatches($item, $matches) {
        foreach ( $matches[1] as $youtube_url ) {
            # don't store if we already have this
            if ( isset($this->items[$youtube_url]) ) break;
            
            $this->items[$youtube_url] = array(
                "link" => $item->link,
                "published" => strtotime($item->publishedDate),
                "media_src" => "youtube"
            );
            
            # prepare batch query for YT API
            $youtube_batch_index = floor(count($this->items) % 50);
            $this->youtube_entries[$youtube_batch_index] .= "<entry><id>http://gdata.youtube.com/feeds/api/videos/$youtube_url</id></entry>";

            # break here so we only pull one video per post 
            break;
        }
    }

    function handleSoundcloudMatches($item, $matches) {
        foreach ( $matches[1] as $i => $soundcloud_url ) {
            # don't store if we already have this
            if ( isset($this->items[$soundcloud_url]) || !isset($matches[2]) || $matches[2][$i] == "sets" ) break;
            
            $track = isset($matches[2][$i]) ? $matches[2][$i] : null;
            $this->items[$soundcloud_url] = array(
                "link" => $item->link,
                "published" => strtotime($item->publishedDate),
                "track" => $track,
                "media_src" => "soundcloud"
            );
            $this->storeSoundcloudAPIData($soundcloud_url, $track);
        }
    }

    function storeYoutubeAPIData() {
        # query YT API for each batch of 50 matches
        foreach ( $this->youtube_entries as $batch_entries ) {
            $youtube_batch_data = '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:batch="http://schemas.google.com/gdata/batch" ' .
                'xmlns:yt="http://gdata.youtube.com/schemas/2007"><batch:operation type="query" />' . $batch_entries . '</feed>';
            $youtube_curl_options = array(
                CURLOPT_URL => "http://gdata.youtube.com/feeds/api/videos/batch",
                CURLOPT_HTTPHEADER => array(
                    "X-GData-Key: key=" . $this->config_data->account_keys->youtube_api,
                    "Content-Type: text/xml"
                ),
                CURLOPT_HEADER => 0,
                CURLOPT_POST => 1,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_POSTFIELDS => $youtube_batch_data
            );
            $ch = curl_init();
            curl_setopt_array($ch, $youtube_curl_options);
            $response_xml = curl_exec($ch);
            curl_close($ch);

            # parse xml for fields
            $batch_doc = new DOMDocument();
            $batch_doc->loadXML($response_xml);
            foreach ( $batch_doc->getElementsByTagNameNS("http://www.w3.org/2005/Atom", "entry") as $entry ) {
                $id_node = $entry->getElementsByTagNameNS("http://www.w3.org/2005/Atom", "id");
                $id = array_pop(explode("/", $id_node->item(0)->nodeValue));
                $title_node = $entry->getElementsByTagNameNS("http://www.w3.org/2005/Atom", "title");
                $title = $title_node->item(0)->nodeValue;
                
                # attempt to filter out errors and talky/promo things
                if ( !$title || $title == "" || $title == "Error" || preg_match('/interview|episode|nardwuar|vlog|talks/i', $title) ) {
                    unset($this->items[$id]);
                    continue;
                }

                # finally, store this video's data
                $thumbnail_node = $entry->getElementsByTagNameNS("http://search.yahoo.com/mrss/", "thumbnail")->item(0);
                if ( $thumbnail_node->attributes->length ) {
                    $thumbnail = $thumbnail_node->attributes->item(0)->nodeValue;
                    if ( $thumbnail ) {
                        $this->items[$id]["thumbnail"] = $thumbnail;
                        $this->items[$id]["title"] = $title;
                    } else {
                        unset($this->items[$id]);
                    }
                } else {
                    unset($this->items[$id]);
                }
            }
        }
    }

    function storeSoundcloudAPIData($id, $track) {
        # query by track url to get fields
        $soundcloud_query = array(
            "url" => "http://soundcloud.com/" . urlencode($id) . "/" . urlencode($track),
            "client_id" => $this->config_data->account_keys->soundcloud_api
        );
        foreach ( $soundcloud_query as $key => $val ) $soundcloud_query_string .= "$key=$val&";
        $soundcloud_curl_options = array(
            CURLOPT_URL => "http://api.soundcloud.com/resolve.json?" . $soundcloud_query_string,
            CURLOPT_POST => 0,
            CURLOPT_HEADER => 0,
            CURLOPT_RETURNTRANSFER => 1,
            CURLINFO_HEADER_OUT => 1
        );

        # curl boilerplate
        $ch = curl_init();
        curl_setopt_array($ch, $soundcloud_curl_options);
        $response_json = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($response_json);
        if ( strpos($response->status, "302") != 0 ) continue;

        $ch = curl_init();
        curl_setopt_array($ch, $soundcloud_curl_options);
        curl_setopt($ch, CURLOPT_URL, $response->location);
        $response_json = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($response_json);
    
        if ( count($response) > 1 ) $response = $response[0];
        #echo json_encode($response);

        if ( !isset($response->stream_url) || !isset($response->artwork_url) || !isset($response->user->username) || !isset($response->title) ) {
            unset($this->items[$id]);
            return;
        }

        # store fields
        $this->items[$id]["title"] = $response->user->username . ": " . $response->title;
        $this->items[$id]["thumbnail"] = str_replace("large", "crop", $response->artwork_url);
        $this->items[$id]["soundcloud_stream"] = $response->stream_url;
    }
}

include "ConfigData.php";
$config_data = new ConfigData();

$updater = new MediaDataUpdater($config_data);
$updater->update();
