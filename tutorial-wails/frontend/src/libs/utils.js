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

export class Theme {
  firstLoadTheme() {
    this._initTheme()

    const style = document.createElement('style')
    style.id = 'themeStyle'
    style.rel = 'stylesheet'
    document.head.appendChild(style)

    this.setTheme()
  }

  setTheme() {
    const themeStyle = document.getElementById('themeStyle')

    if (document.getElementById('themeCheckbox').checked) {
      localStorage.setItem('theme', 'light')
      themeStyle.innerHTML = this._getLightCSS()
    } else {
      localStorage.setItem('theme', 'dark')
      themeStyle.innerHTML = this._getDarkCSS()
    }
  }

  _initTheme() {
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
  }

  _getLightCSS() {
    return `
      :root {
        --color_1: #ffffff;
        --color_2: #fcfcfc;
        --color_3: #dddddd;
        --color_4: #929292;
        --color_5: #616161;
        --font: #222222;
      }
    `;
  }

  _getDarkCSS() {
    return `
      :root {
        --color_1: #222222;
        --color_2: #2b2b2b;
        --color_3: #181818;
        --color_4: #616161;
        --color_5: #929292;
        --font: #e0e0e0;
      }
    `;
  }
}