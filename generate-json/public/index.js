export default {
  template: `
    <h1>{{ mainTitle }}</h1>

    <div v-if="page == 'tutorial'" id="formTutorial" class="col-sm-6 d">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Número:</span>
        </div>
        <input type="text" id="number" class="form-control" v-model="number">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Tutorial:</span>
        </div>
        <input type="text" id="tutorial" class="form-control" v-model="tutorial">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Imagem:</span>
        </div>
        <input type="file" id="image" class="form-control" v-model="image" @change="handleImageChange">
      </div>
      <div class="form-group gap">
        <button v-show="showBtnAddTutorial" class="btn btn-success" @click="createTutorial">Criar Tutorial</button>
        <button v-show="showBtnEditTutorial" class="btn btn-success" @click="updateTutorial">Editar Tutorial</button>
        <button class="btn btn-primary" @click="cleanTutorial">Limpar</button>
      </div>
    </div>

    <div v-if="page == 'tutorial'" id="tableTutorials" class="col-sm-6 d">
      <table id="tutorials" class="table">
        <thead>
          <th>Número</th>
          <th>Tutoriais</th>
          <th>Editar</th>
          <th>Ir</th>
          <th>Apagar</th>
        </thead>
        <tbody>
          <tr v-for="tutorial in tutorials">
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

    <div v-if="page == 'content'" id="formContent" class="col-sm-8 d">
      <button id="btnHome" class="btn btn-secondary" type="button" @click="home">Voltar</button>
      
      <h2 v-show="showTitleAddCont" style="text-align: center;">Adicionar Conteúdo</h2>
      <h2 v-show="showTitleUpdCont" style="text-align: center;">Alterar Conteúdo</h2>
      
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Number:</span>
        </div>
        <input type="text" id="contentNumber" v-model="contentNumber" class="form-control">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Title:</span>
        </div>
        <input type="text" v-model="title" class="form-control">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Content:</span>
        </div>
        <textarea v-model="content" class="form-control" rows="3"></textarea>
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Code:</span>
        </div>
        <textarea v-model="code" class="form-control" rows="3"></textarea>
      </div>
      <div class="form-group gap">
        <button v-show="showBtnSaveContent" class="btn btn-success" type="button" @click="saveContent">Salvar</button>
        <button v-show="showBtnUpdContent" class="btn btn-success" type="button" @click="updateContent">Alterar</button>
        <button class="btn btn-primary" type="button" @click="cleanContent">Limpar</button>
      </div>
    </div>

    <div v-if="page == 'content'" id="tableContents" class="table-responsive col-lg-8 d">
      <h2 style="text-align: center;">Conteúdos</h2>
      <table id="contents" class="table table-sm table-hover table-condensed">
        <thead>
          <th>Number</th>
          <th>Title</th>
          <th>Content</th>
          <th>Code</th>
          <th>Adicionar</th>
          <th>Editar</th>
          <th>Apagar</th>
        </thead>
        <tbody>
          <template v-for="content in contents">
            <tr v-if="content.content.length < 1">
              <td>{{ content.number }}</td>
              <td>{{ content.title }}</td>
              <td></td>
              <td></td>
              <td>
                <a href='' @click.prevent="addContent(content)">
                  <i class='fa fa-plus-square' style='font-size: 25px'></i>
                </a>
              </td>
              <td class="goTutorial">
                <a href='' @click.prevent="editContent(content, {})">
                  <i class='fa fa-share' style='font-size: 25px'></i>
                </a>
              </td>
              <td class="deleteTutorial">
                <a href='' @click.prevent="deleteContent(command.id, content.title)">
                  <i class='fa fa-trash' style='font-size: 25px'></i>
                </a>
              </td>
              <td v-show="false">{{ tutorial.image }}</td>
            </tr>
            <tr v-for="command in content.content">
              <td>{{ content.number }}</td>
              <td>{{ content.title }}</td>
              <td>{{ command.content }}</td>
              <td>{{ command.code }}</td>
              <td>
                <a href='' @click.prevent="addContent(content)">
                  <i class='fa fa-plus-square' style='font-size: 25px'></i>
                </a>
              </td>
              <td class="goTutorial">
                <a href='' @click.prevent="editContent(content, command)">
                  <i class='fa fa-share' style='font-size: 25px'></i>
                </a>
              </td>
              <td class="deleteTutorial">
                <a href='' @click.prevent="deleteContent(command.id, content.title)">
                  <i class='fa fa-trash' style='font-size: 25px'></i>
                </a>
              </td>
              <td v-show="false">{{ tutorial.image }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  `,
  mounted() {
    this.focus('number')
    tutorial = ''

    if (window.location.hash == '#content') {
      if (sessionStorage.getItem('tutorial') != null) {
        tutorial = sessionStorage.getItem('tutorial')
      }
      this.goTutorial(tutorial)
      return
    }

		this.listTutorials()
	},
  data() {
    return {
      API: 'http://localhost:8081',
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
      id: '',
      content: '',
      code: '',
      currentTitle: '',
      mainTitle: 'Tutoriais',
      showBtnEditTutorial: false,
      showBtnAddTutorial: true,
      showTitleUpdCont: false,
      showBtnUpdContent: false,
      showTitleAddCont: true,
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
          this.number = ''
          this.tutorial = ''
          this.cleanImage()
          alert(data.message)
          this.listTutorials()
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
          this.number = ''
          this.tutorial = ''
          this.cleanImage()
          alert(data.message)
          this.listTutorials()
          this.showBtnAddTutorial = true
          this.showBtnEditTutorial = false
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
        }
      })
    },
    editTutorial(tutorial) {
      this.number = tutorial.number
      this.tutorial = tutorial.title
      this.currentTutorial = tutorial.title
      this.currentImage = tutorial.image
      this.showBtnAddTutorial = false
      this.showBtnEditTutorial = true
    },
    goTutorial(tutorial) {
      sessionStorage.setItem('tutorial', tutorial)
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
      var content = this.content
        .replaceAll('<', '&lt')
        .replaceAll('>', '&gt')
        .replaceAll('\n', '<br>')
      var code = this.code
        .replaceAll('<', '&lt')
        .replaceAll('>', '&gt')
        .replaceAll('\n', '<br>')
      
      if (this.title.length < 1 && (content.length < 1 || code.length < 1)) {
        alert('Campos não podem ficar vazio')
        return
      }

      if (isNaN(parseFloat(this.contentNumber))) {
        this.contentNumber = 0;
      }

      $.ajax({
        url: this.API + '/content',
        method: 'post',
        data: {tutorial: this.mainTitle, number: this.contentNumber, title: this.title, content: content, code: code},
        success: data => {
          alert(data.message)
          this.listContents(this.mainTitle)
          this.contentNumber = ''
          this.title = ''
          this.content = ''
          this.code = ''
          this.focus('contentNumber')
        }
      })
    },
    updateContent() {
      var content = this.content
        .replaceAll('<', '&lt')
        .replaceAll('>', '&gt')
        .replaceAll('\n', '<br>')
      var code = this.code
        .replaceAll('<', '&lt')
        .replaceAll('>', '&gt')
        .replaceAll('\n', '<br>')
      
      if (this.title.length < 1 && (content.length < 1 || code.length < 1)) {
        alert('Campos não podem ficar vazio')
        return
      }

      if (isNaN(parseFloat(this.contentNumber))) {
        this.contentNumber = 0;
      }

      $.ajax({
        url: this.API + '/content',
        method: 'put',
        data: {tutorial: this.mainTitle, id: this.id, number: this.contentNumber, title: this.title, content: content, code: code, oldTitle: this.currentTitle},
        success: data => {
          alert(data.message)
          this.listContents(this.mainTitle)
          this.addContent({})
          this.contentNumber = ''
          this.title = ''
          this.content = ''
          this.code = ''
          this.focus('contentNumber')
        }
      })
    },
    deleteContent(id, title) {
      var response = confirm("Você deseja apagar o conteúdo do " + title + "?")
      
      if (!response) {
        return
      }

      $.ajax({
        url: `${this.API}/content/${id}/${this.mainTitle}/${title}`,
        method: 'delete',
        success: (data) => {
          alert(data.message)
          this.listContents(tutorial)
        }
      })
    },
    addContent(content) {
      this.cleanContent()
      this.showBtnSaveContent = true
      this.showTitleAddCont = true
      this.showBtnUpdContent = false
      this.showTitleUpdCont = false
      this.contentNumber = content.number
      this.title = content.title
    },
    editContent(content, command) {
      this.cleanContent()
      this.showBtnSaveContent = false
      this.showTitleAddCont = false
      this.showBtnUpdContent = true
      this.showTitleUpdCont = true
      this.contentNumber = content.number
      this.title = content.title
      this.currentTitle = content.title
      this.id = command.id
      this.content = command.content
      this.code = command.code
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
    cleanContent() {
      this.contentNumber = ''
      this.title = ''
      this.content = ''
      this.code = ''
      this.showBtnUpdContent = false
      this.showBtnSaveContent = true
      this.showTitleAddCont = true
      this.showTitleUpdCont = false
    },
    cleanImage() {
      document.querySelector("#image").value = ''
    },
    focus(input) {
      document.querySelector(`#${input}`).focus()
    }
  }
}