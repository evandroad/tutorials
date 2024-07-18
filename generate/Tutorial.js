import { API, focus, firstLoadTheme, setTheme } from './utils.js'

export default {
  template: `
    <div class="modal fade" id="formContent" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ titleModalContent }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Número:</label>
              <input type="text" class="form-control" v-model="number" id="number">
            </div>
            <div class="mb-3">
              <span class="form-label">Título:</span>
              <input type="text" class="form-control" v-model="title" id="title">
            </div>
            <div class="mb-3">
              <span class="form-label">Conteúdo:</span>
              <textarea rows="8" class="form-control" v-model="content"></textarea>
            </div>
            <div class="form-group gap">
              <button v-show="showBtnSaveContent" class="btn btn-success" type="button" @click="saveContent">
                Salvar
              </button>
              <button v-show="showBtnUpdContent" class="btn btn-success" type="button" @click="updateContent">
                Alterar
              </button>
              <button class="btn btn-primary" type="button" @click="cleanContent">
                Limpar
              </button>
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

    <h1>{{ mainTitle }}</h1>

    <div class="buttons">
      <button id="back" class="btn btn-secondary" type="button" @click="home">
        <router-link to="/">Voltar</router-link>
      </button>
      <button class="btn btn-success" @click="openFormContent">
        Adicionar
      </button>
    </div>

    <div id="tableContents" class="table-responsive col-lg-8 table-panel">
      <h2 style="text-align: center;">Conteúdos</h2>
      <table id="contents" class="table table-sm table-hover table-condensed">
        <thead>
          <th>Number</th>
          <th>Title</th>
          <th>Content</th>
          <th>Editar</th>
          <th>Apagar</th>
        </thead>
        <tbody>
          <tr v-for="content in contents">
            <td>{{ content.number }}</td>
            <td :id="content.title">{{ content.title }}</td>
            <td>{{ content.content }}</td>
            <td>
              <a href='' @click.prevent="editContent(content)">
                <i class='fa fa-pencil-square' style='font-size: 25px'></i>
              </a>
            </td>
            <td class="deleteTutorial">
              <a href='' @click.prevent="deleteContent(content)">
                <i class='fa fa-trash' style='font-size: 25px'></i>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  mounted() {
    this.firstLoadTheme()
    this.listContents()
  },
  data() {
    return {
      contents: [],
      mainTitle: '',
      number: '',
      title: '',
      content: '',
      currentTitle: '',
      message: '',
      titleModalContent: 'Adicionar Conteúdo',
      showBtnUpdContent: false,
      showBtnAddContent: false,
      showBtnSaveContent: true
    }
  },
  methods: {
    focus,
    firstLoadTheme,
    setTheme,
    listContents() {
      this.mainTitle = this.$route.params.tutorial
      $.ajax({
        url: API + '/content/' + this.mainTitle,
        method: 'get',
        success: data => {
          this.contents = data
        }
      })
    },
    saveContent() {
      if (this.title.length < 1 || this.content.length < 1) {
        alert('Campos não podem ficar vazio')
        return
      }

      if (isNaN(parseFloat(this.number))) {
        this.number = 0;
      }

      $.ajax({
        url: API + '/content',
        method: 'post',
        data: {tutorial: this.mainTitle, number: this.number, title: this.title, content: this.content},
        success: data => {
          this.message = `Added content "${this.title}" in tutorial "${this.mainTitle}"`
          alert(data.message)
          this.listContents(this.mainTitle)
          this.number = ''
          this.title = ''
          this.content = ''
          this.focus('number')
          $('#formContent').modal('hide')
          $('#modalGit').modal('show')
          setTimeout(() => this.focus('message'), 500)
        }
      })
    },
    updateContent() {
      if (this.title.length < 1 || this.content.length < 1) {
        alert('Campos não podem ficar vazio')
        return
      }

      if (isNaN(parseFloat(this.number))) {
        this.number = 0;
      }

      $.ajax({
        url: API + '/content',
        method: 'put',
        data: {tutorial: this.mainTitle, number: this.number, title: this.title, content: this.content, oldTitle: this.currentTitle},
        success: data => {
          this.message = `Updated content "${this.title}" in tutorial "${this.mainTitle}"`
          alert(data.message)
          this.listContents(this.mainTitle)
          this.scrollToElement(this.title)
          this.number = ''
          this.title = ''
          this.content = ''
          this.focus('number')
          $('#formContent').modal('hide')
          $('#modalGit').modal('show')
          setTimeout(() => this.focus('message'), 500)
        }
      })
    },
    deleteContent(content) {
      var response = confirm("Você deseja apagar o conteúdo do " + content.title + "?")
      
      if (!response) {
        return
      }

      $.ajax({
        url: `${API}/content/${this.mainTitle}/${content.title}`,
        method: 'delete',
        success: (data) => {
          this.message = `Deleted content "${content.title}" in tutorial "${this.mainTitle}"`
          alert(data.message)
          this.listContents(this.mainTitle)
          $('#modalGit').modal('show')
          setTimeout(() => this.focus('message'), 500)
        }
      })
    },
    editContent(content) {
      this.cleanContent()
      this.openFormContent()
      this.showBtnSaveContent = false
      this.showBtnUpdContent = true
      this.number = content.number
      this.title = content.title
      this.currentTitle = content.title
      this.content = content.content
      this.titleModalContent = 'Editar Conteúdo'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    cleanContent() {
      this.number = ''
      this.title = ''
      this.content = ''
      this.code = ''
      this.showBtnUpdContent = false
      this.showBtnSaveContent = true
    },
    openFormContent() {
      this.titleModalContent = 'Adicionar Conteúdo'
      this.cleanContent()
      this.number = this.contents.length + 1
      $('#formContent').modal('show')
      setTimeout(() => this.focus('title'), 500)
		},
    scrollToElement(id) {
      var element = document.getElementById(id)
      if (element != null) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
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