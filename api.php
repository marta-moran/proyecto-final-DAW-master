<?php

$controller = $_GET['controller'];
$action = $_GET['action'];
$body = file_get_contents('php://input');

$controllerClassName = ucfirst($controller);
$controllerFile = 'src/Controller/' . $controllerClassName . '.php';

if (file_exists($controllerFile)) {
    include $controllerFile;
}

$controller = new $controllerClassName();

$response = $controller->$action($body, $_GET);

header('Content-Type: application/json; charset=utf-8');
http_response_code($response['status']);

echo $response['data'];

?>