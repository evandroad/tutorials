<?php

function getBody() {
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    
    if (strpos($contentType, '/json') !== false) {
        return json_decode(file_get_contents('php://input'), true);
    }
    
    if (strpos($contentType, '/x-www-form-urlencoded') !== false) {
        parse_str(file_get_contents('php://input'), $data);
        return $data;
    }

    if (strpos($contentType, 'multipart/form-data') !== false) {
        $number = $_REQUEST['number'] ?? 0;
        $currentTutorial = $_REQUEST['currentTutorial'] ?? '';
        $tutorial = $_REQUEST['tutorial'] ?? '';
        $currentImage = $_REQUEST['currentImage'] ?? '';
        $image = $_FILES['image'] ?? [];
        
        return [
            'image' => $image,
            'number' => $number,
            'tutorial' => $tutorial,
            'currentTutorial' => $currentTutorial,
            'currentImage' => $currentImage
        ];
    }

    return [];
}