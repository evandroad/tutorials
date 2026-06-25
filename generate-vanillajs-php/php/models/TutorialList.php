<?php

class TutorialList {
    
    private $tutorials = [];

    public function loadFromFile($filename) {
        $jsonContent = file_get_contents($filename);
        $data = json_decode($jsonContent, true);
        
        if ($data == null) {
            return;
        }
        
        foreach ($data as $item) {
            $tutorial = new Tutorial($item['number'], $item['title'], $item['image']);
            $this->addTutorial($tutorial);
        }
    }

    public function addTutorial(Tutorial $tutorial) {
        $this->tutorials[] = $tutorial->toArray();
    }

    public function updateTutorial($currentTitle, Tutorial $tutorial) {
        $existingTutorialIndex = $this->findTutorialIndexByTitle($currentTitle);

        if ($tutorial->getNumber() != $this->tutorials[$existingTutorialIndex]['number']) {
            $this->tutorials[$existingTutorialIndex]['number'] = $tutorial->getNumber();
        }
        
        if ($tutorial->getTitle() != $this->tutorials[$existingTutorialIndex]['title']) {
            $this->tutorials[$existingTutorialIndex]['title'] = $tutorial->getTitle();
        }
        
        if ($tutorial->getImage() != $this->tutorials[$existingTutorialIndex]['image']) {
            $this->tutorials[$existingTutorialIndex]['image'] = $tutorial->getImage();
        }
    }

    public function deleteTutorial($title) {
        $existingTutorialIndex = $this->findTutorialIndexByTitle($title);

        if ($existingTutorialIndex === false) {
            return;
        }
        
        unlink('../../tutorials/img/'.$this->tutorials[$existingTutorialIndex]['image']);
        unset($this->tutorials[$existingTutorialIndex]);
        $this->tutorials = array_values($this->tutorials);
    }

    private function findTutorialIndexByTitle($title) {
        foreach ($this->tutorials as $index => $tutorial) {
            if ($tutorial['title'] === $title) {
                return $index;
            }
        }
    
        return false;
    }

    public function toJson() {
        function compareByNumber($a, $b) {
            return $a['number'] - $b['number'];
        }
        
        usort($this->tutorials, 'compareByNumber');

        return json_encode($this->tutorials, JSON_PRETTY_PRINT);
    }

}