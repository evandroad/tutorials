package handler

import (
	"os"
	"sort"
	"strconv"
	"net/http"
	"encoding/json"
	"path/filepath"
	"tutorials/file"
	"github.com/gin-gonic/gin"
)

const (
	ROOT_DIR = "../tutorial/"
)

func ListTutorial(c *gin.Context) {
	c.JSON(http.StatusOK, getTutorials())
}

func InsertTutorial(c *gin.Context) {
	number, err := strconv.Atoi(c.PostForm("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Número inválido"})
		return
	}
	
	tutorial := c.PostForm("tutorial")

	image, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao receber a imagem: " + err.Error()})
		return
	}
	defer image.Close()

	ext := filepath.Ext(header.Filename)
	imagePath := ROOT_DIR + "img/" + tutorial + ext

	file.SaveImage(imagePath, image)

	filePath := ROOT_DIR + "data/tutorials.json"
	
	tutorials := getTutorials()

	newTutorial := file.Tutorial{
		Number: number,
		Title: tutorial,
		Image: tutorial + ext,
	}

	tutorials = append(tutorials, newTutorial)

	sort.Slice(tutorials, func(i, j int) bool {
    return tutorials[i].Number < tutorials[j].Number
	})

	file.SaveJson(filePath, tutorials)
	
	jsonPath := ROOT_DIR + "data/" + tutorial + ".json"
	file.SaveEmptyJSON(jsonPath)

	c.JSON(http.StatusOK, gin.H{"message": "Tutorial salvo com sucesso."})
}

func UpdateTutorial(c *gin.Context) {
	tutorial := c.PostForm("tutorial")
	currentTutorial := c.PostForm("currentTutorial")
	currentImage := c.PostForm("currentImage")
	filePath := ROOT_DIR +  "data/tutorials.json"
	oldImagePath := ROOT_DIR + "img/" + currentImage
	oldPath := ROOT_DIR + "data/" + currentTutorial + ".json"
	newPath := ROOT_DIR + "data/" + tutorial + ".json"
	var ext string
	
	number, err := strconv.Atoi(c.PostForm("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Número inválido"})
		return
	}
	
	file.Rename(oldPath, newPath)
	
	image, header, err := c.Request.FormFile("image")
	if err != nil {
		println("error: Erro ao receber a imagem: ", err.Error())
		ext = filepath.Ext(currentImage)
		newImagePath := ROOT_DIR + "img/" + tutorial + ext

		file.Rename(oldImagePath, newImagePath)
	} else {
		file.Remove(oldImagePath)

		ext = filepath.Ext(header.Filename)
		newImagePath := ROOT_DIR + "img/" + tutorial + ext

		file.SaveImage(newImagePath, image)
		defer image.Close()
	}
	
	var tutorials = getTutorials()

	for i := range tutorials {
		if tutorials[i].Title == currentTutorial {
			tutorials[i].Number = number
			tutorials[i].Title = tutorial
			tutorials[i].Image = tutorial + ext
		}
	}

	sort.Slice(tutorials, func(i, j int) bool {
    return tutorials[i].Number < tutorials[j].Number
	})

	file.SaveJson(filePath, tutorials)

	c.JSON(http.StatusOK, gin.H{"message": "Tutorial salvo com sucesso."})
}

func DeleteTutorial(c *gin.Context) {
	tutorial := c.Param("tutorial")
	filePath := ROOT_DIR + "data/tutorials.json"

	var tutorials = getTutorials()

	var image string
	for i := range tutorials {
		if tutorials[i].Title == tutorial {
			image = tutorials[i].Image
			tutorials = append(tutorials[:i], tutorials[i+1:]...)
			break
		}
	}

	file.SaveJson(filePath, tutorials)
	
	imagePath := ROOT_DIR + "img/" + image
	file.Remove(imagePath)

	jsonPath:= ROOT_DIR + "data/" + tutorial + ".json"
	file.Remove(jsonPath)

	c.JSON(http.StatusOK, gin.H{"message": "Tutorial apagado com sucesso."})
}

func getTutorials() []file.Tutorial {
	filePath := ROOT_DIR + "data/tutorials.json"
	var jsonData []file.Tutorial
	
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
