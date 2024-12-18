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

let counter = 0

export function notify(message = '', type, position = '') {
  const style = document.createElement('style')
  style.textContent = getCss()
  document.head.appendChild(style)
  
  const snackbar = document.createElement("div")
  snackbar.id = 'snackbar' + counter.toString()
  document.body.appendChild(snackbar)

  if (position == 'bottom') {
    snackbar.style.bottom = '30px'
    snackbar.className = 'show-b'
  } else {
    snackbar.style.top = '30px'
    snackbar.className = 'show-t'
  }
  
  snackbar.innerText = message
  const { bg, cl} = getColor(type)
  snackbar.style.backgroundColor = bg
  snackbar.style.color = cl

  setTimeout(() => {
    snackbar.remove()
    style.remove()
  }, 3000)
}

function getColor(type) {
  switch (type) {
    case 'success':
      return { bg: '#09b809', cl: 'white' }
    case 'error':
      return { bg: '#f73535', cl: 'white' }
    case 'info':
      return { bg: '#35bdf3', cl: 'white' }
    case 'warning':
      return { bg: '#d3d014', cl: 'white' }
    default:
      return { bg: '#e6e6e6', cl: 'black' }
  }
}

function getCss() {
  return `
    #snackbar${counter.toString()} {
      visibility: hidden;
      min-width: 250px;
      margin-left: -125px;
      background-color: #d3d014;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 12px;
      position: fixed;
      z-index: 1;
      left: 50%;
      font-size: 16px;
      font-family: Arial, Helvetica, sans-serif;
    }
    #snackbar${counter.toString()}.show-t {
      visibility: visible;
      animation: fadein-t 0.5s, fadeout-t 0.5s 2.6s;
    }
    #snackbar${counter.toString()}.show-b {
      visibility: visible;
      animation: fadein-b 0.5s, fadeout-b 0.5s 2.6s;
    }
    @keyframes fadein-t {
      from {top: 0; opacity: 0;}
      to {top: 30px; opacity: 1;}
    }
    @keyframes fadeout-t {
      from {top: 30px; opacity: 1;}
      to {top: 0; opacity: 0;}
    }
    @keyframes fadein-b {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }
    @keyframes fadeout-b {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }
  `
} 