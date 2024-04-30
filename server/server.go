package main

import (
  "os/exec"
  "runtime"
  "net/http"
  "tutorials/handler"
  "github.com/fatih/color"
  "github.com/gin-gonic/gin"
  "github.com/gin-contrib/cors"
)

var cyan = color.New(color.FgCyan).SprintFunc()

func CorsMiddleware(port string) gin.HandlerFunc {
  return cors.New(cors.Config{
    AllowCredentials: true,
    AllowOrigins:     []string{"http://localhost" + port},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Accept", "X-Requested-With"},
  })
}

func main() {
  webPort := ":8000"
  appPort := ":8001"
  apiPort := ":8081"
  webUrl := "http://localhost" + webPort
  appUrl := "http://localhost" + appPort
  apiUrl := "http://localhost" + apiPort

  if runtime.GOOS == "linux" {
    openBrowserLinux(webUrl, appUrl)
  }

  apiRouter := gin.Default()
  apiRouter.Use(CorsMiddleware(appPort))
  apiRouter.GET("/", status)
  apiRouter.GET("/tutorial", listTutorial)
  apiRouter.POST("/tutorial", insertTutorial)
  apiRouter.PUT("/tutorial", updateTutorial)
  apiRouter.DELETE("/tutorial/:tutorial", deleteTutorial)
  apiRouter.GET("/content/:tutorial", listContent)
  apiRouter.POST("/content", insertContent)
  apiRouter.PUT("/content", updateContent)
  apiRouter.DELETE("/content/:tutorial/:title", deleteContent)

  println("API rodando em " + apiUrl)
  go func() {
    err := apiRouter.Run(apiPort)
    if err != nil {
      println("Erro ao iniciar o servidor da API: ", err.Error())
    }
  }()

  appRouter := gin.Default()
  appRouter.StaticFS("/", http.Dir("../generate-json"))

  println("Backend rodando em " + cyan(appUrl))
  go func() {
    err := appRouter.Run(appPort)
    if err != nil {
      println("Erro ao iniciar o servidor de backend: ", err.Error())
    }
  }()
  
  webRouter := gin.Default()
  webRouter.StaticFS("/", http.Dir("../tutorial"))
  
  println("Frontend rodando em " + cyan(webUrl))
  err := webRouter.Run(webPort)
  if err != nil {
    println("Erro ao iniciar o servidor de frontend: ", err.Error())
  }
}

func status(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"code" : http.StatusOK, "message": "Welcome"}) }
func listTutorial(c *gin.Context) { handler.ListTutorial(c) }
func insertTutorial(c *gin.Context) { handler.InsertTutorial(c) }
func updateTutorial(c *gin.Context) { handler.UpdateTutorial(c) }
func deleteTutorial(c *gin.Context) { handler.DeleteTutorial(c) }
func listContent(c *gin.Context) { handler.ListContent(c) }
func insertContent(c *gin.Context) { handler.InsertContent(c) }
func updateContent(c *gin.Context) { handler.UpdateContent(c) }
func deleteContent(c *gin.Context) { handler.DeleteContent(c) }

func openBrowserLinux(webUrl string, appUrl string) {
  cmdWeb := exec.Command("xdg-open", webUrl)
  errWeb := cmdWeb.Run()
  if errWeb != nil {
    println("Erro ao abrir o navegador padrão:", errWeb.Error())
    return
  }

  cmdApp := exec.Command("xdg-open", appUrl)
  errApp := cmdApp.Run()
  if errApp != nil {
    println("Erro ao abrir o navegador padrão:", errApp.Error())
    return
  }
}