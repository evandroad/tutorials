package handler

import (
	"os"
	"sort"
	"strconv"
	"net/http"
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
	jsonPath := ROOT_DIR + "data/" + tutorial + ".json"

	commands := getContents(tutorial)

	command := file.Command{
		Number: number,
		Title: title,
		Content: scontent,
	}

	commands = append(commands, command)

	sort.Slice(commands, func(i, j int) bool {
    return commands[i].Number < commands[j].Number
	})

	file.SaveCommand(jsonPath, commands)

	go file.Git("Added content " + title + " in tutorial " + tutorial)

	c.JSON(http.StatusOK, gin.H{"message": "Conteúdo salvo com sucesso."})
}

func UpdateContent(c *gin.Context) {
	number, err := strconv.Atoi(c.PostForm("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Número inválido"})
		return
	}
	
	tutorial := c.PostForm("tutorial")
	oldTitle := c.PostForm("oldTitle")
	title := c.PostForm("title")
	content := c.PostForm("content")
	jsonPath := ROOT_DIR + "data/" + tutorial + ".json"

	commands := getContents(tutorial)

	for i := range commands {
		if commands[i].Title == oldTitle {
			commands[i].Number = number
			commands[i].Title = title
			commands[i].Content = content
			break
		}
	}

	sort.Slice(commands, func(i, j int) bool {
    return commands[i].Number < commands[j].Number
	})

	file.SaveCommand(jsonPath, commands)

	go file.Git("Updated content " + title + " in tutorial " + tutorial)

	c.JSON(http.StatusOK, gin.H{"message": "Conteúdo alterado com sucesso."})
}

func DeleteContent(c *gin.Context) {
	title := c.Param("title")
	tutorial := c.Param("tutorial")
	filePath := ROOT_DIR + "data/" + tutorial + ".json"

	commands := getContents(tutorial)

	for i := range commands {
		if commands[i].Title == title {
			commands = append(commands[:i], commands[i+1:]...)
			break
		}
	}

	file.SaveCommand(filePath, commands)

	go file.Git("Deleted content " + title + " in tutorial " + tutorial)

	c.JSON(http.StatusOK, gin.H{"message": "Conteúdo apagado com sucesso."})
}

func getContents(tutorial string) []file.Command {
	filePath := ROOT_DIR + "data/" + tutorial + ".json"
	var jsonData []file.Command
	
	file, err := os.ReadFile(filePath)
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