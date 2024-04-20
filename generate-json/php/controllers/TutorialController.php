<?php

include 'util.php';
include 'models/Tutorial.php';
include 'models/TutorialList.php';

class TutorialController {

  const ROOT_DIR = '../../public/';
  const PATH_TUTORIALS = self::ROOT_DIR . 'data/tutorials.json';

  function getAll() {
    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile(self::PATH_TUTORIALS);

    echo $tutorialList->toJson();
  }

  function insert() {
    $req = getBody();
    
    $number = $req['number'];
    $title = $req['tutorial'];
    $image = $req['image'];
    $type = explode('/', $image['type'])[1];

    if ($this->createMoveFoldersFiles($title, $image)) {
      return;
    }

    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile(self::PATH_TUTORIALS);
    
    $tutorial = new Tutorial(intval($number), $title, $title.'.'.$type);
    $tutorialList->addTutorial($tutorial);

    file_put_contents(self::PATH_TUTORIALS, $tutorialList->toJson());
    
    echo json_encode(["message" => "Created tutorial."]);
  }

  function update() {
    $req = getBody();

    $number = $req['number'] ?? 0;
    $currentTitle = $req['currentTutorial'] ?? '';
    $title = $req['tutorial'] ?? '';
    $currentImage = $req['currentImage'] ?? '';
    $image = $req['image'] ?? '';
    
    $this->updateMoveFiles($currentImage, $image, $currentTitle, $title);
    
    if (empty($image)) {
      $imgName = $currentImage;
    } else {
      $type = explode('/', $image['type'])[1];
      $imgName = $title.'.'.$type;
    }

    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile(self::PATH_TUTORIALS);

    $tutorial = new Tutorial(intval($number), $title, $imgName);
    $tutorialList->updateTutorial($currentTitle, $tutorial);
    
    file_put_contents(self::PATH_TUTORIALS, $tutorialList->toJson());

    echo json_encode(["message" => "Updated tutorial."]);
  }

  function delete($params) {
    $tutorial = $params["name"];

    unlink(self::ROOT_DIR."data/".$tutorial.".json");

    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile(self::PATH_TUTORIALS);

    $tutorialList->deleteTutorial($tutorial);
    
    file_put_contents(self::PATH_TUTORIALS, $tutorialList->toJson());

    echo json_encode(["message" => "Tutorial deletado."]);
  }

  function createMoveFoldersFiles($title, $image) {
    $dirData = self::ROOT_DIR . "data/";
    $dirImg = self::ROOT_DIR . "img/";

    $type = explode('/', $image['type'])[1];
    $pathTutorial = $dirData.$title.'.json';
    $pathImage = $dirImg.$title.'.'.$type;

    if (!file_exists($dirData)) {
      mkdir($dirData, 777, true);
      file_put_contents(self::PATH_TUTORIALS, '[]');
    }
    
    if (!file_exists($dirImg)) {
      mkdir($dirImg, 777, true);
    }
            
    if (file_exists($pathTutorial)) {
      echo json_encode(["message" => "Tutorial already exists."]);
      return true;
    }

    file_put_contents($pathTutorial, '[]');
    move_uploaded_file($image['tmp_name'], $pathImage);
    return false;
  }

  function updateMoveFiles($currentImage, $image, $currentTitle, $title) {
    $dirData = self::ROOT_DIR . "data/";
    $dirImg = self::ROOT_DIR . "img/";
    $currentFile = $dirData.$currentTitle.".json";
    $file = $dirData.$title.".json";

    rename($currentFile, $file);

    if (empty($image)) {
      return;
    }
    
    $type = explode('/', $image['type'])[1];
    $pathImage = $dirImg.$title.'.'.$type;
    $pathCurrentImage = $dirImg.$currentImage;

    if (is_file($pathCurrentImage)) {
      unlink($pathCurrentImage);
    }
    
    move_uploaded_file($image['tmp_name'], $pathImage);
  }
    
}