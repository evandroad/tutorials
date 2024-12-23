package main

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"os/exec"
	"sort"
	"time"
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
	TUTORIALS     = "tutorial/data/tutorials.json"
	TUTORIALS_DIR = "tutorial/data/"
	IMAGE_DIR     = "tutorial/img"
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

func rename(oldPath string, newPath string) {
	err := os.Rename(oldPath, newPath)
	if err != nil {
		println("Erro ao renomear o tutorial: " + err.Error())
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

	if len(image) > 0 {
		tutorial.Image = tutorial.Title + filepath.Ext(tutorial.Image)
		saveImage(tutorial.Image, image)
	}

	tutorial.ID = getMD5()
	tutorials = append(tutorials, tutorial)

	sort.Slice(tutorials, func(i, j int) bool {
		return tutorials[i].Number < tutorials[j].Number
	})

	saveJson(TUTORIALS, tutorials)

	jsonPath := TUTORIALS_DIR + tutorial.Title + ".json"
	saveJson(jsonPath, []Tutorial{})

	return "Tutorial salvo com sucesso."
}

func (a *App) UpdateTutorial(tutorial Tutorial, image []byte) string {
	tutorials, err := getTutorials()
	if err != nil {
		fmt.Printf("Erro ao carregar os tutoriais: %v", err)
		return "Erro ao carregar os tutoriais."
	}

	var currentTutorial Tutorial
	for i := range tutorials {
		if tutorials[i].ID == tutorial.ID {
			currentTutorial = tutorials[i]
			break
		}
	}

	if len(image) > 0 {
		if currentTutorial.Image != "" {
			remove(IMAGE_DIR + currentTutorial.Image)
		}
		saveImage(tutorial.Image, image)
	} else if currentTutorial.Image != "" {
		oldPathImg := IMAGE_DIR + "/" + currentTutorial.Image
		newPathImg := IMAGE_DIR + "/" + tutorial.Title + filepath.Ext(currentTutorial.Image)
		rename(oldPathImg, newPathImg)
	}

	oldPath := TUTORIALS_DIR + currentTutorial.Title + ".json"
	newPath := TUTORIALS_DIR + tutorial.Title + ".json"
	rename(oldPath, newPath)

	for i := range tutorials {
		if tutorials[i].ID == tutorial.ID {
			tutorials[i].Number = tutorial.Number
			tutorials[i].Title = tutorial.Title
			if tutorial.Image != "" {
				tutorials[i].Image = tutorial.Title + filepath.Ext(tutorial.Image)
			}
			break
		}
	}

	sort.Slice(tutorials, func(i, j int) bool {
		return tutorials[i].Number < tutorials[j].Number
	})

	saveJson(TUTORIALS, tutorials)

	return "Tutorial atualizado com sucesso."
}

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

	jsonPath := TUTORIALS_DIR + tutorial + ".json"
	remove(jsonPath)

	return "Tutorial apagado com sucesso."
}

func (a *App) SendGit(message string) string {
	go git(message)
	return "Enviado para o git com sucesso."
}

func git(message string) {
  cmd := exec.Command("git", "pull")
  err := cmd.Run()
  if err != nil {
    fmt.Println("Error pull changes", err)
    return
  }

  cmd = exec.Command("git", "add", "./tutorial/*")
  err = cmd.Run()
  if err != nil {
    fmt.Println("Error staging changes:", err)
    return
  }

  commitMsg := "feat: " + message
  cmd = exec.Command("git", "commit", "-m", commitMsg)
  err = cmd.Run()
  if err != nil {
    fmt.Println("Error committing changes:", err)
    return
  }

  cmd = exec.Command("git", "push")
  err = cmd.Run()
  if err != nil {
    fmt.Println("Error pushing changes:", err)
  }
}
