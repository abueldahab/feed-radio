<?php 

class ConfigData {

    function __construct() {
        # normalize file path depending on cwd
        $config_file_path = ( basename(getcwd()) == "php" ? "../" : "" ) . "config.json";
        $config_json = file_get_contents($config_file_path);
        foreach ( json_decode($config_json) as $field => $object ) $this->$field = $object;
    }
}
