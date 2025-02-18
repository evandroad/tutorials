import { compareByNumber, topFunction, scrollFunction, Theme } from "./libs/utils.js"

export default {
  template: `
    <label class="switch">
      <input type="checkbox" id="themeCheckbox" @change="theme.setTheme($event)">
      <span class="slider"></span>
    </label>
    
    <div class="header">
      <h1>Tutorials</h1>
    </div>
    
    <div id="mainContainer">
      <p id="description">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The idea of this project is to gather some important tutorials for those who are entering the world of programming and software development, as well as for those with more experience who have not memorized all the commands.</p>

      <section class="gallery">
        <div class="card" v-for="card in mainCards">
          <img :src="card.image ? '../tutorial/img/' + card.image : '../tutorial/img/desconhecido.png' "></img>
          <h2>{{ card.title }}</h2>
          <button><router-link :to="{ name: 'tutorial', params: { tutorial: card.title }}">Leia mais</router-link></button>
        </div>
      </section>
    </div>

    <button v-show="showBtnTop" @click="topFunction" id="btnTop" title="Go to top">Top</button>
  `,
  mounted() {
    this.renderMain()
    window.onscroll = () => this.scrollFunction()

    this.theme.firstLoadTheme()
  },
  data() {
    return {
      theme: new Theme,
      mainCards: [],
      showBtnTop: false
    }
  },
  methods: {
    compareByNumber,
    topFunction,
    scrollFunction,
    Theme,
    renderMain() {
      this.showMainContent = true
      this.showTutorialContent = false
      fetch("../tutorial/data/tutorials.json")
        .then(response => response.json())
        .then(json => this.mainCards = json)
        .catch(err => console.log('Error in the request', err))
    }
  }
}