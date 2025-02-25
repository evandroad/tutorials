<template>
  <div class="w-full flex justify-center mt-4">
    <h1 class="text-4xl font-medium">{{ tutorial }}</h1>
  </div>

  <div class="w-2/3 m-auto">
    <button @click="home" class="bg-zinc-500 text-white px-4 py-2 rounded-full hover:bg-zinc-600 transition mb-2 mr-1">
      <router-link to="/">Voltar</router-link>
    </button>
    <button @click="openAddContent" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition mb-2">
      Adicionar
    </button>
  </div>

  <div class="bg-zinc-800 shadow-md rounded-xl overflow-auto w-2/3 m-auto mb-5">
    <table class="w-full">
      <thead class="bg-zinc-700 p-2">
        <th class="p-3" v-for="item in header" :key="item.number">{{ item }}</th>
      </thead>
      <tbody>
        <tr v-for="content in contents" :key="content.number" class="border-zinc-600 border-b last:border-0">
          <td class="p-2">{{ content.number }}</td>
          <td :id="content.title">{{ content.title }}</td>
          <td>{{ content.content }}</td>
          <td>
            <a href='' @click.prevent="openEditContent(content)">
              <svg width="30px" height="30px" class="text-zinc-200 hover:text-yellow-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="currentColor"/>
              </svg>
            </a>
          </td>
          <td>
            <a href='' @click.prevent="openConfirmDeleteContent(content)">
              <svg width="30px" height="30px" class="text-zinc-200 hover:text-red-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-zinc-800 p-6 rounded-lg w-2/5">
      <h5 class="text-2xl mb-4 font-bold">{{ titleModalContent }}</h5>
      <div class="mb-4">
        <label class="block mb-2">Número:</label>
        <input type="text" v-model="content.number" id="number" class="w-full p-2 border rounded bg-zinc-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600">
      </div>
      <div class="mb-4">
        <span class="block mb-2">Título:</span>
        <input type="text" v-model="content.title" id="title" class="w-full p-2 border rounded bg-zinc-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600">
      </div>
      <div class="mb-4">
        <span class="block mb-2">Conteúdo:</span>
        <textarea rows="8" v-model="content.content" class="w-full p-2 border rounded bg-zinc-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600"></textarea>
      </div>
      <div class="flex justify-end space-x-2">
        <button @click="isModalOpen = false" class="bg-zinc-300 text-black px-4 py-2 rounded hover:bg-zinc-400">
          cancelar
        </button>
        <button @click="cleanContent" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Limpar
        </button>
        <button v-show="showBtnAddContent" @click="insertContent" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Salvar
        </button>
        <button v-show="showBtnUpdContent" @click="updateContent" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Alterar
        </button>
      </div>
    </div>
  </div>

  <div v-if="isModalGitOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-zinc-800 p-6 rounded-lg w-2/5">
      <h2 class="text-2xl mb-4 font-bold">Enviar para o Github</h2>
      <div class="mb-4">
        <label class="block mb-2">Mensagem:</label>
        <input v-model="message" id="message" class="w-full p-2 border rounded bg-zinc-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600">
      </div>
      <div class="flex justify-end space-x-2">
        <button @click="isModalGitOpen = false" class="bg-zinc-300 text-black px-4 py-2 rounded hover:bg-zinc-400">Cancelar</button>
        <button @click="saveGit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
      </div>
    </div>
  </div>

  <div v-if="isConfirmModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-zinc-900 p-6 rounded-xl shadow-lg max-w-md w-full">
      <h2 class="text-xl font-bold mb-4 text-zinc-200">Confirmar Exclusão</h2>
      <p class="mb-6 text-zinc-300">
        Tem certeza que deseja excluir o conteúdo <span>{{ content.title }}</span>?
      </p>
      <div class="flex justify-end space-x-3">
        <button @click="isConfirmModalOpen = false" class="px-4 py-2 bg-zinc-200 text-gray-700 rounded-lg hover:bg-zinc-300 transition">
          Cancelar
        </button>
        <button @click="deleteContent" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Excluir
        </button>
      </div>
    </div>
  </div>
  
  <div v-if="isAlertModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-zinc-900 p-5 rounded-xl shadow-lg max-w-md w-full">
      <h2 class="text-xl font-bold mb-4 text-gray-300">Aviso</h2>
      <p class="mb-6 text-gray-200">{{ alertMessage }}</p>
      <div class="flex justify-end space-x-3">
        <button @click="isAlertModalOpen = false" class="px-4 py-2 bg-blue-500 text-gray-300 rounded-lg hover:bg-blue-300 transition">Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
import { focus, notify, Loading } from '../utils.js'
import { GetAllContents, InsertContent, UpdateContent, DeleteContent, SendGit, GitStatus } from '../../wailsjs/go/main/App.js'

