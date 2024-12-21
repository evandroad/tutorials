package main

import (
	"os"
	"io"
	"fmt"
	// "sort"
	"context"
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

func (a *App) GetAllTutorials() []Tutorial {
	tutorials, err := getTutorials()
	if err != nil {
		fmt.Printf("Erro ao carregar os tutoriais: %v", err)
		return []Tutorial{}
	}

	return tutorials
}