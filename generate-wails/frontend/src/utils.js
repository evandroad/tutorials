export const API = 'http://localhost:8080/api'

export function focus(input) {
  document.querySelector(`#${input}`).focus()
}

let counter = 0
export function notify(message = '', type, position = '') {
  const style = document.createElement('style')
  style.textContent = getCssNotify()
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
  const { bg, cl} = getColorNotify(type)
  snackbar.style.backgroundColor = bg
  snackbar.style.color = cl

  setTimeout(() => {
    snackbar.remove()
    style.remove()
  }, 3000)
}

function getColorNotify(type) {
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

function getCssNotify() {
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

let overlay = null
let style = null

export function showLoading() {
  overlay = document.createElement('div')
  const modal = document.createElement('div')
  const message = document.createElement('div')
  const spinner = document.createElement('div')
  
  overlay.classList.add('overlay')
  modal.classList.add('modal')
  message.classList.add('message')
  message.innerText = 'Aguarde...'
  spinner.classList.add('spinner')

  modal.appendChild(message)
  modal.appendChild(spinner)
  overlay.appendChild(modal)
  document.body.appendChild(overlay)
  addStylesLoading()
}

export function closeLoading() {
  if (overlay) {
    overlay.remove()
    overlay = null
  }

  if (style) {
    style.remove()
    style = null
  }
}

function addStylesLoading() {
  style = document.createElement('style')
  style.innerHTML = `
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      display: flex;
      align-items: center;
      background-color: white;
      padding: 20px 30px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .message {
      font-size: 1.5rem;
      font-weight: 500;
      font-family: Arial, Helvetica, sans-serif;
      color: #2d2d2d;
      margin-right: 20px;
    }

    .spinner {
      border: 6px solid rgba(0, 0, 0, 0.1);
      border-top: 6px solid #3498db;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `
  document.head.appendChild(style)
}