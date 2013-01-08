<?php

include "MediaData.php";

$action = isset($_GET["action"]) ? $_GET["action"] : "get";

$mediaData = new MediaData($action);
