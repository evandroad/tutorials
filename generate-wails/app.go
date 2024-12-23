package main

import (
	"os"
	"io"
	"fmt"
	"sort"
	"time"
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"path/filepath"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type Tutorial struct {
	ID     string `json:"id"`
	Number int    `json:"number"`
	Title  string `json:"title"`
	Image  string `json:"image"`
}

type Content struct {
	Number  int    `json:"number"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

const (
	TUTORIALS = "tutorial/data/tutorials.json"
	TUTORIALS_DIR = "tutorial/data/"
	IMAGE_DIR = "tutorial/img"
)

func getTutorials() ([]Tutorial, error) {
	var jsonData []Tutorial

	arquivo, err := os.OpenFile(TUTORIALS, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		return nil, err
	}
	defer arquivo.Close()

	bytes, err := io.ReadAll(arquivo)
	if err != nil {
		return nil, err
	}

	if len(bytes) == 0 {
		return []Tutorial{}, nil
	}

	err = json.Unmarshal(bytes, &jsonData)
	if err != nil {
		return nil, err
	}

	return jsonData, nil
}

func saveJson(path string, users []Tutorial) error {
	bytes, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, bytes, 0666)
}

func remove(filePath string) {
	err := os.Remove(filePath)
	if err != nil {
		println("Erro ao apagar o arquivo:", err)
		return
	}
}

func saveImage(filename string, data []byte) (bool, error) {
	if err := os.MkdirAll(IMAGE_DIR, 0755); err != nil {
		return false, err
	}

	err := os.WriteFile(filepath.Join(IMAGE_DIR, filename), data, 0644)
	if err != nil {
		return false, err
	}

	return true, nil
}

func getMD5() string {
	theTime := time.Now()
	hash := md5.Sum([]byte(theTime.Format("20060102150405")))
	return hex.EncodeToString(hash[:])
}

func (a *App) GetAllTutorials() []Tutorial {
	tutorials, err := getTutorials()
	if err != nil {
		fmt.Printf("Erro ao carregar os tutoriais: %v", err)
		return []Tutorial{}
	}

	return tutorials
}

func (a *App) InsertTutorial(tutorial Tutorial, image []byte) string {
	tutorials, err := getTutorials()
	if err != nil {
		fmt.Printf("Erro ao carregar os tutoriais: %v", err)
		return "Erro ao carregar os tutoriais."
	}

	tutorial.ID = getMD5()
	tutorial.Image = tutorial.Title + filepath.Ext(tutorial.Image)
	tutorials = append(tutorials, tutorial)

	sort.Slice(tutorials, func(i, j int) bool {
    return tutorials[i].Number < tutorials[j].Number
	})

	saveJson(TUTORIALS, tutorials)
	
	jsonPath := TUTORIALS_DIR + tutorial.Title + ".json"
	saveJson(jsonPath, []Tutorial{})

	saveImage(tutorial.Image, image)

	return "Tutorial salvo com sucesso."
}

// func (a *App) UpdateTutorial(tutorial Tutorial, currentTutorial string, currentImage string) string {
// 	oldImagePath := IMAGE_DIR + "/" + currentImage
// 	oldPath := TUTORIALS_DIR + currentTutorial + ".json"
// 	newPath := TUTORIALS_DIR + tutorial.Title + ".json"
// 	var ext string
	
// 	file.Rename(oldPath, newPath)
	
// 	image, header, err := c.Request.FormFile("image")
// 	if err != nil {
// 		println("error: Erro ao receber a imagem: ", err.Error())
// 		ext = filepath.Ext(currentImage)
// 		newImagePath := ROOT_DIR + "img/" + tutorial + ext

// 		file.Rename(oldImagePath, newImagePath)
// 	} else {
// 		file.Remove(oldImagePath)

// 		ext = filepath.Ext(header.Filename)
// 		newImagePath := ROOT_DIR + "img/" + tutorial + ext

// 		file.SaveImage(newImagePath, image)
// 		defer image.Close()
// 	}
	
// 	var tutorials = getTutorials()

// 	for i := range tutorials {
// 		if tutorials[i].Title == currentTutorial {
// 			tutorials[i].Number = number
// 			tutorials[i].Title = tutorial
// 			tutorials[i].Image = tutorial + ext
// 		}
// 	}

// 	sort.Slice(tutorials, func(i, j int) bool {
//     return tutorials[i].Number < tutorials[j].Number
// 	})

// 	file.SaveJson(filePath, tutorials)

// 	c.JSON(http.StatusOK, gin.H{"message": "Tutorial salvo com sucesso."})
// }

func (a *App) DeleteTutorial(id string) string {
	tutorials, err := getTutorials()
	if err != nil {
		fmt.Printf("Erro ao carregar os tutoriais: %v", err)
		return "Erro ao carregar os tutoriais."
	}

	var image string
	var tutorial string
	for i := range tutorials {
		if tutorials[i].ID == id {
			image = tutorials[i].Image
			tutorial = tutorials[i].Title
			tutorials = append(tutorials[:i], tutorials[i+1:]...)
			break
		}
	}

	saveJson(TUTORIALS, tutorials)
	
	imagePath := IMAGE_DIR + "/" + image
	remove(imagePath)

	jsonPath:= TUTORIALS_DIR + tutorial + ".json"
	remove(jsonPath)

	return "Tutorial apagado com sucesso."
}