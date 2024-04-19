package main

import (
	"os"
	// "io"
	"strconv"
	"net/http"
	"io/ioutil"
	"encoding/json"
)

type Data struct {
	Message string `json:"message"`
}

type Tutorial struct {
	Number int    `json:"number"`
	Title  string `json:"title"`
	Image  string `json:"image"`
}

type TutorialList struct {
	Tutorials []Tutorial `json:"tutorials"`
}

func (tl *TutorialList) LoadFromFile(path string) error {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, tl)
}

func (tl *TutorialList) AddTutorial(tutorial Tutorial) {
	tl.Tutorials = append(tl.Tutorials, tutorial)
}

func (tl *TutorialList) ToJson() ([]byte, error) {
	return json.MarshalIndent(tl, "", "  ")
}

func main() {
	staticDir := "./"

	http.Handle("/", http.FileServer(http.Dir(staticDir)))
	http.HandleFunc("/api/data", handleData)
	http.HandleFunc("/api/insert", insertHandler)

	port := ":8080"
	println("Servidor rodando em http://localhost" + port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		println("Erro ao iniciar o servidor: ", err.Error())
		os.Exit(1)
	}
}

func handleData(w http.ResponseWriter, r *http.Request) {
	data := Data{Message: "Hello from Go server!"}

	jsonData, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Erro ao codificar JSON", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func insertHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB max memory
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	number, err := strconv.Atoi(r.FormValue("number"))
	if err != nil {
		http.Error(w, "Invalid or missing number", http.StatusBadRequest)
		return
	}

	println("Body decodificado da solicitação:\n%s", number)

	title := r.FormValue("tutorial")
	if title == "" {
		http.Error(w, "Invalid or missing tutorial title", http.StatusBadRequest)
		return
	}

	println("Body decodificado da solicitação:\n%s", title)

	// // Read the file
	// file, handler, err := r.FormFile("image")
	// if err != nil {
	// 	http.Error(w, "Invalid or missing image file", http.StatusBadRequest)
	// 	return
	// }
	// defer file.Close()

	// // Create file
	// dst, err := os.Create("../" + handler.Filename)
	// if err != nil {
	// 	http.Error(w, "Failed to create file", http.StatusInternalServerError)
	// 	return
	// }
	// defer dst.Close()

	// // Copy the file to the destination
	// _, err = io.Copy(dst, file)
	// if err != nil {
	// 	http.Error(w, "Failed to save file", http.StatusInternalServerError)
	// 	return
	// }

	// tutorial := Tutorial{Number: int(number), Title: title, Image: handler.Filename}
	
	// path := "tutorials.json"
	// tutorialList := &TutorialList{}
	// err = tutorialList.LoadFromFile(path)
	// if err != nil {
	// 	http.Error(w, "Failed to load tutorials", http.StatusInternalServerError)
	// 	return
	// }

	// tutorialList.AddTutorial(tutorial)

	// jsonData, err := tutorialList.ToJson()
	// if err != nil {
	// 	http.Error(w, "Failed to serialize tutorials", http.StatusInternalServerError)
	// 	return
	// }

	// ioutil.WriteFile(path, jsonData, 0644)
	// json.NewEncoder(w).Encode(map[string]string{"message": "Created tutorial."})
}