<?php

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://superapp.atwebpages.com");
header("Access-Control-Allow-Origin: http://superapp.atwebpages.com");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Origin, Authorization");
header("Content-Type: application/json");

$data = ["status" => "success", "mesage" => "done"];

echo json_encode($data);