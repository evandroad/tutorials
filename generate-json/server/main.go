package main

import (
	"io"
	"os"
	"sort"
	"net/http"
	"strconv"
	"io/ioutil"
	"encoding/json"
	"path/filepath"

	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

var cyan = color.New(color.FgCyan).SprintFunc()

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

func CorsMiddleware() gin.HandlerFunc {
  return cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:8080"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Accept", "X-Requested-With"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length"},
  })
}

func main() {
	apiRouter := gin.Default()
	apiRouter.Use(CorsMiddleware())
	apiRouter.GET("/tutorial", listTutorial)
	apiRouter.POST("/tutorial", insertTutorial)
	apiRouter.PUT("/tutorial", updateTutorial)
	apiRouter.DELETE("/tutorial/:tutorial", deleteTutorial)
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
	println("Arquivos estáticos rodando em " + cyan("http://localhost" + appPort))
	err := appRouter.Run(appPort)
	if err != nil {
		println("Erro ao iniciar o servidor de arquivos estáticos: ", err.Error())
	}
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

func insertTutorial(c *gin.Context) {
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Não foi possível processar os dados do formulário: " + err.Error()})
		return
	}
	
	var formData Tutorial
	if err := c.ShouldBind(&formData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao vincular os dados do formulário: " + err.Error()})
		return
	}
	
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

	out, err := os.Create(imagePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar a imagem: " + err.Error()})
		return
	}
	defer out.Close()

	if _, err = io.Copy(out, image); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar a imagem: " + err.Error()})
		return
	}

	filePath := "../../public/data/tutorials.json"
	
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var tutorials []Tutorial

	err = json.Unmarshal(file, &tutorials)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	newTutorial := Tutorial{
		Number: number,
		Title: tutorial,
		Image: tutorial + ext,
	}	

	tutorials = append(tutorials, newTutorial)

	sort.Slice(tutorials, func(i, j int) bool {
    return tutorials[i].Number < tutorials[j].Number
	})

	updatedData, err := json.Marshal(tutorials)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao serializar JSON: " + err.Error()})
		return
	}

	err = ioutil.WriteFile(filePath, updatedData, 0644)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao escrever no arquivo: " + err.Error()})
		return
	}

	jsonPath := "../../public/data/" + tutorial + ".json"
	err = ioutil.WriteFile(jsonPath, []byte("[]"), 0644)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao escrever no arquivo: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dados e imagem salvos com sucesso."})
}

func updateTutorial(c *gin.Context) {
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Não foi possível processar os dados do formulário: " + err.Error()})
		return
	}
	
	var formData Tutorial
	if err := c.ShouldBind(&formData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao vincular os dados do formulário: " + err.Error()})
		return
	}
	
	number, err := strconv.Atoi(c.PostForm("number"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Número inválido"})
		return
	}
	
	tutorial := c.PostForm("tutorial")
	currentTutorial := c.PostForm("currentTutorial")
	currentImage := c.PostForm("currentImage")
	var ext string

	oldImagePath := "../../public/img/" + currentImage
	
	image, header, err := c.Request.FormFile("image")
	if err != nil {
		println("error: Erro ao receber a imagem: ", err.Error())
		ext = filepath.Ext(currentImage)
		newImagePath := "../../public/img/" + tutorial + ext

		err = os.Rename(oldImagePath, newImagePath)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao renomear o tutorial: " + err.Error()})
			return
		}
	} else {
		err = os.Remove(oldImagePath)
		if err != nil {
			println("Erro ao apagar o arquivo:", err)
			return
		}

		ext = filepath.Ext(header.Filename)
		newImagePath := "../../public/img/" + tutorial + ext

		out, err := os.Create(newImagePath)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao salvar a imagem: " + err.Error()})
			return
		}
		defer out.Close()

		if _, err = io.Copy(out, image); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao salvar a imagem: " + err.Error()})
			return
		}
		defer image.Close()
	}

	oldPath := "../../public/data/" + currentTutorial + ".json"
	newPath := "../../public/data/" + tutorial + ".json"
	
	err = os.Rename(oldPath, newPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Erro ao renomear o tutorial: " + err.Error()})
		return
	}

	filePath := "../../public/data/tutorials.json"
	
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var tutorials []Tutorial

	err = json.Unmarshal(file, &tutorials)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var updatedTutorials []Tutorial

	for _, t := range tutorials {
		if t.Title == currentTutorial {
			t.Number = number
			t.Title = tutorial
			t.Image = tutorial + ext
		}
		updatedTutorials = append(updatedTutorials, t)
	}

	tutorials = updatedTutorials

	sort.Slice(tutorials, func(i, j int) bool {
    return tutorials[i].Number < tutorials[j].Number
	})

	updatedData, err := json.Marshal(tutorials)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao serializar JSON: " + err.Error()})
		return
	}

	err = ioutil.WriteFile(filePath, updatedData, 0644)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao escrever no arquivo: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Tutorial salvo com sucesso."})
}

func deleteTutorial(c *gin.Context) {
	tutorial := c.Param("tutorial")

	filePath := "../../public/data/tutorials.json"
	
	file, err := ioutil.ReadFile(filePath)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var tutorials []Tutorial

	err = json.Unmarshal(file, &tutorials)
	if err != nil {
		println("Erro: ", err.Error())
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	var updatedTutorials []Tutorial

	var image string
	for _, t := range tutorials {
		if t.Title != tutorial {
			updatedTutorials = append(updatedTutorials, t)
		}

		if t.Title == tutorial {
			image = t.Image
		}
	}

	tutorials = updatedTutorials

	updatedData, err := json.Marshal(tutorials)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao serializar JSON: " + err.Error()})
		return
	}

	err = ioutil.WriteFile(filePath, updatedData, 0644)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao escrever no arquivo: " + err.Error()})
		return
	}

	imagePath := "../../public/img/" + image
	err = os.Remove(imagePath)
	if err != nil {
		println("Erro ao apagar o arquivo:", err)
		return
	}

	jsonPath:= "../../public/data/" + tutorial + ".json"
	err = os.Remove(jsonPath)
	if err != nil {
		println("Erro ao apagar o arquivo:", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dados e imagem apagados com sucesso."})
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