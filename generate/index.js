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
              <input type="text" class="form-control" v-model="contentNumber" id="contentNumber">
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

    <button class="btn btn-success center" v-show="page == 'tutorial'" @click="openFormTutorial">
      Adicionar
    </button>

    <div v-if="page == 'tutorial'" id="tableTutorials" class="col-sm-6 table-panel">
      <table id="tutorials" class="table">
        <thead>
          <th>Ícone</th>
          <th>Número</th>
          <th>Tutoriais</th>
          <th>Editar</th>
          <th>Ir</th>
          <th>Apagar</th>
        </thead>
        <tbody>
          <tr v-for="tutorial in tutorials">
            <td><img :src="'../tutorial/img/' + tutorial.image" style='height: 25px'></img></td>
            <td>{{ tutorial.number }}</td>
            <td>{{ tutorial.title }}</td>
            <td>
              <a href="" @click.prevent="editTutorial(tutorial)">
                <i class='fa fa-pencil-square' style='font-size: 25px'></i>
              </a>
            </td>
            <td>
              <a href='#content' @click="goTutorial(tutorial.title)">
                <i class='fa fa-share' style='font-size: 25px'></i>
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
    
    <div class="buttons" v-show="page == 'content'">
      <button class="btn btn-secondary" type="button" @click="home">
        Voltar
      </button>
      <button class="btn btn-success" @click="openFormContent">
        Adicionar
      </button>
    </div>

    <div v-if="page == 'content'" id="tableContents" class="table-responsive col-lg-8 table-panel">
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
            <td class="goTutorial">
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
    this.tutorial = ''

    if (window.location.hash == '#content') {
      if (sessionStorage.getItem('tutorial') != null) {
        this.tutorial = sessionStorage.getItem('tutorial')
      }
      this.goTutorial(this.tutorial)
      return
    }

		this.listTutorials()
	},
  data() {
    return {
      API: 'http://localhost:8080/api',
      page: 'tutorial',
      tutorials: [],
      contents: [],
      number: '',
      tutorial: '',
      image: '',
      currentTutorial: '',
	    currentImage: '',
      contentNumber: '',
      title: '',
      content: '',
      currentTitle: '',
      message: '',
      mainTitle: 'Tutoriais',
      titleModalTutorial: 'Adicionar Tutorial',
      titleModalContent: 'Adicionar Conteúdo',
      showBtnEditTutorial: false,
      showBtnAddTutorial: true,
      showBtnUpdContent: false,
      showBtnAddContent: false,
      showBtnSaveContent: true
    }
  },
  methods: {
    listTutorials() {
      $.ajax({
        url: this.API + '/tutorial',
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
        url: this.API + '/tutorial',
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
        url: this.API + '/tutorial',
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
        url: this.API + '/tutorial/' + tutorial,
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
    goTutorial(tutorial) {
      sessionStorage.setItem('tutorial', tutorial)
      this.cleanTutorial()
      this.page = 'content'
      this.mainTitle = tutorial
      this.listContents(tutorial)
      setTimeout(() => this.focus('contentNumber'), 100)
    },
    home() {
      this.page = 'tutorial'
      this.mainTitle = 'Tutorial'
      window.location.hash = '#home'
      this.listTutorials()
      setTimeout(() => this.focus('number'), 0)
    },
    listContents(tutorial) {
      $.ajax({
        url: this.API + '/content/' + tutorial,
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

      if (isNaN(parseFloat(this.contentNumber))) {
        this.contentNumber = 0;
      }

      $.ajax({
        url: this.API + '/content',
        method: 'post',
        data: {tutorial: this.mainTitle, number: this.contentNumber, title: this.title, content: this.content},
        success: data => {
          this.message = `Added content "${this.title}" in tutorial [${this.mainTitle}]`
          alert(data.message)
          this.listContents(this.mainTitle)
          this.contentNumber = ''
          this.title = ''
          this.content = ''
          this.focus('contentNumber')
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

      if (isNaN(parseFloat(this.contentNumber))) {
        this.contentNumber = 0;
      }

      $.ajax({
        url: this.API + '/content',
        method: 'put',
        data: {tutorial: this.mainTitle, number: this.contentNumber, title: this.title, content: this.content, oldTitle: this.currentTitle},
        success: data => {
          this.message = `Updated content "${this.title}" in tutorial [${this.mainTitle}]`
          alert(data.message)
          this.listContents(this.mainTitle)
          this.scrollToElement(this.title)
          this.contentNumber = ''
          this.title = ''
          this.content = ''
          this.focus('contentNumber')
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
        url: `${this.API}/content/${this.mainTitle}/${content.title}`,
        method: 'delete',
        success: (data) => {
          this.message = `Deleted content "${content.title}" in tutorial [${this.mainTitle}]`
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
      this.contentNumber = content.number
      this.title = content.title
      this.currentTitle = content.title
      this.content = content.content
      this.titleModalContent = 'Editar Conteúdo'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    compareByNumber(a, b) {
      return a.number - b.number;
    },
    scrollToElement(id) {
      var element = document.getElementById(id)
      if (element != null) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    cleanTutorial() {
      this.focus('number')
      this.showBtnAddTutorial = true
      this.showBtnEditTutorial = false
      this.number = ''
      this.tutorial = ''
      this.image = ''
    },
    cleanContent() {
      this.contentNumber = ''
      this.title = ''
      this.content = ''
      this.code = ''
      this.showBtnUpdContent = false
      this.showBtnSaveContent = true
    },
    cleanImage() {
      document.querySelector("#image").value = ''
    },
    focus(input) {
      document.querySelector(`#${input}`).focus()
    },
    openFormTutorial() {
      this.titleModalTutorial = 'Adicionar Tutorial'
      this.cleanTutorial()
      this.number = this.tutorials.length + 1
      $('#formTutorial').modal('show')
      setTimeout(() => this.focus('tutorial'), 500)
		},
    openFormContent() {
      this.titleModalContent = 'Adicionar Conteúdo'
      this.cleanContent()
      this.contentNumber = this.contents.length + 1
      $('#formContent').modal('show')
      setTimeout(() => this.focus('title'), 500)
		},
    saveGit() {
      if (this.message.length < 1) {
        alert('Mensagem não pode ficar vazia')
        return
      }

      $.ajax({
        url: this.API + '/git',
        method: 'post',
        data: {message: this.message},
        success: data => {
          alert(data.message)
          this.message = ''
          $('#modalGit').modal('hide')
        }
      })
    },
    firstLoadTheme() {
      var url = this.getTheme()

      const link = document.createElement('link')
      link.id = 'themeLink'
      link.rel = 'stylesheet'
      link.href = url
      document.head.appendChild(link)
    },
    getTheme() {
      var theme = localStorage.getItem('theme')
      var check
      
      if (theme == null || theme == 'light') {
        check = true
        localStorage.setItem('theme', 'light')
      } else {
        check = false
        localStorage.setItem('theme', 'dark')
      }

      document.getElementById('themeCheckbox').checked = check
      
      if (!document.getElementById('themeCheckbox').checked) {
        return 'dark.css'
      }

      return 'light.css'
    },
    setTheme(e) {
      if (e.target.checked) {
        localStorage.setItem('theme', 'light')
        document.getElementById('themeLink').setAttribute('href', 'light.css')
      } else {
        localStorage.setItem('theme', 'dark')
        document.getElementById('themeLink').setAttribute('href', 'dark.css')
      }
    }
  }
}