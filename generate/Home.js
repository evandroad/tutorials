import { API, focus, firstLoadTheme, setTheme, notify } from './utils.js'

export default {
  template: `
    <label class="switch">
      <input type="checkbox" id="themeCheckbox" @change="setTheme($event)">
      <span class="slider"></span>
    </label>

    <h1>Tutoriais</h1>

    <button class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition" @click="openFormTutorial">
      Adicionar
    </button>

    <div id="tableTutorials" class="col-sm-6 table-panel">
      <table id="tutorials" class="table">
        <thead>
          <th>Ícone</th>
          <th>Número</th>
          <th>Tutoriais</th>
          <th>Ir</th>
          <th>Editar</th>
          <th>Apagar</th>
        </thead>
        <tbody>
          <tr v-for="tutorial in tutorials">
            <td><img :src="'../tutorial/img/' + tutorial.image" style='height: 25px'></img></td>
            <td>{{ tutorial.number }}</td>
            <td>{{ tutorial.title }}</td>
            <td>
              <router-link :to="{ name: 'tutorial', params: { tutorial: tutorial.title }}">
                <i class='fa fa-share' style='font-size: 25px'></i>
              </router-link>
            </td>
            <td>
              <a href="" @click.prevent="editTutorial(tutorial)">
                <i class='fa fa-pencil-square' style='font-size: 25px'></i>
              </a>
            </td>
            <td>
              <a href="" @click.prevent="openConfirmDeleteTutorial(tutorial)">
                <i class='fa fa-trash' style='font-size: 25px'></i>
              </a>
            </td>
            <td v-show="false">{{ tutorial.image }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-gray-800 p-6 rounded-lg w-96">
        <h2 class="text-2xl mb-4 font-bold">{{ titleModalTutorial }}</h2>
        <div class="mb-4">
          <label class="block mb-2">Number</label>
          <input type="text" v-model="tutorial.number" id="number" class="w-full p-2 border rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600">
        </div>
        <div class="mb-4">
          <label class="block mb-2">Tutorial</label>
          <input type="text" v-model="tutorial.title" class="w-full p-2 border rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600">
        </div>
          <div class="mb-4">
          <label class="block mb-2">Imagem</label>
            <div class="flex items-center space-x-4">
            <input type="file" ref="fileInput" accept="image/*" @change="handleImageChange" class="hidden">
            <button type="button" @click="$refs.fileInput.click()" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
              Procurar
            </button>
            <span class="text-gray-700 truncate max-w-[200px]">
              {{ tutorial.image ? tutorial.image.name : 'Nenhum arquivo selecionado' }}
            </span>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="isModalOpen = false" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
          <button @click="createTutorial" v-show="showBtnAddTutorial" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
          <button @click="updateTutorial" v-show="showBtnEditTutorial" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Salvar</button>
        </div>
      </div>
    </div>

    <div v-if="isModalGitOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-gray-800 p-6 rounded-lg w-96">
        <h2 class="text-2xl mb-4 font-bold">Enviar para o Github</h2>
        <div class="mb-4">
          <label class="block mb-2">Mensagem:</label>
          <input type="text" class="w-full p-2 border rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring focus:ring-blue-600" v-model="message" id="message">
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="isModalGitOpen = false" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button @click="saveGit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Salvar
          </button>
        </div>
      </div>
    </div>

    <div v-if="isConfirmModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Confirmar Exclusão</h2>
        <p class="mb-6 text-gray-600">
          Tem certeza que deseja excluir o tutorial <span>{{ tutorial.title }}</span>?
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="isConfirmModalOpen = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Cancelar
          </button>
          <button @click="deleteTutorial" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Excluir
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="isAlertModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-gray-900 p-5 rounded-xl shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 text-gray-300">Aviso</h2>
        <p class="mb-6 text-gray-200">{{ alertMessage }}</p>
        <div class="flex justify-end space-x-3">
          <button @click="isAlertModalOpen = false" class="px-4 py-2 bg-blue-500 text-gray-300 rounded-lg hover:bg-blue-300 transition">Ok</button>
        </div>
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
      tutorials: [],
      currentTutorial: '',
	    currentImage: '',
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
        this.tutorial.number = 0;
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
        this.tutorial.number = ''
        this.tutorial.title = ''
        this.tutorial.image = null
        this.listTutorials()
        this.isModalOpen = false
        this.notify(data.message, 'success', 'top')
        this.isModalGitOpen = true
        setTimeout(() => this.focus('message'), 100)
      })
    },
    updateTutorial() {
      if (isNaN(parseFloat(this.number))) {
        this.number = 0;
      }
      
      var fd = new FormData()
      fd.append('number', this.number)
      fd.append('tutorial', this.tutorial)
      fd.append('currentTutorial', this.currentTutorial)
      fd.append('currentImage', this.currentImage)
      fd.append('image', this.image)

      if (this.tutorial.length < 1) {
        alert('Tutorial não pode ficar vazio')
        return
      }

      $.ajax({
        url: API + '/tutorial',
        method: 'put',
        processData: false,
        contentType: false,
        data: fd,
        success: data => {
          this.message = `Updated tutorial "${this.tutorial}"`
          this.number = ''
          this.tutorial = ''
          this.tutorial.image = null
          alert(data.message)
          this.listTutorials()
          this.showBtnAddTutorial = true
          this.showBtnEditTutorial = false
          $('#formTutorial').modal('hide')
          $('#modalGit').modal('show')
          setTimeout(() => this.focus('message'), 500)
        }
      })
    },
    deleteTutorial() {
      console.log(this.tutorial)
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
    openFormTutorial() {
      this.isModalOpen = true
      this.titleModalTutorial = 'Adicionar Tutorial'
      this.cleanTutorial()
      this.number = this.tutorials.length + 1
    },
    editTutorial(tutorial) {
      this.openFormTutorial()
      this.titleModalTutorial = 'Editar Tutorial'
      this.number = tutorial.number
      this.tutorial = tutorial.title
      this.currentTutorial = tutorial.title
      this.currentImage = tutorial.image
      this.showBtnAddTutorial = false
      this.showBtnEditTutorial = true
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
      setTimeout(() => this.focus('number'), 100)
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