package file

import (
	"io"
	"os"
	"io/ioutil"
	"encoding/json"
)

type Tutorial struct {
	Number int    `json:"number"`
	Title  string `json:"title"`
	Image  string `json:"image"`
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
	updatedData, err := json.Marshal(tutorials)
	if err != nil {
		println("Erro ao serializar JSON: " + err.Error())
		return
	}
	
	err = ioutil.WriteFile(filePath, updatedData, 0644)
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