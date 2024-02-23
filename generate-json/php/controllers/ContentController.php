<?php

include 'util.php';
include 'models/Command.php';
include 'models/CommandList.php';

class ContentController {

    function getAll($param) {
        $tutorial = $param['tutorial'];
        
        $path = "../../tutorials/data/".$tutorial.'.json';

        $commandList = new CommandList();
        $commandList->loadFromFile($path);

        echo $commandList->toJson();
    }


    function insert() {
        $req = getBody();
        
        $tutorial = $req['tutorial'];
        $number = $req['number'] ?? 0;
        $title = $req['title'];
        $content = $req['content'];
        $code = $req['code'] ?? '';
        $currentTime = date('dmYhis', time());
        $id = md5($title.$content.$code.$currentTime);

        $path = '../../tutorials/data/'.$tutorial.'.json';

        $commandList = new CommandList();
        $commandList->loadFromFile($path);

        $commandContent = new Content($id, $content, $code);
        $command = new Command($title, $number);
        $command->addContent($commandContent);
        $commandList->addCommand($command);

        file_put_contents($path, $commandList->toJson());

        echo json_encode(["message" => "Conteúdo cadastrado."]);
    }

    function update() {
        $req = getBody();

        $tutorial = $req["tutorial"];
        $number = $req['number'];
        $title = $req['title'];
        $id = $req["id"];
        $content = $req['content'] ?? '';
        $code = $req['code'] ?? '';
        $oldTitle = $req['oldTitle'];

        $path = "../../tutorials/data/".$tutorial.".json";
        
        $commandList = new CommandList();
        $commandList->loadFromFile($path);

        $commandContent = new Content($id, $content, $code);
        $commandList->updateCommand($number, $title, $oldTitle, $commandContent);
        
        file_put_contents($path, $commandList->toJson());

        echo json_encode(["message" => "Conteúdo alterado."]);
    }

    function delete($params) {
        $tutorial = $params["tutorial"];
        $title = $params["title"];
        $id = $params["id"];

        $path = "../../tutorials/data/".$tutorial.".json";
        
        $commandList = new CommandList();
        $commandList->loadFromFile($path);

        $commandList->deleteCommand($title, $id);
        
        file_put_contents($path, $commandList->toJson());

        echo json_encode(["message" => "Conteúdo deletado."]);
    }

}