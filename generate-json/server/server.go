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

func CorsMiddleware() gin.HandlerFunc {
  return cors.New(cors.Config{
    AllowCredentials: true,
    AllowOrigins:     []string{"http://localhost:8080"},
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Accept", "X-Requested-With"},
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
  apiRouter.POST("/content", insertContent)
  apiRouter.PUT("/content", updateContent)
  apiRouter.DELETE("/content/:id/:tutorial/:title", deleteContent)

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

  appPort := ":8000"
  println("Arquivos estáticos rodando em " + cyan("http://localhost" + appPort))
  err := appRouter.Run(appPort)
  if err != nil {
    println("Erro ao iniciar o servidor de arquivos estáticos: ", err.Error())
  }

  openBrowser(appPort)
}

func listTutorial(c *gin.Context) { handler.ListTutorial(c) }
func insertTutorial(c *gin.Context) { handler.InsertTutorial(c) }
func updateTutorial(c *gin.Context) { handler.UpdateTutorial(c) }
func deleteTutorial(c *gin.Context) { handler.DeleteTutorial(c) }
func listContent(c *gin.Context) { handler.ListContent(c) }
func insertContent(c *gin.Context) { handler.InsertContent(c) }
func updateContent(c *gin.Context) { handler.UpdateContent(c) }
func deleteContent(c *gin.Context) { handler.DeleteContent(c) }

func openBrowser(port string) {
  var cmd *exec.Cmd

  switch runtime.GOOS {
  case "darwin", "linux":
    cmd = exec.Command("xdg-open", "http://localhost" + port)
  case "windows":
    cmd = exec.Command("cmd", "/c", "start", "http://localhost" + port)
  default:
    println("Sistema operacional não suportado.")
    return
  }

  err := cmd.Run()
  if err != nil {
    println("Erro ao abrir o navegador padrão:", err.Error())
    return
  }
}
