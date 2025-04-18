import { API, focus, firstLoadTheme, setTheme, notify } from './utils.js'

export default {
  template: `
    <div class="w-full">
      <label class="switch">
        <input type="checkbox" id="themeCheckbox" @change="setTheme($event)">
        <span class="slider"></span>
      </label>
    </div>
  
    <div class="w-full flex justify-center">
      <h1 class="text-4xl font-medium">Tutoriais</h1>
    </div>

    <div class="w-2/3 m-auto">
      <button @click="openAddTutorial" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition mb-2">
        Adicionar
      </button>
    </div>

    <div class="bg-zinc-800 shadow-md rounded-xl overflow-scroll w-2/3 m-auto">
      <table class="w-full">
        <thead class="bg-zinc-700 p-2">
          <th class="p-3" v-for="item in header">{{ item }}</th>
        </thead>
        <tbody>
          <tr v-for="tutorial in tutorials" class="border-zinc-600 border-b last:border-0">
            <td class="p-2"><img :src="'../tutorial/img/' + tutorial.image" style='height: 25px'></img></td>
            <td>{{ tutorial.number }}</td>
            <td>{{ tutorial.title }}</td>
            <td>
              <router-link :to="{ name: 'tutorial', params: { tutorial: tutorial.title }}">
                <svg width="30px" height="30px" class="text-zinc-200 hover:text-blue-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.4306 7.70172C7.55045 7.99826 3.43929 15.232 2.17021 19.3956C2.07701 19.7014 2.31139 20 2.63107 20C2.82491 20 3.0008 19.8828 3.08334 19.7074C6.04179 13.4211 12.7066 12.3152 15.514 12.5639C15.7583 12.5856 15.9333 12.7956 15.9333 13.0409V15.1247C15.9333 15.5667 16.4648 15.7913 16.7818 15.4833L20.6976 11.6784C20.8723 11.5087 20.8993 11.2378 20.7615 11.037L16.8456 5.32965C16.5677 4.92457 15.9333 5.12126 15.9333 5.61253V7.19231C15.9333 7.46845 15.7065 7.69133 15.4306 7.70172Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </router-link>
            </td>
            <td>
              <a href="" @click.prevent="openEditTutorial(tutorial)">
                <svg width="30px" height="30px" class="text-zinc-200 hover:text-yellow-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="m3.99 16.854-1.314 3.504a.75.75 0 0 0 .966.965l3.503-1.314a3 3 0 0 0 1.068-.687L18.36 9.175s-.354-1.061-1.414-2.122c-1.06-1.06-2.122-1.414-2.122-1.414L4.677 15.786a3 3 0 0 0-.687 1.068zm12.249-12.63 1.383-1.383c.248-.248.579-.406.925-.348.487.08 1.232.322 1.934 1.025.703.703.945 1.447 1.025 1.934.058.346-.1.677-.348.925L19.774 7.76s-.353-1.06-1.414-2.12c-1.06-1.062-2.121-1.415-2.121-1.415z" fill="currentColor"/>
                </svg>
              </a>
            </td>
            <td>
              <a href="" @click.prevent="openConfirmDeleteTutorial(tutorial)">
                <svg width="30px" height="30px" class="text-zinc-200 hover:text-red-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
            </td>
            <td v-show="false">{{ tutorial.image }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-zinc-800 p-6 rounded-lg w-96">
        <h2 class="text-2xl mb-4 font-bold">{{ titleModalTutorial }}</h2>
        <div class="mb-4">
          <label class="block mb-2">Number</label>
          <input type="text" v-model="tutorial.number" id="number" class="w-full p-2 border rounded bg-zinc-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600">
        </div>
        <div class="mb-4">
          <label class="block mb-2">Tutorial</label>
          <input type="text" v-model="tutorial.title" class="w-full p-2 border rounded bg-zinc-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600">
        </div>
          <div class="mb-4">
          <label class="block mb-2">Imagem</label>
            <div class="flex items-center space-x-4">
            <input type="file" ref="fileInput" accept="image/*" @change="handleImageChange" class="hidden">
            <button type="button" @click="$refs.fileInput.click()" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
              Procurar
            </button>
            <span class="text-gray-500 truncate max-w-[200px]">
              {{ tutorial.image ? tutorial.image.name : 'Nenhum arquivo selecionado' }}
            </span>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="isModalOpen = false" class="bg-zinc-300 text-black px-4 py-2 rounded hover:bg-zinc-400">Cancelar</button>
          <button @click="createTutorial" v-show="showBtnAddTutorial" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
          <button @click="updateTutorial" v-show="showBtnEditTutorial" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
        </div>
      </div>
    </div>

    <div v-if="isModalGitOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-zinc-800 p-6 rounded-lg w-96">
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
          Tem certeza que deseja excluir o tutorial <span>{{ tutorial.title }}</span>?
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="isConfirmModalOpen = false" class="px-4 py-2 bg-zinc-200 text-gray-700 rounded-lg hover:bg-zinc-300 transition">
            Cancelar
          </button>
          <button @click="deleteTutorial" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
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
  `,
  mounted() {
    this.firstLoadTheme()
		this.listTutorials()
	},
  data() {
    return {
      header: ['Ícone', 'Número', 'Tutoriais', 'Ir', 'Editar', 'Apagar'],
      tutorials: [],
	    currentImage: '',
      currentTutorial: '',
      message: '',
      alertMessage: '',
      titleModalTutorial: 'Adicionar Tutorial',
      isModalOpen: false,
      isModalGitOpen: false,
      isAlertModalOpen: false,
      isConfirmModalOpen: false,
      showBtnEditTutorial: false,
      showBtnAddTutorial: true,
      tutorial: {
        number: '',
        title: '',
        image: null,
      }
    }
  },
  methods: {
    focus,
    firstLoadTheme,
    setTheme,
    notify,
    listTutorials() {
      fetch(API + '/tutorial')
      .then(res => res.json())
      .then(data => this.tutorials = data.sort(this.compareByNumber))
      .catch(err => console.log(err))
    },
    createTutorial() {
      if (this.tutorial.title.length < 1) {
        this.alertMessage = 'Tutorial não pode ficar vazio'
        this.isAlertModalOpen = true
        return
      }

      if (this.tutorial.image == null) {
        this.alertMessage = 'Selecione uma imagem.'
        this.isAlertModalOpen = true
        return
      }

      if (isNaN(parseFloat(this.tutorial.number))) {
        this.tutorial.number = 0
      }
    
      var fd = new FormData()
      fd.append('number', this.tutorial.number)
      fd.append('tutorial', this.tutorial.title)
      fd.append('image', this.tutorial.image)

      fetch(API + '/tutorial', {
        method: 'POST',
        body: fd
      })
      .then(res => res.json())
      .then(data => {
        this.message = `Added tutorial "${this.tutorial.title}"`
        this.cleanTutorial()
        this.listTutorials()
        this.notify(data.message, 'success', 'top')
        this.isModalOpen = false
        this.isModalGitOpen = true
        setTimeout(() => this.focus('message'), 100)
      })
    },
    updateTutorial() {
      if (this.tutorial.title.length < 1) {
        this.alertMessage = 'Tutorial não pode ficar vazio'
        this.isAlertModalOpen = true
        return
      }

      if (isNaN(parseFloat(this.tutorial.number))) {
        this.tutorial.number = 0
      }
      
      var fd = new FormData()
      fd.append('number', this.tutorial.number)
      fd.append('tutorial', this.tutorial.title)
      fd.append('currentTutorial', this.currentTutorial)
      fd.append('currentImage', this.currentImage)
      fd.append('image', this.tutorial.image)

      fetch(API + '/tutorial', {
        method: 'PUT',
        body: fd
      })
      .then(res => res.json())
      .then(data => {
        this.message = `Updated tutorial "${this.tutorial.title}"`
        this.cleanTutorial()
        this.listTutorials()
        this.notify(data.message, 'success', 'top')
        this.isModalOpen = false
        this.isModalGitOpen = true
        setTimeout(() => this.focus('message'), 100)
      })
    },
    deleteTutorial() {
      fetch(API + '/tutorial/' + this.tutorial.title, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        this.notify(data.message, 'success', 'top')
        this.listTutorials()
        this.isConfirmModalOpen = false
        this.message = `Deleted tutorial "${this.tutorial.title}"`
        this.isModalGitOpen = true
        setTimeout(() => this.focus('message'), 100)
      })
    },
    openAddTutorial() {
      this.isModalOpen = true
      this.titleModalTutorial = 'Adicionar Tutorial'
      this.cleanTutorial()
      this.number = this.tutorials.length + 1
      setTimeout(() => this.focus('number'), 100)
    },
    openEditTutorial(tutorial) {
      this.cleanTutorial()
      this.isModalOpen = true
      this.titleModalTutorial = 'Editar Tutorial'
      this.tutorial = JSON.parse(JSON.stringify(tutorial))
      this.tutorial.image = null
      this.currentImage = tutorial.image
      this.currentTutorial = tutorial.title
      this.showBtnAddTutorial = false
      this.showBtnEditTutorial = true
      setTimeout(() => this.focus('number'), 100)
    },
    openConfirmDeleteTutorial(tutorial) {
      this.isConfirmModalOpen = true
      this.tutorial = tutorial
    },
    handleImageChange(event) {
      this.tutorial.image = event.target.files[0]
    },
    compareByNumber(a, b) {
      return a.number - b.number;
    },
    cleanTutorial() {
      this.showBtnAddTutorial = true
      this.showBtnEditTutorial = false
      this.tutorial = {
        number: '',
        title: '',
        image: null,
      }
    },
    saveGit() {
      if (this.message.length < 1) {
        this.alertMessage = 'Mensagem não pode ficar vazia'
        this.isAlertModalOpen = true
        return
      }

      fetch(API + '/git', {
        method: 'POST',
        body: JSON.stringify({ message: this.message })
      })
      .then(res => res.json())
      .then(data => {
        this.notify(data.message, 'success', 'top')
        this.message = ''
        this.isModalGitOpen = false
      })
    },
  }
}