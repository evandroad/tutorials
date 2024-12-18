import { API, focus, firstLoadTheme, setTheme } from './utils.js'

export default {
  template: `
    <div class="modal fade" id="formTutorial" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ titleModalTutorial }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Número:</label>
              <input type="text" class="form-control" v-model="number" id="number">
            </div>
            <div class="mb-3">
              <span class="form-label">Tutorial:</span>
              <input type="text" class="form-control" v-model="tutorial" id="tutorial">
            </div>
            <div class="mb-3">
              <span class="form-label">Imagem:</span>
              <input type="file" class="form-control" v-model="image" id="image" @change="handleImageChange">
            </div>
            <div class="form-group gap">
              <button v-show="showBtnAddTutorial" class="btn btn-success" @click="createTutorial">Criar Tutorial</button>
              <button v-show="showBtnEditTutorial" class="btn btn-success" @click="updateTutorial">Editar Tutorial</button>
              <button class="btn btn-primary" @click="cleanTutorial">Limpar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalGit" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Enviar para o Github</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Mensagem:</label>
              <input type="text" class="form-control" v-model="message" id="message">
            </div>
            <div class="form-group gap">
              <button class="btn btn-success" type="button" @click="saveGit">
                Salvar
              </button>
              <button class="btn btn-secondary" type="button" @click="closeGit">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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
              <a href="" @click.prevent="deleteTutorial(tutorial.title)">
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
        <h2 class="text-2xl mb-4 font-bold">{{ modalTitle }}</h2>
        <form>
          <div class="mb-4">
            <label class="block mb-2">Nome</label>
            <input type="text" v-model="currentUser.name" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <label class="block mb-2">Email</label>
            <input type="text" v-model="currentUser.email" class="w-full p-2 border rounded">
          </div>
           <div class="mb-4">
            <label class="block mb-2">Imagem de Perfil</label>
             <div class="flex items-center space-x-4">
              <input type="file" ref="fileInput" accept="image/*" @change="handleImageChange" class="hidden">
              <button type="button" @click="$refs.fileInput.click()" class="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
                Procurar
              </button>
              <span class="text-gray-600 truncate max-w-[200px]">
                {{ currentUser.image ? currentUser.image.name : 'Nenhum arquivo selecionado' }}
              </span>
            </div>
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="isModalOpen = false" class="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
              Cancelar
            </button>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isConfirmModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Confirmar Exclusão</h2>
        <p class="mb-6 text-gray-600">
          Tem certeza que deseja excluir o usuário 
          <span>{{ userToDelete ? userToDelete.name : '' }}</span>?
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="isConfirmModalOpen = false" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Cancelar
          </button>
          <button @click.prevent="deleteUser(userToDelete.id)" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Excluir
          </button>
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
      number: '',
      tutorial: '',
      image: '',
      currentTutorial: '',
	    currentImage: '',
      message: '',
      titleModalTutorial: 'Adicionar Tutorial',
      isModalOpen: false,
      isConfirmModalOpen: false,
      showBtnEditTutorial: false,
      showBtnAddTutorial: true,
      currentUser: {
        id: null,
        name: '',
        email: '',
        image: null,
      }
    }
  },
  methods: {
    focus,
    firstLoadTheme,
    setTheme,
    listTutorials() {
      fetch(API + '/tutorial')
      .then(res => res.json())
      .then(data => this.tutorials = data.sort(this.compareByNumber))
      .catch(err => console.log(err))
    },
    createTutorial() {
      if (isNaN(parseFloat(this.number))) {
        this.number = 0;
      }
    
      var fd = new FormData()
      fd.append('number', this.number)
      fd.append('tutorial', this.tutorial)
      fd.append('image', this.image)
      
      if (this.tutorial.length < 1) {
        alert('Tutorial não pode ficar vazio')
        return
      }
    
      if (fd.get('image').size === undefined) {
        alert('Selecione uma imagem.')
        return
      }

      fetch(API + '/tutorial', {
        method: 'POST',
        body: fd
      })
      .then(res => res.json())
      .then(data => {
        this.message = `Added tutorial "${this.tutorial}"`
        this.number = ''
        this.tutorial = ''
        this.cleanImage()
        this.listTutorials()
        this.isModalOpen = false
        alert(data.message)
        // $('#modalGit').modal('show')
        // setTimeout(() => this.focus('message'), 500)
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
          this.cleanImage()
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
    deleteTutorial(tutorial) {
      var response = confirm("Você deseja apagar o tutorial " + tutorial + "?");

      if (!response) {
        return
      }

      $.ajax({
        url: API + '/tutorial/' + tutorial,
        method: 'delete',
        success: data => {
          alert(data.message)
          this.listTutorials()
          this.message = `Deleted tutorial "${tutorial}"`
          $('#modalGit').modal('show')
          setTimeout(() => this.focus('message'), 500)
        }
      })
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
    handleImageChange(event) {
      this.currentUser.image = event.target.files[0]
    },
    compareByNumber(a, b) {
      return a.number - b.number;
    },
    cleanTutorial() {
      this.focus('number')
      this.showBtnAddTutorial = true
      this.showBtnEditTutorial = false
      this.number = ''
      this.tutorial = ''
      this.image = ''
    },
    cleanImage() {
      // document.querySelector("#image").value = ''
    },
    openFormTutorial() {
      this.isModalOpen = true
      this.currentUser.image = null
      // this.titleModalTutorial = 'Adicionar Tutorial'
      // this.cleanTutorial()
      // this.number = this.tutorials.length + 1
      // $('#formTutorial').modal('show')
      // setTimeout(() => this.focus('tutorial'), 500)
		},
    saveGit() {
      if (this.message.length < 1) {
        alert('Mensagem não pode ficar vazia')
        return
      }

      $.ajax({
        url: API + '/git',
        method: 'post',
        data: {message: this.message},
        success: data => {
          alert(data.message)
          this.message = ''
          $('#modalGit').modal('hide')
        }
      })
    },
    closeGit() {
      $('#modalGit').modal('hide')
    }
  }
}