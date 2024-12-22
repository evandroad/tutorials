package main

import (
	"os"
	"io"
	"fmt"
	"sort"
	"context"
	"path/filepath"
	"encoding/json"
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

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

type Tutorial struct {
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

func (a *App) SaveImage(filename string, data []byte) (bool, error) {
	if err := os.MkdirAll(IMAGE_DIR, 0755); err != nil {
		return false, err
	}

	err := os.WriteFile(filepath.Join(IMAGE_DIR, filename), data, 0644)
	if err != nil {
		return false, err
	}

	return true, nil
}

func (a *App) GetAllTutorials() []Tutorial {
	tutorials, err := getTutorials()
	if err != nil {
		fmt.Printf("Erro ao carregar os tutoriais: %v", err)
		return []Tutorial{}
	}

	return tutorials
}

func (a *App) InsertTutorial(tutorial Tutorial) string {
	tutorials, err := getTutorials()
	if err != nil {
		fmt.Printf("Erro ao carregar os tutoriais: %v", err)
		return "Erro ao carregar os tutoriais."
	}

	tutorials = append(tutorials, tutorial)

	sort.Slice(tutorials, func(i, j int) bool {
    return tutorials[i].Number < tutorials[j].Number
	})

	saveJson(TUTORIALS, tutorials)
	
	jsonPath := TUTORIALS_DIR + tutorial.Title + ".json"
	saveJson(jsonPath, []Tutorial{})

	return "Tutorial salvo com sucesso."
}