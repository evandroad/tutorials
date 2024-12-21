import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../components/HomeView.vue') },
  { path: '/:tutorial', name: 'tutorial', component: () => import('../components/TutorialView.vue') },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router