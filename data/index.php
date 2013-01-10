<?php

include "../php/ConfigData.php";
include "../php/MediaData.php";

$config_data = new ConfigData();
$action = isset($_GET["action"]) ? $_GET["action"] : "get";
$media_data = new MediaData($config_data, $action);
