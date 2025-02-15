<template>
  <div class="w-full flex justify-center mt-4 mb-4">
    <h1 class="text-zinc-200 text-4xl font-medium">Tutorials</h1>
  </div>
  
  <div id="mainContainer" class="w-2/3 m-auto">
    <p id="description">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The idea of this project is to gather some important tutorials for those who are entering the world of programming and software development, as well as for those with more experience who have not memorized all the commands.</p>

    <section class="gallery mt-2">
       <div class="card" v-for="card in tutorials" :key="card.number">
        <img :src="card.image ? '/tutorial/img/' + card.image : '/tutorial/img/desconhecido.png'"/>
        <h2>{{ card.title }}</h2>
        <button>
          <router-link :to="{ name: 'tutorial', params: { tutorial: card.title }}">
            Leia mais
          </router-link>
        </button>
      </div>
    </section>
  </div>

  <button v-show="showBtnTop" @click="topFunction" id="btnTop" title="Go to top">Top</button>
</template>

<script>
import { focus, notify, Loading } from '../utils.js'
import { GetAllTutorials } from '../../wailsjs/go/main/App.js'

export default {
  name: 'HomeView',
  mounted() {
		this.listTutorials()
	},
  data() {
    return {
      tutorials: [],
      loading: new Loading()
    }
  },
  methods: {
    focus,
    notify,
    Loading,
    async listTutorials() {
      this.loading.show()

      try {
        const data = await GetAllTutorials()
        this.tutorials = data.sort((a, b) => a.number - b.number)
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      } finally {
        this.loading.close()
      }
    },
  }
}
</script>

<style scoped>
#mainContainer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 80%;
	margin: 10px auto;
}

#description {
  font-size: 1.2rem;
	text-align: justify;
}

.gallery {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	justify-items: center;
}

.card {
	background-color: #2b2b2b;
	border-radius: 12px;
	box-shadow: 2px 2px 4px 4px var(--color_3);
	margin: 10px;
	padding: 15px;
	min-width: 200px;
	max-width: 260px;
	flex-basis: 23%;
	flex-grow: 1;
}

.card img {
	display: block;
	margin: 0 auto;
	height: 5em;
	border-radius: 8px;
	object-fit: cover;
}

.card h2 {
	font-size: 18px;
	margin-top: 10px;
	text-align: center;
}

.card button {
	display: block;
	background: var(--color_2);
	font-size: 1em;
	border: 0;
	width: 100%;
}

.card button a {
	color: rgb(6, 125, 236);
	text-decoration: none;
}

.card button a:hover {
	color: rgb(2, 53, 129);
	cursor: pointer;
}

@media (max-width: 1200px) {
	.gallery {
		grid-template-columns: repeat(4, 1fr);
	}
}

@media (max-width: 992px) {
	.gallery {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 768px) {
	.gallery {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 480px) {
	.gallery {
		grid-template-columns: 1fr;
	}
}
</style>