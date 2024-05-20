package file

import (
	"io"
	"os"
	"fmt"
	"io/ioutil"
	"os/exec"
	"encoding/json"
)

type Tutorial struct {
	Number int    `json:"number"`
	Title  string `json:"title"`
	Image  string `json:"image"`
}

type Command struct {
	Number 	int	 			`json:"number"`
	Title  	string	  `json:"title"`
	Content string		`json:"content"`
}

func SaveImage(imagePath string, image io.Reader) {
	out, err := os.Create(imagePath)
	if err != nil {
		println("Erro ao salvar a imagem: " + err.Error())
		return
	}
	defer out.Close()

	if _, err = io.Copy(out, image); err != nil {
		println("Erro ao salvar a imagem: " + err.Error())
		return
	}
}

func SaveJson(filePath string, tutorials []Tutorial) {
	data, err := json.MarshalIndent(tutorials, "", "  ")
	if err != nil {
		println("Erro ao serializar JSON: " + err.Error())
		return
	}
	
	saveFile(filePath, data)
}

func SaveCommand(filePath string, commands []Command) {
	data, err := json.Marshal(commands)
	if err != nil {
		println("Erro ao serializar JSON: " + err.Error())
		return
	}
	
	saveFile(filePath, data)
}

func saveFile(filePath string, data []byte) {
	err := ioutil.WriteFile(filePath, data, 0644)
	if err != nil {
		println("Erro ao escrever no arquivo: " + err.Error())
		return
	}
}

func SaveEmptyJSON(filePath string) {
	emptyJSON := "[]"
	err := ioutil.WriteFile(filePath, []byte(emptyJSON), 0644)
	if err != nil {
		println("Erro ao salvar JSON: " + err.Error())
		return
	}
}

func Rename(oldPath string, newPath string) {
	err := os.Rename(oldPath, newPath)
	if err != nil {
		println("Erro ao renomear o tutorial: " + err.Error())
		return
	}	
}

func Remove(filePath string) {
	err := os.Remove(filePath)
	if err != nil {
		println("Erro ao apagar o arquivo:", err)
		return
	}
}

func Git(message string) {
  // Stage changes
  cmd := exec.Command("git", "add", ".")
  err := cmd.Run()
  if err != nil {
    fmt.Println("Error staging changes:", err)
    return
  }

  // Commit staged changes
  commitMsg := "feat: " + message
  cmd = exec.Command("git", "commit", "-m", commitMsg)
  err = cmd.Run()
  if err != nil {
    fmt.Println("Error committing changes:", err)
    return
  }

  // Push changes (optional)
  // Assuming you're pushing to the origin remote
  cmd = exec.Command("git", "push")
  err = cmd.Run()
  if err != nil {
    fmt.Println("Error pushing changes:", err)
  }
}