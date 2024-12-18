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
              <i class="fa fa-home" style="font-size: 50px"></i>
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
    
      fetch("data/" + this.title + ".json")
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