import { compareByNumber, topFunction, scrollFunction, firstLoadTheme, setTheme } from "./libs/utils.js"

export default {
  template: `
    <label class="switch">
      <input type="checkbox" id="themeCheckbox" @change="setTheme($event)">
      <span class="slider"></span>
    </label>

    <div>
      <ul id="contentMenu">
        <div id="sidenav">
          <div id="logoHome">
            <router-link to="/">
              <svg fill="#d1d1d1" width="100px" height="100px" viewBox="-4.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.469 12.594l3.625 3.313c0.438 0.406 0.313 0.719-0.281 0.719h-2.719v8.656c0 0.594-0.5 1.125-1.094 1.125h-4.719v-6.063c0-0.594-0.531-1.125-1.125-1.125h-2.969c-0.594 0-1.125 0.531-1.125 1.125v6.063h-4.719c-0.594 0-1.125-0.531-1.125-1.125v-8.656h-2.688c-0.594 0-0.719-0.313-0.281-0.719l10.594-9.625c0.438-0.406 1.188-0.406 1.656 0l2.406 2.156v-1.719c0-0.594 0.531-1.125 1.125-1.125h2.344c0.594 0 1.094 0.531 1.094 1.125v5.875z"></path>
              </svg>
            </router-link>
          </div>
          <h2 id="summaryTitle">Summary</h2>
          <li id="summaryItem" v-for="command in commands">
            <a href="javascript:void(0)" @click="scrollToElement(command.title)">{{ command.number }} - {{ command.title }}</a>
          </li>
        </div>
      </ul>

      <div id="contentBody">
        <h1>{{ title }}</h1>
        <template v-for="command in commands">
          <h2 :id="command.title">{{ command.number }} - {{ command.title }}</h2>
          <div class="markdown-body" v-html="marked(command.content)"></div>
        </template>
      </div>
    </div>

    <button v-show="showBtnTop" @click="topFunction" id="btnTop" title="Go to top">Top</button>
  `,
  mounted() {
    this.renderTutorial()
    window.onscroll = () => this.scrollFunction()
    this.firstLoadTheme()
  },
  data() {
    return {
      showBtnTop: false,
      commands: [],
      title: ''
    }
  },
  methods: {
    compareByNumber,
    topFunction,
    scrollFunction,
    firstLoadTheme,
    setTheme,
    renderTutorial() {
      this.title = this.$route.params.tutorial
      this.showTutorialContent = true
      this.showMainContent = false
    
      fetch("../tutorial/data/" + this.title + ".json")
        .then(response => response.json())
        .then(json => {
          json.sort(this.compareByNumber)
          this.commands = json
        })
        .catch(err => console.log('Error in the request', err))
    },
    scrollToElement(id) {
      var element = document.getElementById(id)
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    marked(text) {
      return marked.parse(text)
    }
  }
}