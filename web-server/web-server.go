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
  port := ":8080"
  webUrl := "http://localhost" + port

  if runtime.GOOS == "linux" {
    openBrowserLinux(webUrl)
  }

  router := gin.Default()
  router.StaticFS("/", http.Dir("../tutorial"))
  
  println("Tutorial rodando em " + cyan(webUrl))
  
  err := router.Run(port)
  if err != nil {
    println("Erro ao iniciar o servidor: ", err.Error())
  }
}

func openBrowserLinux(webUrl string) {
  cmdWeb := exec.Command("xdg-open", webUrl)
  errWeb := cmdWeb.Run()
  if errWeb != nil {
    println("Erro ao abrir o navegador padrão:", errWeb.Error())
    return
  }
}