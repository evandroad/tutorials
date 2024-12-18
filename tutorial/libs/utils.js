export function compareByNumber(a, b) {
  return a.number - b.number;
}

export function topFunction() {
  window.scrollTo({ behavior: 'smooth', top: 0 })
}

export function scrollFunction() {
  if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    this.showBtnTop = true
    return
  }

  this.showBtnTop = false
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