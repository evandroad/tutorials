package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"sort"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Estrutura do usuário
type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// Carrega usuários do arquivo JSON
func carregarUsuarios() ([]User, error) {
	var jsonData []User

	// Se o arquivo não existir, inicializa com slice vazio
	arquivo, err := os.OpenFile("usuarios.json", os.O_RDWR|os.O_CREATE, 0666)
	if err != nil {
		return nil, err
	}
	defer arquivo.Close()

	// Lê o conteúdo do arquivo
	bytes, err := io.ReadAll(arquivo)
	if err != nil {
		return nil, err
	}

	// Se o arquivo estiver vazio, inicializa lista vazia
	if len(bytes) == 0 {
		return []User{}, nil
	}

	// Tenta fazer parse do JSON
	err = json.Unmarshal(bytes, &jsonData)
	if err != nil {
		// Se houver erro no parse, inicializa lista vazia
		return nil, err
	}

	return jsonData, nil
}

// Encontra próximo ID disponível
func proximoID() int {
	users, err := carregarUsuarios()
	if err != nil {
		fmt.Printf("Erro ao carregar usuários: %v", err)
		return 0
	}

	if len(users) == 0 {
		return 1
	}

	return users[len(users)-1].ID + 1
}

// Salva uma lista de usuarios no arquivo
func saveFile(users []User) error {
	// Converte para JSON
	bytes, err := json.MarshalIndent(users, "", "  ")
	if err != nil {
		return err
	}

	// Escreve no arquivo
	return os.WriteFile("usuarios.json", bytes, 0666)
}

// Handler para listar usuários
func listarUsuariosHandler(c *gin.Context) {
	users, err := carregarUsuarios()
	if err != nil {
		fmt.Printf("Erro ao carregar usuários: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("Usuários carregados: %+v\n", users)
	c.JSON(http.StatusOK, users)
}

// Handler para criar usuário
func criarUsuarioHandler(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Define ID automaticamente
	user.ID = proximoID()

	users, err := carregarUsuarios()
	if err != nil {
		fmt.Printf("Erro ao carregar usuários: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	users = append(users, user)

	sort.Slice(users, func(i, j int) bool {
		return users[i].ID < users[j].ID
	})

	saveFile(users)
	c.JSON(http.StatusCreated, user)
}

// Handler para atualizar usuário
func atualizarUsuarioHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var usuarioAtualizado User
	if err := c.ShouldBindJSON(&usuarioAtualizado); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	users, err := carregarUsuarios()
	if err != nil {
		fmt.Printf("Erro ao carregar usuários: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mantém o ID original
	for i, u := range users {
		if u.ID == id {
			usuarioAtualizado.ID = id
			users[i] = usuarioAtualizado
			break
		}
	}

	sort.Slice(users, func(i, j int) bool {
		return users[i].ID < users[j].ID
	})

	saveFile(users)
	c.JSON(http.StatusOK, gin.H{"message": "Usuário alterado com sucesso."})
}

// Handler para deletar usuário
func deletarUsuarioHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	users, err := carregarUsuarios()
	if err != nil {
		fmt.Printf("Erro ao carregar usuários: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Remove o usuário
	for i, u := range users {
		if u.ID == id {
			users = append(users[:i], users[i+1:]...)
			break
		}
	}

	saveFile(users)
	c.JSON(http.StatusOK, gin.H{"message": "Usuário apagado com sucesso."})
}

func main() {
	// Configura o roteador
	router := gin.Default()
	router.Use(cors.Default())

	// Rotas
	router.GET("/users", listarUsuariosHandler)
	router.POST("/users", criarUsuarioHandler)
	router.PUT("/users/:id", atualizarUsuarioHandler)
	router.DELETE("/users/:id", deletarUsuarioHandler)

	// Inicia o servidor
	porta := ":8080"
	fmt.Printf("Servidor rodando em http://localhost" + porta + "\n")
	router.Run(porta)
}