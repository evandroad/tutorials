<?php

class Content {

    private $id;
    private $content;
    private $code;

    public function getId() { return $this->id; }

    public function __construct($id, $content, $code) {
        $this->id = $id;
        $this->content = $content;
        $this->code = $code;
    }

    public function toArray() {
        return [
            "id" => $this->id,
            "content" => $this->content,
            "code" => $this->code
        ];
    }

}