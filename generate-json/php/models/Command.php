<?php

class Command {

    private $number;
    private $title;
    private $content = [];

    public function __construct($title, $number) {
        $this->title = $title;
        $this->number = $number;
    }

    public function getTitle() {
        return $this->title;
    }

    public function addContent(Content $content) {
        $this->content[] = $content->toArray();
    }

    public function toArray() {
        return [
            "number" => $this->number,
            "title" => $this->title,
            "content" => $this->content
        ];
    }

    public function getContent() {
        return $this->content[0];
    }
    
}