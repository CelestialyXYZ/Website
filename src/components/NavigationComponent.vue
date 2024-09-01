<script setup lang="ts">
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from "@/components/ui/input"

import { useRouter, RouterLink } from "vue-router"
import { Check, MoonStar, Menu, Search } from "lucide-vue-next"
import { ref } from "vue"

const router = useRouter()

const query = ref<string>("")

const objectsNav: { title: string; href: string; description: string }[] = [
  {
    title: "Nébuleuses",
    href: "/search/nebulaes",
    description: "Voir les nébuleuses les plus remarquables du ciel."
  },
  {
    title: "Amas d'étoiles",
    href: "/search/clusters",
    description: "Voir les amas d'étoiles les plus intéressants."
  },
  {
    title: "Galaxies",
    href: "/search/galaxies",
    description: "Afficher les galaxies les plus importantes pour l'observation."
  },
  {
    title: "Restes de supernovas",
    href: "/search/supernovas",
    description: "Voir les restes de supernovas les plus intéressants."
  },
  {
    title: "Planètes",
    href: "/search/planetes",
    description: "Afficher les planètes de notre système solaire."
  },
  {
    title: "Constellations",
    href: "/search/constellations",
    description: "Voir les constellations les plus notables de notre univers."
  }
]

const toolsNav: { title: string; href: string; description: string }[] = [
  {
    title: "Planificateur",
    href: "/tools/planner",
    description: "Planifiez vos séances d'observation avec le planificateur Celestialy."
  },
  {
    title: "Simulateur & carte du ciel",
    href: "/tools/simulator",
    description: "Ouvrir le simulateur de champ de vision & la carte du ciel."
  },
  {
    title: "Calculs de formules",
    href: "/tools/formulas",
    description: "Calculez rapidement les résultats de formules."
  },
  {
    title: "Quizz constellations",
    href: "/tools/constellations-quiz",
    description: "Apprennez facilement les constellations avec le quizz Celestialy."
  }
]

const languages = ref<any>([
  {
    name: "Français",
    code: "fr",
    flag: "https://flagcdn.com/fr.svg"
  },
  {
    name: "English",
    code: "en",
    flag: "https://flagcdn.com/gb.svg"
  }
])

var currentLanguage = ref<string>("fr")

var isNavOpen = ref<boolean>(false)
</script>

<template>
  <main>
    <NavigationMenu class="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Prévisions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
              <li class="row-span-3">
                <NavigationMenuLink as-child>
                  <RouterLink
                    class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-t from-orange-500 to-cyan-900 p-6 no-underline outline-none focus:shadow-md"
                    to="/weather">
                    <MoonStar class="h-10 w-10" />
                    <div class="mb-2 mt-4 text-lg font-semibold">Météo</div>
                    <p class="text-sm leading-tight">
                      Voir la météo en direct pour planifier au mieux vos sessions d'observation.
                    </p>
                  </RouterLink>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink as-child>
                  <RouterLink to="/objects/sun"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">Heures solaires</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Accéder aux prévisions de lever/coucher du soleil.
                    </p>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <RouterLink to="/objects/moon"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">Prévisions lunaires</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Consulter la phase lunaire, le calendrier, etc...
                    </p>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <RouterLink to="/"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">Accueil</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Retourner à la page d'accueil du site web.
                    </p>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Objets</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li v-for="component in objectsNav" :key="component.title">
                <NavigationMenuLink as-child>
                  <RouterLink :to="component.href"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ component.description }}
                    </p>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Outils</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li v-for="component in toolsNav" :key="component.title">
                <NavigationMenuLink as-child>
                  <RouterLink :to="component.href"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ component.description }}
                    </p>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger><img src="https://flagcdn.com/fr.svg" class="w-6 rounded-md" />
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="w-[250px] p-4">
              <li v-for="language in languages" :key="language.code">
                <NavigationMenuLink as-child>
                  <div @click="currentLanguage = language.code"
                    class="select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center">
                    <Check v-if="language.code === currentLanguage" class="w-4 h-4 mr-4" />
                    <img :src="language.flag" class="w-6 rounded-md mr-4"
                      :class="{ 'ml-8': language.code !== currentLanguage }" />
                    <p class="text-sm font-medium leading-none">{{ language.name }}</p>
                  </div>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div>
      <Button class="md:hidden p-2" @click="isNavOpen = !isNavOpen">
        <Menu :size="30" />
      </Button>

      <div
        class="absolute top-20 right-0 left-0 z-50 bg-background overflow-hidden transition-all duration-300 ease-in-out md:hidden"
        :class="{ 'max-h-0': !isNavOpen, 'max-h-fit py-4 px-7': isNavOpen }">
        <div class="relative w-full items-center sm:hidden inline-flex">
          <Input id="search" type="text" placeholder="Recherche" v-model="query"
            @keyup.enter="() => { router.push({ name: 'search', query: { q: query } }); isNavOpen = false }"
            class="pl-10" />
          <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer"
            @click="() => { router.push({ name: 'search', query: { q: query } }); isNavOpen = false }">
            <Search class="size-6 text-muted-foreground" />
          </span>
        </div>

        <Accordion type="single" collapsible class="mt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Prévisions</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li>
                  <RouterLink to="/weather" @click="isNavOpen = false"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">Météo</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Voir la météo en direct pour planifier au mieux vos sessions d'observation.
                    </p>
                  </RouterLink>
                </li>

                <li>
                  <RouterLink to="/objects/sun" @click="isNavOpen = false"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">Heures solaires</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Accéder aux prévisions de lever/coucher du soleil.
                    </p>
                  </RouterLink>
                </li>

                <li>
                  <RouterLink to="/objects/moon" @click="isNavOpen = false"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">Prévisions lunaires</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Consulter la phase lunaire, le calendrier, etc...
                    </p>
                  </RouterLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Objets</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li v-for="component in objectsNav" :key="component.title">
                  <RouterLink :to="component.href" @click="isNavOpen = false"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ component.description }}
                    </p>
                  </RouterLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Outils</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li v-for="component in toolsNav" :key="component.title">
                  <RouterLink :to="component.href" @click="isNavOpen = false"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ component.description }}
                    </p>
                  </RouterLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Language</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li v-for="language in languages" :key="language.code"
                  @click="() => { currentLanguage = language.code; isNavOpen = false }"
                  class="select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center">
                  <Check v-if="language.code === currentLanguage" class="w-4 h-4 mr-4" />
                  <img :src="language.flag" class="w-6 rounded-md mr-4"
                    :class="{ 'ml-8': language.code !== currentLanguage }" />
                  <p class="text-sm font-medium leading-none">{{ language.name }}</p>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </main>
</template>

