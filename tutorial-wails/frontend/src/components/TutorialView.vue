<template>
  <div class="w-full flex justify-center mt-4">
    <h1 class="text-4xl font-medium">{{ tutorial }}</h1>
  </div>

  <div>
    <ul id="contentMenu">
      <div id="sidenav">
        <div id="logoHome">
          <router-link to="/">
            <i class="fa fa-home" style="font-size: 50px"></i>
          </router-link>
        </div>
        <h2 id="summaryTitle">Summary</h2>
        <li id="summaryItem" v-for="content in contents" :key="content.number">
          <a href="javascript:void(0)" @click="scrollToElement(content.title)">{{ content.number }} - {{ content.title }}</a>
        </li>
      </div>
    </ul>

    <div id="contentBody">
      <h1>{{ title }}</h1>
      <template v-for="content in contents" :key="content.number">
        <h2 :id="content.title">{{ content.number }} - {{ content.title }}</h2>
        <div class="markdown-body" v-html="/*marked(*/content.content/*)*/"></div>
      </template>
    </div>
  </div>

  <button v-show="showBtnTop" @click="topFunction" id="btnTop" title="Go to top">Top</button>
</template>

<script>
import { focus, notify, Loading } from '../utils.js'
import { GetAllContents } from '../../wailsjs/go/main/App.js'

export default {
  name: 'TutorialView',
  mounted() {
    this.listContents()
  },
  data() {
    return {
      contents: [],
      loading: new Loading(),
    }
  },
  methods: {
    focus,
    notify,
    Loading,
    async listContents() {
      this.loading.show()

      try {
        this.tutorial = this.$route.params.tutorial
        
        const data = await GetAllContents(this.tutorial)
        this.contents = data
      } catch(error) {
        console.error('Erro ao buscar usuários:', error)
      } finally {
        this.loading.close()
      }
    },
    scrollToElement(id) {
      var element = document.getElementById(id)
      if (element != null) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
}
</script>

<style scoped>
#contentMenu {
	list-style-type: none;
	margin: 0px;
	margin-bottom: 20px;
}

#sidenav {
	height: 97.5%;
	width: 20%;
	position: fixed;
	z-index: 1;
	top: 0;
	left: 0;
	background-color: var(--color_3);
	overflow-x: hidden;
	padding-top: 20px;
	padding-left: 10px;
	padding-right: 10px;
}

@media screen and (max-height: 450px) {
	#sidenav {padding-top: 15px;}
	#sidenav a {font-size: 18px;}
}

#logoHome {
	display: flex;
	justify-content: center;
	align-items: center;
}

#logoHome i {
	color: var(--font);
}

#logoHome i:hover {
	color: var(--color_5);
	cursor: pointer;
}

#summaryTitle {
	color: var(--font);
	padding-left: 15px;
}

#summaryItem:hover {
	background-color: var(--color_2);
	border-radius: 5px;
}

#summaryItem a {
	padding: 6px 8px 6px 16px;
	text-decoration: none;
	font-size: 18px;
	color: var(--light);
	display: block;
}

/* CONTENT */

#contentBody {
	margin-bottom: 20px;
	background-color: var(--color_2);
	margin-left: 20%;
	font-size: 18px;
	padding: 0px 10px;
}

#btnTop {
	position: fixed;
	bottom: 20px;
	right: 25px;
	z-index: 99;
	border: none;
	outline: none;
	background-color: var(--color_3);
	color: var(--font);
	cursor: pointer;
	padding: 15px;
	border-radius: 10px;
	font-size: 25px;
}
  
#btnTop:hover {
	background-color: var(--color_4);
}

/* MARKDOWN */

.markdown-body {
  background-color: var(--color_2);
  color: var(--font);
}

.markdown-body p {
	width: 80%;
}

.markdown-body a {
  color: #0366d6;
}

.markdown-body pre {
  background: var(--color_3) !important;
  color: var(--font);
	width: 80%;
}

.markdown-body code {
  background: var(--color_3) !important;
  color: var(--font);
}

.markdown-body th {
	background-color: var(--color_1);
}

.markdown-body tbody tr:nth-child(odd) {
	background-color: var(--color_1);
}

.markdown-body tbody tr:nth-child(even) {
	background-color: var(--color_1);
}
</style>