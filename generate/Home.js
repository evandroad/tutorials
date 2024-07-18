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

    <button class="btn btn-success center" @click="openFormTutorial">
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
      showBtnEditTutorial: false,
      showBtnAddTutorial: true
    }
  },
  methods: {
    focus,
    firstLoadTheme,
    setTheme,
    listTutorials() {
      $.ajax({
        url: API + '/tutorial',
        method: 'get',
        success: data => {
          this.tutorials = data.sort(this.compareByNumber)
        },
        error: err => console.log(err)
      })
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
    
      $.ajax({
        url: API + '/tutorial',
        method: 'post',
        processData: false,
        contentType: false,
        data: fd,
        success: data => {
          this.message = `Added tutorial "${this.tutorial}"`
          this.number = ''
          this.tutorial = ''
          this.cleanImage()
          alert(data.message)
          this.listTutorials()
          $('#formTutorial').modal('hide')
          $('#modalGit').modal('show')
          setTimeout(() => this.focus('message'), 500)
        }
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
      this.image = event.target.files[0];
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
      document.querySelector("#image").value = ''
    },
    openFormTutorial() {
      this.titleModalTutorial = 'Adicionar Tutorial'
      this.cleanTutorial()
      this.number = this.tutorials.length + 1
      $('#formTutorial').modal('show')
      setTimeout(() => this.focus('tutorial'), 500)
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