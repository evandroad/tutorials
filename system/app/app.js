function userManagement() {
  return {
    API: 'http://localhost:8080',
    users: [],
    isModalOpen: false,
    isConfirmModalOpen: false,
    isLoadingModalOpen: false,
    userToDelete: null,
    modalTitle: '',
    currentUser: {
      id: null,
      name: '',
      email: ''
    },
      
    // Inicializa os usuários ao carregar a página
    init() {
      this.fetchUsers()
    },

    // Busca usuários da API
    async fetchUsers() {
      try {
        const response = await axios.get(this.API + '/users')
        this.users = response.data
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        alert('Erro ao carregar usuários')
      }
    },
    
    openLoadingModal() {
      this.isLoadingModalOpen = true;
    },
    
    closeLoadingModal() {
      this.isLoadingModalOpen = false;
    },
    
    openConfirmModal(user) {
      this.userToDelete = user;
      this.isConfirmModalOpen = true;
    },
    
    closeConfirmModal() {
      this.userToDelete = null;
      this.isConfirmModalOpen = false;
    },
    
    deleteUser(userId) {
      // Simulação de deleção
      this.openLoadingModal();
      
      // Simular uma operação assíncrona
      setTimeout(() => {
        // Lógica de deleção aqui
        console.log(`Deletando usuário ${userId}`);
        
        // Fechar o modal de carregamento
        this.closeLoadingModal();
        
        // Fechar o modal de confirmação
        this.closeConfirmModal();
      }, 2000);
    },

    // Abre o modal para cadastro ou edição
    openModal(type, user = null) {
      this.isModalOpen = true
      
      if (type === 'create') {
        this.modalTitle = 'Novo Usuário'
        this.currentUser = { id: null, name: '', email: '' }
      } else {
        this.modalTitle = 'Editar Usuário'
        this.currentUser = { ...user }
      }
    },

    // Fecha o modal
    closeModal() {
      this.isModalOpen = false
      this.currentUser = { id: null, name: '', email: '' }
    },

    // Submete usuário (cria ou atualiza)
    async submitUser() {
      this.openLoadingModal()
      try {
        if (this.currentUser.id) {
          // Atualiza usuário existente
          await axios.put(`${this.API}/users/${this.currentUser.id}`, this.currentUser)
          
          // Atualiza o usuário na lista local
          const index = this.users.findIndex(u => u.id === this.currentUser.id)
          if (index !== -1) {
            this.users[index] = { ...this.currentUser }
          }
        } else {
          // Cria novo usuário
          const response = await axios.post(this.API + '/users', this.currentUser)

          if (response.status === 201) {
            console.log('Usuário criado com sucesso:', response.data)
            // Adiciona o novo usuário à lista local com ID gerado pela API
            this.users.push({ ...response.data, ...this.currentUser })
          } else {
            console.warn('Resposta inesperada do servidor:', response)
          }
        }

        // Fecha o modal após a operação
        this.closeModal()
      } catch (error) {
        console.error('Erro ao salvar usuário:', error)
        alert('Erro ao salvar usuário')
      }

      this.closeLoadingModal()
    },

    // Deleta usuário
    async deleteUser(id) {
      try {
        // Chama a API para deletar
        await axios.delete(`${this.API}/users/${id}`)

        // Remove o usuário da lista local
        this.users = this.users.filter(user => user.id !== id)
      } catch (error) {
        console.error('Erro ao deletar usuário:', error)
        alert('Erro ao deletar usuário')
      }
    }
  }
}