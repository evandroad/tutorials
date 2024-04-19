package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Estrutura para os dados JSON
type Data struct {
	Message string `json:"message"`
}

func main() {
	router := gin.Default()

	router.GET("/data", handleData)
	router.StaticFS("/", http.dir("./"))
	// router.Use(staticMiddleware("/data"), gin.Static("/", "./"))

	port := ":8080"
	println("Servidor rodando em http://localhost" + port)
	err := router.Run(port)
	if err != nil {
		println("Erro ao iniciar o servidor: ", err.Error())
	}
}

func staticMiddleware(blockedPath string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.URL.Path == blockedPath {
			c.AbortWithStatus(http.StatusNotFound)
			return
		}

		c.Next()
	}
}

func handleData(c *gin.Context) {
	data := Data{Message: "Hello from Go server!"}
	c.JSON(http.StatusOK, data)
}