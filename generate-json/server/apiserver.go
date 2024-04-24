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
  apiPort := ":8081"
  appPort := ":8001"
  apiUrl := "http://localhost" + apiPort
  appUrl := "http://localhost" + appPort

  if runtime.GOOS == "linux" {
    openBrowserLinux(appUrl)
  }

  apiRouter := gin.Default()
  apiRouter.Use(CorsMiddleware(appPort))
  apiRouter.GET("/tutorial", listTutorial)
  apiRouter.POST("/tutorial", insertTutorial)
  apiRouter.PUT("/tutorial", updateTutorial)
  apiRouter.DELETE("/tutorial/:tutorial", deleteTutorial)
  apiRouter.GET("/content/:tutorial", listContent)
  apiRouter.POST("/content", insertContent)
  apiRouter.PUT("/content", updateContent)
  apiRouter.DELETE("/content/:id/:tutorial/:title", deleteContent)

  println("API rodando em " + apiUrl)
  go func() {
    err := apiRouter.Run(apiPort)
    if err != nil {
      println("Erro ao iniciar o servidor da API: ", err.Error())
    }
  }()

  appRouter := gin.Default()
  appRouter.StaticFS("/", http.Dir("../public"))

  println("Arquivos estáticos rodando em " + cyan(appUrl))
  err := appRouter.Run(appPort)
  if err != nil {
    println("Erro ao iniciar o servidor de arquivos estáticos: ", err.Error())
  }
}

func listTutorial(c *gin.Context) { handler.ListTutorial(c) }
func insertTutorial(c *gin.Context) { handler.InsertTutorial(c) }
func updateTutorial(c *gin.Context) { handler.UpdateTutorial(c) }
func deleteTutorial(c *gin.Context) { handler.DeleteTutorial(c) }
func listContent(c *gin.Context) { handler.ListContent(c) }
func insertContent(c *gin.Context) { handler.InsertContent(c) }
func updateContent(c *gin.Context) { handler.UpdateContent(c) }
func deleteContent(c *gin.Context) { handler.DeleteContent(c) }

func openBrowserLinux(url string) {
  cmd := exec.Command("xdg-open", url)
  err := cmd.Run()
  if err != nil {
    println("Erro ao abrir o navegador padrão:", err.Error())
    return
  }
}