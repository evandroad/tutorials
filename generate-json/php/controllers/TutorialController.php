<?php

include 'util.php';
include 'models/Tutorial.php';
include 'models/TutorialList.php';

class TutorialController {

  function getAll() {
    $path = '../../tutorials/data/tutorials.json';

    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile($path);

    echo $tutorialList->toJson();
  }

  function insert() {
    $req = getBody();
    
    $number = $req['number'];
    $title = $req['tutorial'];
    $image = $req['image'];

    if ($this->createMoveFoldersFiles($title, $image)) {
      return;
    }

    $path = '../../tutorials/data/tutorials.json';

    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile($path);

    $tutorial = new Tutorial(intval($number), $title, $image['name']);
    $tutorialList->addTutorial($tutorial);

    file_put_contents($path, $tutorialList->toJson());
    
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

    $path = '../../tutorials/data/tutorials.json';

    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile($path);

    $tutorial = new Tutorial(intval($number), $title, $image['name'] ?? '');
    $tutorialList->updateTutorial($currentTitle, $tutorial);
    
    file_put_contents($path, $tutorialList->toJson());

    echo json_encode(["message" => "Updated tutorial."]);
  }

  function delete($params) {
    $tutorial = $params["name"];

    unlink("../../tutorials/data/".$tutorial.".json");
    
    $path = "../../tutorials/data/tutorials.json";

    $tutorialList = new TutorialList();
    $tutorialList->loadFromFile($path);

    $tutorialList->deleteTutorial($tutorial);
    
    file_put_contents($path, $tutorialList->toJson());

    echo json_encode(["message" => "Tutorial deletado."]);
  }

  function createMoveFoldersFiles($title, $image) {
    $dirData = "../../tutorials/data";
    $dirImg = "../../tutorials/img";

    $pathTutorial = $dirData.'/'.$title.'.json';
    $pathImage = $dirImg.'/'.$image['name'];
    $pathTutorials = $dirData.'/tutorials.json';

    if (!file_exists($dirData)) {
      mkdir($dirData, 777, true);
      file_put_contents($pathTutorials, '[]');
    }
    
    if (!file_exists($dirImg)) mkdir($dirImg, 777, true);
            
    if (file_exists($pathTutorial)) {
      echo json_encode(["message" => "Tutorial already exists."]);
      return true;
    }

    file_put_contents($pathTutorial, '[]');
    move_uploaded_file($image['tmp_name'], $pathImage);
    return false;
  }

  function updateMoveFiles($currentImage, $image, $currentTitle, $title) {
    $dirImg = "../../tutorials/img/";
    $dirData = "../../tutorials/data/";
    $currentFile = $dirData.$currentTitle.".json";
    $file = $dirData.$title.".json";

    rename($currentFile, $file);

    if (empty($image)) {
      return;
    }
    
    $pathImage = $dirImg.$image['name'];
    $pathCurrentImage = $dirImg.$currentImage;

    if (is_file($pathCurrentImage)) {
      unlink($pathCurrentImage);
    }
    
    move_uploaded_file($image['tmp_name'], $pathImage);
  }
    
}