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
      
      <h2 id="titleAddCont" style="text-align: center;">Adicionar Conteúdo</h2>
      <h2 v-show="showTitleUpdCont" style="text-align: center;">Alterar Conteúdo</h2>
      
      <div id="divId" v-show="false" class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Id:</span>
        </div>
        <input type="text" v-model="id" class="form-control">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Number:</span>
        </div>
        <input type="text" id="contentNumber" class="form-control">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Title:</span>
        </div>
        <input type="text" id="title" class="form-control">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Content:</span>
        </div>
        <textarea id="content" class="form-control" rows="3"></textarea>
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Code:</span>
        </div>
        <textarea id="code" class="form-control" rows="3"></textarea>
      </div>
      <div class="form-group gap">
        <button v-show="showBtnUpdContent" class="btn btn-success" type="button" onclick="updateContent()">Alterar</button>
        <button id="btnSave" class="btn btn-success" type="button" onclick="saveContent()">Salvar</button>
        <button class="btn btn-primary" type="button" onclick="cleanContent()">Limpar</button>
        <button v-show="showBtnAddContent" class="btn btn-secondary" type="button" onclick="addContent()">Retornar</button>
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
            <tr v-for="command in content.content">
              <td>{{ content.number }}</td>
              <td>{{ content.title }}</td>
              <td>{{ command.content }}</td>
              <td>{{ command.code }}</td>
              <td>
                <a href='#'>
                  <i class='fa fa-plus-square' style='font-size: 25px'></i>
                </a>
              </td>
              <td class="goTutorial">
                <a href='#content' @click="goTutorial(tutorial.title)">
                  <i class='fa fa-share' style='font-size: 25px'></i>
                </a>
              </td>
              <td class="deleteTutorial">
                <a href='#'>
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
    document.querySelector("#number").focus()
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
      mainTitle: 'Tutoriais',
      showBtnEditTutorial: false,
      showBtnAddTutorial: true,
      showTitleUpdCont: false,
      showBtnUpdContent: false,
      showBtnAddContent: false
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
    listContents(tutorial) {
      $.ajax({
        url: this.API + '/content/' + tutorial,
        method: 'get',
        success: data => {
          this.contents = data
        }
      })
    },
    goTutorial(tutorial) {
      sessionStorage.setItem('tutorial', tutorial)
      this.page = 'content'
      this.mainTitle = tutorial
      this.listContents(tutorial)
      setTimeout(() => document.querySelector("#contentNumber").focus(), 100)
    },
    editTutorial(tutorial) {
      this.number = tutorial.number
      this.tutorial = tutorial.title
      this.currentTutorial = tutorial.title
      this.currentImage = tutorial.image
      this.showBtnAddTutorial = false
      this.showBtnEditTutorial = true
    },
    home() {
      this.page = 'tutorial'
      window.location.hash = '#home'
      this.listTutorials()
      setTimeout(() => document.querySelector("#number").focus(), 0)
    },
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    compareByNumber(a, b) {
      return a.number - b.number;
    },
    cleanTutorial() {
      this.showBtnAddTutorial = true
      this.showBtnEditTutorial = false
      document.querySelector("#number").focus()
      this.number = ''
      this.tutorial = ''
      this.image = ''
    },
    cleanImage() {
      document.querySelector("#image").value = ''
    }
  }
}