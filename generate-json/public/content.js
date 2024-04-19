export default {
  template: `
    <div id="formContent" class="col-sm-8 d">
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

    <div id="tableContents" class="table-responsive col-lg-8 d">
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
  `
}