export default {
  name: 'HomeView',
  mounted() {
    this.listContents()
  },
  data() {
    return {
      header: ['Número', 'Título', 'Conteúdo', 'Editar', 'Apagar'],
      contents: [],
      tutorial: '',
      content: {
        number: '',
        title: '',
        content: '',
      },
      message: '',
      titleModalContent: 'Adicionar Conteúdo',
      loading: new Loading(),
      isModalOpen: false,
      isModalGitOpen: false,
      isAlertModalOpen: false,
      isConfirmModalOpen: false,
      showBtnUpdContent: false,
      showBtnAddContent: false
    }
  },
  methods: {
    focus,
    notify,
    Loading,
    async listContents() {
      this.loading.show()

      try {
        this.tutorial = this.$route.params.tutorial
        
        const data = await GetAllContents(this.tutorial)
        this.contents = data
      } catch(error) {
        console.error('Erro ao buscar usuários:', error)
      } finally {
        this.loading.close()
      }
    },
    async insertContent() {
      if (this.content.title.length < 1 || this.content.content.length < 1) {
        this.alertMessage = 'Campos não podem ficar vazio'
        this.isAlertModalOpen = true
        return
      }

      if (isNaN(parseFloat(this.content.number))) {
        this.content.number = 0
      }

      this.loading.show()

      try {
        this.content.number = Number(this.content.number)
        const res = await InsertContent(this.content, this.tutorial)
        
        if (res.status == 1) {
          this.cleanContent()
          this.notify(res.message, 'error', 'top')
          this.isModalOpen = false
          return
        }

        this.message = `Added content "${this.content.title}" in tutorial "${this.tutorial}"`
        this.cleanContent()
        this.listContents(this.tutorial.name)
        this.isModalOpen = false
        this.isModalGitOpen = true
        this.notify(res.message, 'success', 'top')
        setTimeout(() => this.focus('message'), 100)
      } catch(error) {
        console.error(error)
        this.notify(error, 'error', 'top')
      } finally {
        this.loading.close()
      }
    },
    async updateContent() {
      if (this.content.title.length < 1 || this.content.content.length < 1) {
        this.alertMessage = 'Campos não podem ficar vazio'
        this.isAlertModalOpen = true
        return
      }

      if (isNaN(parseFloat(this.content.number))) {
        this.number = 0
      }

      this.loading.show()

      try {
        this.content.number = Number(this.content.number)
        const res = await UpdateContent(this.content, this.tutorial)

        if (res.status == 1) {
          this.cleanContent()
          this.notify(res.message, 'error', 'top')
          this.isModalOpen = false
          return
        }

        this.message = `Updated content "${this.content.title}" in tutorial "${this.tutorial}"`
        this.cleanContent()
        this.listContents(this.tutorial.tutorial)
        this.scrollToElement(this.tutorial.title)
        this.isModalOpen = false
        this.isModalGitOpen = true
        this.notify(res.message, 'success', 'top')
        setTimeout(() => this.focus('message'), 100)
      } catch(error) {
        console.error(error)
        this.notify(error, 'error', 'top')
      } finally {
        this.loading.close()
      }
    },
    async deleteContent() {
      this.loading.show()

      try {
        const res = await DeleteContent(this.content.id, this.tutorial)

        if (res.status == 1) {
          this.cleanContent()
          this.notify(res.message, 'error', 'top')
          this.isModalOpen = false
          return
        }

        this.notify(res.message, 'success', 'top')
        this.message = `Deleted content "${this.content.title}" in tutorial "${this.tutorial}"`
        this.cleanContent()
        this.listContents()
        this.isConfirmModalOpen = false
        this.isModalGitOpen = true
        setTimeout(() => this.focus('message'), 100)
      } catch(error) {
        console.error(error)
        this.notify(error, 'error', 'top')
      } finally {
        this.loading.close()
      }
    },
    openAddContent() {
      this.cleanContent()
      this.titleModalContent = 'Adicionar Conteúdo'
      this.content.number = (this.contents.length + 1).toString()
      this.isModalOpen = true
      setTimeout(() => this.focus('title'), 100)
		},
    openEditContent(content) {
      this.cleanContent()
      this.showBtnAddContent = false
      this.showBtnUpdContent = true
      this.content = JSON.parse(JSON.stringify(content))
      this.titleModalContent = 'Editar Conteúdo'
      this.isModalOpen = true
      setTimeout(() => this.focus('title'), 100)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    openConfirmDeleteContent(content) {
      this.isConfirmModalOpen = true
      this.content.id = content.id
      this.content.title = content.title
    },
    cleanContent() {
      this.content = {
        number: '',
        title: '',
        content: ''
      }
      this.code = ''
      this.showBtnUpdContent = false
      this.showBtnAddContent = true
    },
    scrollToElement(id) {
      var element = document.getElementById(id)
      if (element != null) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    saveGit() {
      if (this.message.length < 1) {
        this.alertMessage = 'Mensagem não pode ficar vazia'
        this.isAlertModalOpen = true
        return
      }

      SendGit(this.message)
      .then(data => {
        this.notify(data, 'success', 'top')
        this.message = ''
        this.isModalGitOpen = false
        this.checkGitStatus()
      })
    },
    checkGitStatus() {
      const intervalId = setInterval(() => {
        GitStatus().then(status => {
          if (status) {
            clearInterval(intervalId)
            const type = status.includes("Erro") ? "error" : "success"
            this.notify(status, type, 'top')
          }
        })
      }, 500)

      setTimeout(() => clearInterval(intervalId), 30 * 1000)
    }
  }
}
</script>