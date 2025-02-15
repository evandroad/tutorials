package main

import "net/http"

func main() {
  port := ":8080"
  webUrl := "http://localhost" + port

  fileServer := http.FileServer(http.Dir("../tutorial"))
  http.Handle("/", fileServer)
  
  println("Tutorial rodando em " + webUrl)
  
  err := http.ListenAndServe(port, nil)
  if err != nil {
    println("Erro ao iniciar o servidor: ", err.Error())
  }
}