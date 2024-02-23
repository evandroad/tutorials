<?php

class Router {

    private $routes = [];

    public function get($path, $callback) {
        $this->routes[] = ['GET', $path, $callback];
    }

    public function post($path, $callback) {
        $this->routes[] = ['POST', $path, $callback];
    }

    public function put($path, $callback) {
        $this->routes[] = ['PUT', $path, $callback];
    }

    public function delete($path, $callback) {
        $this->routes[] = ['DELETE', $path, $callback];
    }

    public function run() {
        $path = str_replace('/generate-json/php/index.php', '', $_SERVER['REQUEST_URI']) ?? '/';
        $method = $_SERVER['REQUEST_METHOD'];
        
        foreach ($this->routes as $route) {
            list($routeMethod, $routePath, $callback) = $route;
            
            if ($routeMethod !== $method) continue;
            
            $pathParts = explode('/', $path);
            $routeParts = explode('/', $routePath);
            
            if ($pathParts[1] !== $routeParts[1]) {
                continue;
            }

            
            if (count($pathParts) !== count($routeParts) && $routeParts[count($routeParts) - 1][-2] !== '?') {
                continue;
            }
            
            $params = [];
            $match = true;
            for ($i = 1; $i < count($routeParts); $i++) {
                if ($routeParts[$i][0] === '{' && $routeParts[$i][strlen($routeParts[$i]) - 1] === '}') {
                    $paramName = substr($routeParts[$i], 1, -1);
                    if (isset($pathParts[$i])) {
                        if ($paramName[-1] == '?') $paramName = substr($routeParts[$i], 1, -2);
                        $params[$paramName] = urldecode($pathParts[$i]);
                    } elseif ($paramName[-1] !== '?') {
                        $match = false;
                        break;
                    }
                } else if ($pathParts[$i] !== $routeParts[$i]) {
                    $match = false;
                    break;
                }
            }
            
            if ($match) {
                $this->dispatcher($callback, $params);
                return;
            }
        }
        
        http_response_code(404);
        echo json_encode(['message' => 'Not Found']);
    }
    
    private function dispatcher($callback, $params) {
        $callbackParts = explode('@', $callback);
        $controllerClass = $callbackParts[0];
        $controllerMethod = $callbackParts[1];
        include 'controllers/' . $controllerClass . '.php';
        $controller = new $controllerClass();
        $controller->$controllerMethod($params);
    }

}