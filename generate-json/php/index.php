<?php

header("Access-Control-Allow-Origin: http://generate-json");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS, DELETE");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Origin, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization');
    exit(0);
}

include 'router.php';

$router = new Router();

$router->get('/tutorial', 'TutorialController@getAll');
$router->post('/tutorial', 'TutorialController@insert');
$router->post('/tutorial/update', 'TutorialController@update');
$router->delete('/tutorial/{name}', 'TutorialController@delete');

$router->get('/content/{tutorial}', 'ContentController@getAll');
$router->post('/content', 'ContentController@insert');
$router->put('/content', 'ContentController@update');
$router->delete('/content/{id}/{tutorial}/{title}', 'ContentController@delete');

$router->run();