<?php

class Tutorial {

    private $number;
    private $title;
    private $image;

    public function __construct($number, $title, $image) {
        $this->number = $number;
        $this->title = $title;
        $this->image = $image;
    }

    public function getNumber() { return $this->number; }
    public function getTitle() { return $this->title; }
    public function getImage() { return $this->image; }

    public function toArray() {
        return [
            "number" => $this->number,
            "title" => $this->title,
            "image" => $this->image
        ];
    }

}