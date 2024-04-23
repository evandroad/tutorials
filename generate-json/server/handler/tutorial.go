package handler

import (
	"sort"
	"strconv"
	"net/http"
	"io/ioutil"
	"encoding/json"
	"path/filepath"
	"tutorials/file"
	"github.com/gin-gonic/gin"
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
	imagePath := "../../public/img/" + tutorial + ext

	file.SaveImage(imagePath, image)

	filePath := "../../public/data/tutorials.json"
	
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
	
	jsonPath := "../../public/data/" + tutorial + ".json"
	file.SaveEmptyJSON(jsonPath)

	c.JSON(http.StatusOK, gin.H{"message": "Tutorial salvo com sucesso."})
}

func UpdateTutorial(c *gin.Context) {
	tutorial := c.PostForm("tutorial")
	currentTutorial := c.PostForm("currentTutorial")
	currentImage := c.PostForm("currentImage")
	filePath := "../../public/data/tutorials.json"
	oldImagePath := "../../public/img/" + currentImage
	oldPath := "../../public/data/" + currentTutorial + ".json"
	newPath := "../../public/data/" + tutorial + ".json"
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
		newImagePath := "../../public/img/" + tutorial + ext

		file.Rename(oldImagePath, newImagePath)
	} else {
		file.Remove(oldImagePath)

		ext = filepath.Ext(header.Filename)
		newImagePath := "../../public/img/" + tutorial + ext

		file.SaveImage(newImagePath, image)
		defer image.Close()
	}
	
	var tutorials = getTutorials()
	var updatedTutorials []file.Tutorial

	for _, t := range tutorials {
		if t.Title == currentTutorial {
			t.Number = number
			t.Title = tutorial
			t.Image = tutorial + ext
		}
		updatedTutorials = append(updatedTutorials, t)
	}

	sort.Slice(updatedTutorials, func(i, j int) bool {
    return updatedTutorials[i].Number < updatedTutorials[j].Number
	})

	file.SaveJson(filePath, updatedTutorials)

	c.JSON(http.StatusOK, gin.H{"message": "Tutorial salvo com sucesso."})
}

func DeleteTutorial(c *gin.Context) {
	tutorial := c.Param("tutorial")
	filePath := "../../public/data/tutorials.json"

	var tutorials = getTutorials()
	var updatedTutorials []file.Tutorial

	var image string
	for _, t := range tutorials {
		if t.Title != tutorial {
			updatedTutorials = append(updatedTutorials, t)
		}

		if t.Title == tutorial {
			image = t.Image
		}
	}

	file.SaveJson(filePath, updatedTutorials)
	
	imagePath := "../../public/img/" + image
	file.Remove(imagePath)

	jsonPath:= "../../public/data/" + tutorial + ".json"
	file.Remove(jsonPath)

	c.JSON(http.StatusOK, gin.H{"message": "Tutorial apagado com sucesso."})
}

func getTutorials() []file.Tutorial {
	filePath := "../../public/data/tutorials.json"
	var jsonData []file.Tutorial
	
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