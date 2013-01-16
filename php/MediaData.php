<?php

class MediaData {
    
    public $config_data;

    function __construct($config_data) {
        $this->config_data = $config_data;
    }

    function connectToDB() {
        $db = $this->config_data->database;
        $this->mysqli = new mysqli($db->host, $db->username, $db->password, $db->db_name);
        if ( $this->mysqli->connect_error ) die("Connect error " . $this->db->connect_error);
    }

    function get() {
        # get items stored in db and print as json
        $this->connectToDB();
        $items_query = "SELECT data_value FROM data_cache WHERE data_name = 'items'";
        if ( $this->mysqli->multi_query($items_query) && $result = $this->mysqli->store_result() ) {
            while ( $row = $result->fetch_object() ) $items = $row->data_value;
            $result->free();
            $items = unserialize($items);
        }
        $this->mysqli->close();
        return $items;
    }
}
