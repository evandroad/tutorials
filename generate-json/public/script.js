export default {
  template: `
    <div v-if="page == 'tutorial'" id="formTutorial" class="col-sm-6 d">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Número:</span>
        </div>
        <input type="text" id="number" class="form-control">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Tutorial:</span>
        </div>
        <input type="text" id="tutorial" class="form-control">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Imagem:</span>
        </div>
        <input type="file" id="image" class="form-control">
      </div>
      <div class="form-group">
        <button id="btnAddTutorial" class="btn btn-success" onclick="createTutorial()">Criar Tutorial</button>
        <button id="btnEditTutorial" class="btn btn-success" onclick="editTutorial()">Editar Tutorial</button>
        <button class="btn btn-primary" onclick="cleanTutorial()">Limpar</button>
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
      </table>
    </div>

    <div v-if="page == 'content'" id="formContent" class="col-sm-8 d">
      <button id="btnHome" class="btn btn-secondary" type="button" onclick="home()">Voltar</button>
      <h2 id="titleAddCont" style="text-align: center;">Adicionar Conteúdo</h2>
      <h2 id="titleUpdCont" style="text-align: center;">Alterar Conteúdo</h2>
      <div id="divId" class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 80px">Id:</span>
        </div>
        <input type="text" id="id" class="form-control">
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
      <div class="form-group">
        <button id="btnUpda" class="btn btn-success" type="button" onclick="updateContent()">Alterar</button>
        <button id="btnSave" class="btn btn-success" type="button" onclick="saveContent()">Salvar</button>
        <button class="btn btn-primary" type="button" onclick="cleanContent()">Limpar</button>
        <button id="btnAdd" class="btn btn-secondary" type="button" onclick="addContent()">Retornar</button>
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
      </table>
    </div>
  `,
  mounted() {
		this.listTutorials()
	},
  data() {
    return {
      API: '../php/index.php',
      page: 'tutorial'
    }
  },
  methods: {
    listTutorials() {
      $.ajax({
        url: this.API + '/tutorial',
        method: 'get',
        success: data => {
          data.sort(this.compareByNumber)
          $('#tutorials tbody').remove()
          var table = document.querySelector('#tutorials')
          var tbody = document.createElement('tbody')
          data.forEach(item => {
            var tr = document.createElement('tr')
            var td = document.createElement('td')
            td.innerHTML = item.number
            tr.appendChild(td)
            var td = document.createElement('td')
            td.innerHTML = item.title
            tr.appendChild(td)
            var td = document.createElement('td')
            td.classList.add("editTutorial")
            td.innerHTML = "<a href='#'><i class='fa fa-pencil-square' style='font-size: 25px'></i></a>"
            tr.appendChild(td)
            var td = document.createElement('td')
            td.classList.add("goTutorial")
            td.innerHTML = "<a href='#'><i class='fa fa-share' style='font-size: 22px'></i></a>"
            tr.appendChild(td)
            var td = document.createElement('td')
            td.classList.add("deleteTutorial")
            td.innerHTML = "<a href='#'><i class='fa fa-trash' style='font-size: 25px'></i></a>"
            tr.appendChild(td)
            var td = document.createElement('td')
            td.innerHTML = item.image
            tr.appendChild(td)
            tbody.appendChild(tr)
          })
          table.appendChild(tbody)
          $('td:last-child()').hide()
        }
      })
    },
    compareByNumber(a, b) {
      return a.number - b.number;
    }
  }
}