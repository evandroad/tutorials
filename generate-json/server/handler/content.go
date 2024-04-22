package handler

import (
	"net/http"
	"io/ioutil"
	"encoding/json"
	"github.com/gin-gonic/gin"
)

type Content struct {
	Number 	int	 			`json:"number"`
	Title  	string	  `json:"title"`
	Content []Command `json:"content"`
}

type Command struct {
	ID      string `json:"id"`
	Content string `json:"content"`
	Code    string `json:"code"`
}

func ListContent(c *gin.Context) {
	c.JSON(http.StatusOK, getContent())	
}

func InsertTutorial(c *gin.Context) {
}

func getContent() []Content {
	tutorial := c.Param("tutorial")
	filePath := "../../public/data/" + tutorial + ".json"
	var jsonData []Content
	
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return jsonData
	}

	err = json.Unmarshal(file, &jsonData)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return jsonData
	}

	return jsonData
}