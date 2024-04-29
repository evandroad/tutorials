export default {
  template: `
    <div id="mainContainer" v-show="showMainContent">
      <h1>Tutorials</h1>
        
      <p id="description">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The idea of this project is to gather some important tutorials for those who are entering the world of programming and software development, as well as for those with more experience who have not memorized all the commands.</p>

      <section id="menuTutorials" class="gallery">
        <div class="card" v-for="card in mainCards">
          <img :src="'img/' + card.image"></img>
          <h2>{{ card.title }}</h2>
          <button class="btnTutorial" @click="renderTutorial(card.title)">Leia mais</button>
        </div>
      </section>
    </div>

    <button v-show="showBtnTop" @click="topFunction" id="btnTop" title="Go to top">Top</button>

    <div id="contentContainer" v-show="showTutorialContent">
      <ul id="contentMenu">
        <div class="sidenav">
          <div id="divHome">
            <a href="" @click.prevent="renderMain">
              <i class="fa fa-home" id="logoHome" style="font-size: 50px"></i>
            </a>
          </div>
          <h2 id="summary">Summary</h2>
          <li class="summaryItem" v-for="command in commands">
            <a href="javascript:void(0)" @click="scrollToElement(command.title)" class="linkMenu">{{ command.number }} - {{ command.title }}</a>
          </li>
        </div>
      </ul>

      <div id="contentBody" class="main">
        <h1>{{ title }}</h1>
        <template v-for="command in commands">
          <h2 :id="command.title">{{ command.number }} - {{ command.title }}</h2>
          <div class="markdown-body" v-html="marked(command.content)"></div>
        </template>
      </div>
    </div>
  `,
  mounted() {
    this.listMainCards()
    window.onscroll = () => this.scrollFunction()
  },
  data() {
    return {
      showMainContent: true,
      showTutorialContent: false,
      showBtnTop: false,
      mainCards: [],
      commands: [],
      title: ''
    }
  },
  methods: {
    listMainCards() {
      if (location.hash != '' && location.hash != '#home') {
        this.showMainContent = false
        var page = location.hash
        page = page.replace('#', '').replace('-', ' ')
        this.renderTutorial(page)
        return
      }
    
      this.renderMain()    
    },
    renderMain() {
      window.location.hash = '#home'
      this.showMainContent = true
      this.showTutorialContent = false
      fetch("data/tutorials.json")
        .then(response => response.json())
        .then(json => this.mainCards = json)
        .catch(err => console.log('Error in the request', err))
    },
    renderTutorial(page) {
      this.title = page
      window.location.hash = '#' + page.replaceAll(' ', '-')
      this.showTutorialContent = true
      this.showMainContent = false
    
      fetch("data/" + page + ".json")
        .then(response => response.json())
        .then(json => {
          json.sort(this.compareByNumber)
          console.log(json)
          this.commands = json
        })
        .catch(err => console.log('Error in the request', err))
    },
    compareByNumber(a, b) {
      return a.number - b.number;
    },
    scrollFunction() {
      if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        this.showBtnTop = true
        return
      }
    
      this.showBtnTop = false
    },
    topFunction() {
      window.scrollTo({ behavior: 'smooth', top: 0 })
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