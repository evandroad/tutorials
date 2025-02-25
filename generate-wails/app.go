package main

import (
	"io"
	"os"
	"log"
	"fmt"
	"sort"
	"time"
	"strconv"
	"context"
	"runtime"
	"os/exec"
	"math/rand"
	"encoding/json"
	"path/filepath"
	"golang.org/x/sys/windows"
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
	ID      string `json:"id"`
	Number  int    `json:"number"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

type Response struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
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

func saveJson(path string, data interface{}) error {
	bytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(path, bytes, 0666)
}

func remove(filePath string) {
	err := os.Remove(filePath)
	if err != nil {
		log.Println("Erro ao apagar o arquivo:", err)
		return
	}
}

func rename(oldPath string, newPath string) {
	err := os.Rename(oldPath, newPath)
	if err != nil {
		log.Println("Erro ao renomear o tutorial: " + err.Error())
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

func generateID() string {
	timestamp := time.Now().UnixMilli()
	timestampHex := strconv.FormatInt(timestamp, 16)	
	randomNumber := rand.Int63n(1e6)
	randomPart := fmt.Sprintf("%05x", randomNumber)

	return timestampHex + randomPart
}

func (a *App) GetAllTutorials() []Tutorial {
	tutorials, err := getTutorials()
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return []Tutorial{}
	}

	return tutorials
}

func (a *App) InsertTutorial(tutorial Tutorial, image []byte) Response {
	tutorials, err := getTutorials()
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return Response{
			Message: "Erro ao carregar os tutoriais.",
			Status: 1,
		}
	}

	if len(image) > 0 {
		tutorial.Image = tutorial.Title + filepath.Ext(tutorial.Image)
		saveImage(tutorial.Image, image)
	}

	tutorial.ID = generateID()
	tutorials = append(tutorials, tutorial)

	sort.Slice(tutorials, func(i, j int) bool {
		return tutorials[i].Number < tutorials[j].Number
	})

	saveJson(TUTORIALS, tutorials)

	jsonPath := TUTORIALS_DIR + tutorial.Title + ".json"
	saveJson(jsonPath, []Tutorial{})

	return Response{
		Message: "Tutorial salvo com sucesso.",
		Status: 0,
	}
}

func (a *App) UpdateTutorial(tutorial Tutorial, image []byte) Response {
	tutorials, err := getTutorials()
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return Response{
			Message: "Erro ao carregar os tutoriais.",
			Status: 1,
		}
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

	return Response{
		Message: "Tutorial atualizado com sucesso.",
		Status: 0,
	}
}

func (a *App) DeleteTutorial(id string) Response {
	tutorials, err := getTutorials()
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return Response{
			Message: "Erro ao carregar os tutoriais.",
			Status: 1,
		}
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

	return Response{
		Message: "Tutorial apagado com sucesso.",
		Status: 0,
	}
}

func getTutorial(tutorial string) ([]Content, error) {
	var jsonData []Content
	jsonPath := TUTORIALS_DIR + tutorial + ".json"

	file, err := os.OpenFile(jsonPath, os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	bytes, err := io.ReadAll(file)
	if err != nil {
		return nil, err
	}

	if len(bytes) == 0 {
		return []Content{}, nil
	}

	err = json.Unmarshal(bytes, &jsonData)
	if err != nil {
		return nil, err
	}

	return jsonData, nil
}

func (a *App) GetAllContents(tutorial string) []Content {
	contents, err := getTutorial(tutorial)
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return []Content{}
	}

	return contents
}

func (a *App) InsertContent(content Content, tutorial string) Response {
	contents, err := getTutorial(tutorial)
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return Response{
			Message: "Erro ao carregar os tutoriais.",
			Status: 1,
		}
	}
	
	content.ID = generateID()
	contents = append(contents, content)
	
	sort.Slice(contents, func(i, j int) bool {
		return contents[i].Number < contents[j].Number
	})
	
	jsonPath := TUTORIALS_DIR + tutorial + ".json"
	saveJson(jsonPath, contents)

	return Response{
		Message: "Conteúdo salvo com sucesso.",
		Status: 0,
	}
}

func (a *App) UpdateContent(content Content, tutorial string) Response {
	contents, err := getTutorial(tutorial)
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return Response{
			Message: "Erro ao carregar os tutoriais.",
			Status: 1,
		}
	}
	
	for i := range contents {
		if contents[i].ID == content.ID {
			contents[i].Number = content.Number
			contents[i].Title = content.Title
			contents[i].Content = content.Content
			break
		}
	}
	
	sort.Slice(contents, func(i, j int) bool {
		return contents[i].Number < contents[j].Number
	})
	
	jsonPath := TUTORIALS_DIR + tutorial + ".json"
	saveJson(jsonPath, contents)

	return Response{
		Message: "Conteúdo alterado com sucesso.",
		Status: 0,
	}
}

func (a *App) DeleteContent(id string, tutorial string) Response {
	contents, err := getTutorial(tutorial)
	if err != nil {
		log.Printf("Erro ao carregar os tutoriais: %v", err)
		return Response{
			Message: "Erro ao carregar os tutoriais.",
			Status: 1,
		}
	}

	for i := range contents {
		if contents[i].ID == id {
			contents = append(contents[:i], contents[i+1:]...)
			break
		}
	}
	
	filePath := TUTORIALS_DIR + tutorial + ".json"
	saveJson(filePath, contents)

	return Response{
		Message: "Conteúdo apagado com sucesso.",
		Status: 0,
	}
}

func (a *App) SendGit(message string) string {
	go func() {
		if err := git(message); err != nil {
			log.Println("Error:", err)
		}
	}()

	return "Enviado para o git com sucesso."
}

func git(message string) error {
	isWindows := runtime.GOOS == "windows"

	var pullCmd, addCmd, commitCmd, pushCmd *exec.Cmd
	if isWindows {
		pullCmd.SysProcAttr = &windows.SysProcAttr{HideWindow: true}
		addCmd.SysProcAttr = &windows.SysProcAttr{HideWindow: true}
		commitCmd.SysProcAttr = &windows.SysProcAttr{HideWindow: true}
		pushCmd.SysProcAttr = &windows.SysProcAttr{HideWindow: true}

		pullCmd = exec.Command("git", "pull")
		addCmd = exec.Command("git", "add", "./tutorial/*")
		commitCmd = exec.Command("git", "commit", "-m", "feat: "+message)
		pushCmd = exec.Command("git", "push")
	} else {
		pullCmd = exec.Command("git", "pull")
		addCmd = exec.Command("git", "add", "./tutorial/*")
		commitCmd = exec.Command("git", "commit", "-m", "feat: " + message)
		pushCmd = exec.Command("git", "push")
	}

	if err := runCommand(pullCmd, "Error pulling changes"); err != nil {
		return err
	}

	if err := runCommand(addCmd, "Error staging changes"); err != nil {
		return err
	}

	if err := runCommand(commitCmd, "Error committing changes"); err != nil {
		return err
	}

	if err := runCommand(pushCmd, "Error pushing changes"); err != nil {
		return err
	}

	return nil
}

func runCommand(cmd *exec.Cmd, errorMessage string) error {
	if err := cmd.Run(); err != nil {
		log.Println(errorMessage + ":", err)
		return err
	}

	return nil
}