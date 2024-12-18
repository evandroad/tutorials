import { compareByNumber, topFunction, scrollFunction, firstLoadTheme, setTheme } from "./libs/utils.js"

export default {
  template: `
    <label class="switch">
      <input type="checkbox" id="themeCheckbox" @change="setTheme($event)">
      <span class="slider"></span>
    </label>

    <div id="mainContainer">
      <h1>Tutorials</h1>
        
      <p id="description">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The idea of this project is to gather some important tutorials for those who are entering the world of programming and software development, as well as for those with more experience who have not memorized all the commands.</p>

      <section class="gallery">
        <div class="card" v-for="card in mainCards">
          <img :src="'img/' + card.image"></img>
          <h2>{{ card.title }}</h2>
          <!--<button @click="renderTutorial(card.title)">Leia mais</button>-->
          <button><router-link :to="{ name: 'tutorial', params: { tutorial: card.title }}">Leia mais</router-link></button>
        </div>
      </section>
    </div>

    <button v-show="showBtnTop" @click="topFunction" id="btnTop" title="Go to top">Top</button>
  `,
  mounted() {
    this.renderMain()
    window.onscroll = () => this.scrollFunction()

    this.firstLoadTheme()
  },
  data() {
    return {
      showBtnTop: false,
      mainCards: []
    }
  },
  methods: {
    compareByNumber,
    topFunction,
    scrollFunction,
    firstLoadTheme,
    setTheme,
    renderMain() {
      this.showMainContent = true
      this.showTutorialContent = false
      fetch("data/tutorials.json")
        .then(response => response.json())
        .then(json => this.mainCards = json)
        .catch(err => console.log('Error in the request', err))
    }
  }
}