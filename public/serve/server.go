package main

import (
  "os/exec"
  "runtime"
	"net/http"
	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
)

var cyan = color.New(color.FgCyan).SprintFunc()

func main() {
	appRouter := gin.Default()
	appRouter.StaticFS("/", http.Dir("./"))

	appPort := ":8000"
	println("Arquivos estáticos rodando em " + cyan("http://localhost" + appPort))
	err := appRouter.Run(appPort)
	if err != nil {
		println("Erro ao iniciar o servidor de arquivos estáticos: ", err.Error())
	}

  openBrowser(appPort)
}

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
