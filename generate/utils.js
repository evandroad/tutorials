export const API = 'http://localhost:8080/api'

export function focus(input) {
  document.querySelector(`#${input}`).focus()
}

export function firstLoadTheme() {
  const element = document.getElementById('themeLink');
  
  if (element) {
    getTheme()
    return
  }

  var url = getTheme()

  const link = document.createElement('link')
  link.id = 'themeLink'
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}

function getTheme() {
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
    return 'libs/dark.css'
  }

  return 'libs/light.css'
}

export function setTheme(e) {
  if (e.target.checked) {
    localStorage.setItem('theme', 'light')
    document.getElementById('themeLink').setAttribute('href', 'libs/light.css')
  } else {
    localStorage.setItem('theme', 'dark')
    document.getElementById('themeLink').setAttribute('href', 'libs/dark.css')
  }
}

export function notify(message, type) {
  var x = document.getElementById("snackbar");
  x.innerText = message
  x.className = "show";
  x.style.backgroundColor = getColor(type)
  setTimeout(() => x.className = x.className.replace("show", ""), 3000)
}

function getColor(type) {
  switch (type) {
    case 'success':
      return '#09b809'
    case 'error':
      return '#f73535'
    case 'info':
      return '#35bdf3'
    case 'warning':
      return '#d3d014'
    default:
      return 'white'
  }
}