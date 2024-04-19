const API = '../php/index.php'
let currentTutorial
let currentImage

$(document).ready(function () {
	home()
})

function home() {
	listTutorials()
	$('#formContent').hide()
	$('#tableContents').hide()
	$('#formTutorial').show()
	$('#tableTutorials').show()
	$('#btnEditTutorial').hide()
	$('#mainTitle').text('Tutoriais')
	$('#btnAddTutorial').show()
}

function compareByNumber(a, b) {
	return a.number - b.number;
}

function listTutorials() {
	$.ajax({
		url: API + '/tutorial',
		method: 'get',
		success: data => {
			data.sort(compareByNumber)
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
}

function createTutorial() {
	var number = $('#number').val()
	var tutorial = $('#tutorial').val()
	var image = $('#image').prop('files')[0]

	if (isNaN(parseFloat(number))) {
		number = 0;
	}

	var fd = new FormData()
	fd.append('number', number)
	fd.append('tutorial', tutorial)
	fd.append('image', image)
	
	if (tutorial.length < 1) {
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
			$('#number').val('')
			$('#tutorial').val('')
			$('#image').val('')
			alert(data.message)
			listTutorials()
		}
	})
}

function editTutorial() {
	var number = $('#number').val()
	var tutorial = $('#tutorial').val()
	var image = $('#image').prop('files')[0]

	var fd = new FormData()
	fd.append('number', number)
	fd.append('tutorial', tutorial)
	fd.append('currentTutorial', currentTutorial)
	fd.append('currentImage', currentImage)
	fd.append('image', image)
	
	if (tutorial.length < 1 && fd.get('image').size === undefined) {
		alert('Os campos não podem ficar vazio')
		return
	}

	$.ajax({
		url: API + '/tutorial/update',
		method: 'post',
		processData: false,
		contentType: false,
		data: fd,
		success: data => {
			$('#number').val('')
			$('#tutorial').val('')
			$('#image').val('')
			alert(data.message)
			listTutorials()
			$('#btnEditTutorial').hide()
			$('#btnAddTutorial').show()
		}
	})
}

function deleteTutorial(tutorial) {
	$.ajax({
		url: API + '/tutorial/' + tutorial,
		method: 'delete',
		success: data => {
			alert(data.message)
			listTutorials()
		}
	})
}

$(document).on("click", ".editTutorial", function(){
	var data = $(this).closest('tr').find('td')
	number = data[0].innerHTML
	currentTutorial = data[1].innerHTML
	currentImage =  data[data.length - 1].innerHTML
	$('#number').val(number)
	$('#tutorial').val(currentTutorial)
	$('#btnEditTutorial').show()
	$('#btnAddTutorial').hide()
})

$(document).on("click", ".goTutorial", function(){
	var data = $(this).closest('tr').find('td')
	var tutorial = data[1].innerHTML

	$('#formContent').show()
	$('#tableContents').show()
	$('#formTutorial').hide()
	$('#tableTutorials').hide()
	$('#divId').hide()
	$('#titleUpdCont').hide()
	$('#btnUpda').hide()
	$('#btnAdd').hide()
	$('#mainTitle').text(tutorial)
	$('#contentNumber').focus()
	cleanContent()
	listContents(tutorial)
})

$(document).on("click", ".deleteTutorial", function() {
	var data = $(this).closest('tr').find('td')
	var tutorial = data[1].innerHTML

	var response = confirm("Você deseja apagar o tutorial " + tutorial + "?");

	if (response) {
		deleteTutorial(tutorial)
	}
})

function listContents(tutorial) {
	$.ajax({
		url: API + '/content/' + tutorial,
		method: 'get',
		success: data => {
			$('#contents tbody').remove()
			var table = document.querySelector('#contents')
			var tbody = document.createElement('tbody')
			data.forEach(command => {
				command.content.forEach(item => {
					var tr = document.createElement('tr')
					var td = document.createElement('td')
					td.innerHTML = item.id
					tr.appendChild(td)
					var td = document.createElement('td')
					td.innerHTML = command.number
					tr.appendChild(td)
					var td = document.createElement('td')
					td.innerHTML = command.title
					tr.appendChild(td)
					var td = document.createElement('td')
					td.innerHTML = item.content
					tr.appendChild(td)
					var td = document.createElement('td')
					td.innerHTML = item.code
					tr.appendChild(td)
					var td = document.createElement('td')
					td.classList.add("addContent")
					td.innerHTML = "<a href='#'><i class='fa fa-plus-square' style='font-size: 25px'></i></a>"
					tr.appendChild(td)
					var td = document.createElement('td')
					td.classList.add("updateContent")
					td.innerHTML = "<a href='#'><i class='fa fa-pencil-square' style='font-size: 25px'></i></a>"
					tr.appendChild(td)
					var td = document.createElement('td')
					td.classList.add("deleteContent")
					td.innerHTML = "<a href='#'><i class='fa fa-trash' style='font-size: 25px'></i></a>"
					tr.appendChild(td)
					tbody.appendChild(tr)
				});
			})
			table.appendChild(tbody)
			$('td:nth-child(1)').hide()
		}
	})
}

function saveContent() {
	var tutorial = $('#mainTitle').text()
	var number = $('#contentNumber').val()
	var title = $('#title').val()
	var content = $('#content').val()
		.replaceAll('<', '&lt')
		.replaceAll('>', '&gt')
		.replaceAll('\n', '<br>')
	var code = $('#code').val()
		.replaceAll('<', '&lt')
		.replaceAll('>', '&gt')
		.replaceAll('\n', '<br>')
	
	if (title.length < 1 && (content.length < 1 || code.length < 1)) {
		alert('Campos não podem ficar vazio')
		return
	}

	if (isNaN(parseFloat(number))) {
		number = 0;
	}

	$.ajax({
		url: API + '/content',
		method: 'post',
		data: {tutorial: tutorial, number: number, title: title, content: content, code: code},
		success: data => {
			alert(data.message)
			addContent()
			listContents(tutorial)
		}
	})
}

var oldTitle
function updateContent() {
	var tutorial = $('#mainTitle').text()
	var id = $('#id').val()
	var number = $('#contentNumber').val()
	var title = $('#title').val()
	var content = $('#content').val()
		.replaceAll('<', '&lt')
		.replaceAll('>', '&gt')
		.replaceAll('\n', '<br>')
	var code = $('#code').val()
		.replaceAll('<', '&lt')
		.replaceAll('>', '&gt')
		.replaceAll('\n', '<br>')
	
	if (title.length < 1 && (content.length < 1 || code.length < 1)) {
		alert('Campos não podem ficar vazio')
		return
	}

	$.ajax({
		url: API + '/content',
		method: 'put',
		data: {tutorial: tutorial, id: id, number: number, title: title, content: content, code: code, oldTitle: oldTitle},
		success: data => {
			alert(data.message)
			addContent()
			listContents(tutorial)
			oldTitle = ''
		}
	})
}

function addContent() {
	cleanContent()
	$('#btnAdd').hide()
	$('#titleUpdCont').hide()
	$('#btnUpda').hide()
	$('#titleAddCont').show()
	$('#btnSave').show()
	$('#contentNumber').focus()
}

$(document).on("click", ".addContent", function(){
	var data = $(this).closest('tr').find('td')
	var id = data[0].innerHTML
	var number = data[1].innerHTML
	var title = data[2].innerHTML
	$('#id').val(id)
	$('#contentNumber').val(number)
	$('#title').val(title)
	$('#content').val('')
	$('#code').val('')

	$('#titleAddCont').show()
	$('#titleUpdCont').hide()
	$('#btnSave').show()
	$('#btnAdd').show()
	$('#btnUpda').hide()
	$('#content').focus()
})

$(document).on("click", ".updateContent", function(){
	var data = $(this).closest('tr').find('td')
	var id = data[0].innerHTML
	var number = data[1].innerHTML
	var title = data[2].innerHTML
	var content = data[3].innerHTML
	var code = data[4].innerHTML
	$('#id').val(id)
	$('#contentNumber').val(number)
	$('#title').val(title)
	$('#content').val(content.replaceAll('<br>', '\n').replaceAll('&lt', '<').replaceAll('&gt', '>'))
	$('#code').val(code.replaceAll('<br>', '\n').replaceAll('&lt', '<').replaceAll('&gt', '>'))
	oldTitle = title

	$('#titleUpdCont').show()
	$('#btnUpda').show()
	$('#titleAddCont').hide()
	$('#btnSave').hide()
	$('#btnAdd').show()
})

$(document).on("click", ".deleteContent", function(){
	var data = $(this).closest('tr').find('td')
	var id = data[0].innerHTML
	var title = data[2].innerHTML
	var tutorial = $('#mainTitle').text()

	var r = confirm("Você deseja apagar o conteúdo do " + title + "?");
	if (r == true) {
		$.ajax({
			url: `${API}/content/${id}/${tutorial}/${title}`,
			method: 'delete',
			success: (data) => {
				alert(data.message)
				listContents(tutorial)
			}
		})
	}
})

function cleanTutorial() {
	$('#btnAddTutorial').show()
	$('#btnEditTutorial').hide()
	$('#number').focus()
	$('#number').val('')
	$('#tutorial').val('')
	$('#image').val('')
}

function cleanContent() {
	$('#number').val('')
	$('#contentNumber').val('')
	$('#title').val('')
	$('#content').val('')
	$('#code').val('')
}