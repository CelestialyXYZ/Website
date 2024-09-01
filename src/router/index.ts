import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { left: 0, top: 0, behavior: "smooth" }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue")
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue")
    },
    {
      path: "/thanks",
      name: "thanks",
      component: () => import("../views/ThanksView.vue")
    },
    {
      path: "/search",
      name: "search",
      component: () => import("../views/SearchView.vue")
    },
    {
      path: "/objects/dso/:id",
      name: "objet",
      component: () => import("../views/ObjectView.vue")
    },
    {
      path: "/objects/moon",
      name: "moon",
      component: () => import("../views/MoonView.vue")
    },
    {
      path: "/objects/planets/:id",
      name: "planet",
      component: () => import("../views/PlanetView.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFound.vue")
    }
  ]
})

export default router
