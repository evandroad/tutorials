package handler

import (
	// "fmt"
	"sort"
	"strconv"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"tutorials/file"
	"github.com/gin-gonic/gin"
)

func ListContent(c *gin.Context) {
	tutorial := c.Param("tutorial")
	c.JSON(http.StatusOK, getContents(tutorial))	
}

func InsertContent(c *gin.Context) {
	number, err := strconv.Atoi(c.PostForm("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Número inválido"})
		return
	}
	
	tutorial := c.PostForm("tutorial")
	title := c.PostForm("title")
	scontent := c.PostForm("content")
	code := c.PostForm("code")
	jsonPath := "../../public/data/" + tutorial + ".json"

	commands := getContents(tutorial)

	command := file.Command{
		Number: number,
		Title: title,
	}

	content := file.Content{
		ID: "qqqqq",
		Content: scontent,
		Code: code,
	}

	command.Content = append(command.Content, content)
	commands = append(commands, command)

	sort.Slice(commands, func(i, j int) bool {
    return commands[i].Number < commands[j].Number
	})

	file.SaveCommand(jsonPath, commands)

	// for _, command := range commands {
		// 	for _, c := range command.Content {
			// 		if t.Title == currentTutorial {
				// 			t.Number = number
				// 			t.Title = tutorial
				// 			t.Image = tutorial + ext
				// 		}
				// 		updatedTutorials = append(updatedTutorials, t)
				// 	}
	// }

	c.JSON(http.StatusOK, gin.H{"message": "Conteúdo salvo com sucesso."})
}

func getContents(tutorial string) []file.Command {
	filePath := "../../public/data/" + tutorial + ".json"
	var jsonData []file.Command
	
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		println("Erro: ", err.Error())
		return jsonData
	}

	err = json.Unmarshal(file, &jsonData)
	if err != nil {
		println("Erro: ", err.Error())
		return jsonData
	}

	return jsonData
}