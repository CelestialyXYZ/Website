import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/objects/dso/:id',
      name: 'objet',
      component: () => import('../views/ObjectView.vue')
    },
    {
      path: '/objects/moon',
      name: 'moon',
      component: () => import('../views/MoonView.vue')
    },
    {
      path: '/objects/planets/:id',
      name: 'planet',
      component: () => import('../views/PlanetView.vue')
    }
  ]
})

export default router
