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

type User struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

const (
	FILENAME = "users.json"
)

func getUsers() ([]User, error) {
	var jsonData []User

	// Se o arquivo não existir, inicializa com slice vazio
	arquivo, err := os.OpenFile(FILENAME, os.O_RDWR|os.O_CREATE, 0666)
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
func nextID() int {
	users, err := getUsers()
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
	return os.WriteFile(FILENAME, bytes, 0666)
}

func getAllUsersHandler(c *gin.Context) {
	users, err := getUsers()
	if err != nil {
		fmt.Printf("Erro ao carregar usuários: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("Usuários carregados: %+v\n", users)
	c.JSON(http.StatusOK, users)
}

func createUserHandler(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.ID = nextID()

	users, err := getUsers()
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

func updateUserHandler(c *gin.Context) {
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

	users, err := getUsers()
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

func deleteUserHandler(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	users, err := getUsers()
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
	router.GET("/users", getAllUsersHandler)
	router.POST("/users", createUserHandler)
	router.PUT("/users/:id", updateUserHandler)
	router.DELETE("/users/:id", deleteUserHandler)

	// Inicia o servidor
	porta := ":8080"
	fmt.Printf("Servidor rodando em http://localhost" + porta + "\n")
	router.Run(porta)
}