package main

import (
	"net/http"
	// "strconv"
	"io/ioutil"
	"encoding/json"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

type Tutorial struct {
	Number int    `json:"number"`
	Title  string `json:"title"`
	Image  string `json:"image"`
}

type Content struct {
	Number int `json:"number"`
	Title  string `json:"title"`
	Content []struct {
		ID      string `json:"id"`
		Content string `json:"content"`
		Code    string `json:"code"`
	} `json:"content"`
}

type TutorialList struct {
	Tutorials []Tutorial `json:"tutorials"`
}

// func (tl *TutorialList) LoadFromFile(path string) error {
// 	data, err := ioutil.ReadFile(path)
// 	if err != nil {
// 		return err
// 	}
// 	return json.Unmarshal(data, tl)
// }

// func (tl *TutorialList) AddTutorial(tutorial Tutorial) {
// 	tl.Tutorials = append(tl.Tutorials, tutorial)
// }

// func (tl *TutorialList) ToJson() ([]byte, error) {
// 	return json.MarshalIndent(tl, "", "  ")
// }

func main() {
	apiRouter := gin.Default()
	apiRouter.Use(CorsMiddleware())
	apiRouter.GET("/tutorial", listTutorial)
	apiRouter.GET("/content/:tutorial", listContent)

	apiPort := ":8081"
	println("API rodando em http://localhost" + apiPort)
	go func() {
		err := apiRouter.Run(apiPort)
		if err != nil {
			println("Erro ao iniciar o servidor da API: ", err.Error())
		}
	}()

	appRouter := gin.Default()
	appRouter.StaticFS("/", http.Dir("../public"))

	appPort := ":8080"
	println("Arquivos estáticos rodando em http://localhost" + appPort)
	err := appRouter.Run(appPort)
	if err != nil {
		println("Erro ao iniciar o servidor de arquivos estáticos: ", err.Error())
	}
}

func CorsMiddleware() gin.HandlerFunc {
  return cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Accept", "X-Requested-With"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
  })
}

func listTutorial(c *gin.Context) {
	filePath := "../../public/data/tutorials.json"
	
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var jsonData []Tutorial

	err = json.Unmarshal(file, &jsonData)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, jsonData)
}

func listContent(c *gin.Context) {
	tutorial := c.Param("tutorial")
	filePath := "../../public/data/" + tutorial + ".json"
	println("FilePath: " + filePath)
	
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var jsonData []Content

	err = json.Unmarshal(file, &jsonData)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, jsonData)
}

// func insertHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	err := r.ParseMultipartForm(10 << 20) // 10 MB max memory
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	number, err := strconv.Atoi(r.FormValue("number"))
// 	if err != nil {
// 		http.Error(w, "Invalid or missing number", http.StatusBadRequest)
// 		return
// 	}

// 	println("Body decodificado da solicitação:\n%s", number)

// 	title := r.FormValue("tutorial")
// 	if title == "" {
// 		http.Error(w, "Invalid or missing tutorial title", http.StatusBadRequest)
// 		return
// 	}

// 	println("Body decodificado da solicitação:\n%s", title)

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
// }