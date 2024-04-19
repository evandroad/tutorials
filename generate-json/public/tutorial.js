export default {
  template: `
    <div id="formTutorial" class="col-sm-6 d">
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

    <div id="tableTutorials" class="col-sm-6 d">
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
  `
}