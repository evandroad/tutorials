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
  appPort := ":8000"
  url := "http://localhost" + appPort

  if runtime.GOOS == "linux" {
    openBrowserLinux(url)
  }
  
  appRouter := gin.Default()
  appRouter.StaticFS("/", http.Dir("../public"))

  println("Arquivos estáticos rodando em " + cyan(url))
  err := appRouter.Run(appPort)
  if err != nil {
    println("Erro ao iniciar o servidor de arquivos estáticos: ", err.Error())
  }
}

func openBrowserLinux(url string) {
  cmd := exec.Command("xdg-open", url)
  err := cmd.Run()
  if err != nil {
    println("Erro ao abrir o navegador padrão:", err.Error())
    return
  }
}
