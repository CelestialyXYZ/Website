import { createRouter, createWebHistory } from "vue-router"
import { useUIStore } from "@/stores/ui"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
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
      name: "object",
      component: () => import("../views/DsoObjectView.vue")
    },
    {
      path: "/objects/constellations/:id",
      name: "constellation",
      component: () => import("../views/CstObjectView.vue")
    },
    {
      path: "/objects/planets/:id",
      name: "planet",
      component: () => import("../views/PlanetView.vue")
    },
    {
      path: "/objects/moon",
      name: "moon",
      component: () => import("../views/MoonView.vue")
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFound.vue")
    }
  ]
})

export default router

router.beforeEach(() => {
  const uiStore = useUIStore()
  uiStore.isLoading = true
})

router.afterEach(() => {
  const uiStore = useUIStore()
  uiStore.isLoading = false
})
