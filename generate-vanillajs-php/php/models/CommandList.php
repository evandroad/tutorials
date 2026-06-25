<?php

include 'Content.php';

class CommandList {
    
    private $commands = [];

    public function loadFromFile($filename) {
        $jsonContent = file_get_contents($filename);
        $data = json_decode($jsonContent, true);

        if ($data == null) {
            return;
        }
        
        foreach ($data as $item) {
            $command = new Command($item['title'], $item['number']);
            
            foreach ($item['content'] as $contentItem) {
                $content = new Content($contentItem['id'], $contentItem['content'], $contentItem['code']);
                $command->addContent($content);
            }
            
            $this->addCommand($command);
        }
    }

    public function addCommand(Command $command) {
        $existingCommandIndex = $this->findCommandIndexByTitle($command->getTitle());
        
        if ($existingCommandIndex !== false) {
            array_push($this->commands[$existingCommandIndex]['content'], $command->getContent());
            return;
        }

        $this->commands[] = $command->toArray();
    }

    public function updateCommand($number, $title, $oldTitle, Content $content) {
        $existingCommandIndex = $this->findCommandIndexByTitle($oldTitle);

        if ($number != $this->commands[$existingCommandIndex]['number']) {
            $this->commands[$existingCommandIndex]['number'] = intval($number);
        }

        if ($title != $oldTitle) {
            $this->commands[$existingCommandIndex]['title'] = $title;
        }

        for ($i = 0; $i < count($this->commands[$existingCommandIndex]['content']); $i++) {
            if ($this->commands[$existingCommandIndex]['content'][$i]['id'] == $content->getId()) {
                $this->commands[$existingCommandIndex]['content'][$i] = $content->toArray();
                break;
            }
        }
    }

    public function deleteCommand($title, $id) {
        $existingCommandIndex = $this->findCommandIndexByTitle($title);
        
        for ($i = 0; $i < count($this->commands[$existingCommandIndex]['content']); $i++) {
            if ($this->commands[$existingCommandIndex]['content'][$i]['id'] == $id) {
                unset($this->commands[$existingCommandIndex]['content'][$i]);
                $this->commands[$existingCommandIndex]['content'] = array_values($this->commands[$existingCommandIndex]['content']);
            }

            if (count($this->commands[$existingCommandIndex]['content']) == 0) {
                unset($this->commands[$existingCommandIndex]);
                $this->commands = array_values($this->commands);
                break;
            }
        }
    }

    private function findCommandIndexByTitle($title) {
        foreach ($this->commands as $index => $command) {
            if ($command['title'] === $title) {
                return $index;
            }
        }
    
        return false;
    }

    public function toJson() {
        function compareByNumber($a, $b) {
            return $a['number'] - $b['number'];
        }
        
        usort($this->commands, 'compareByNumber');

        return json_encode($this->commands, JSON_PRETTY_PRINT);
    }

}