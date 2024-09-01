<script setup lang="ts">
import { useRouter, RouterLink } from "vue-router"
import { ref } from "vue"

import { Input } from "@/components/ui/input"

import { Search } from "lucide-vue-next"
import MainLogo from "./MainLogo.vue"
import NavigationComponent from "./NavigationComponent.vue"

const router = useRouter()

const query = ref<string>("")
</script>

<template>
  <nav
    class="px-7 pt-5 flex flex-row justify-between md:justify-normal md:flex-col gap-5 lg:flex-row lg:gap-0 lg:justify-between items-center">
    <div class="inline-flex items-center bg-gree-500">
      <RouterLink to="/">
        <MainLogo class="h-6 w-36 cursor-pointer" alt="Logo de Celestialy" />
      </RouterLink>
      <div class="relative w-56 ml-7 items-center hidden sm:inline-flex">
        <Input id="search" type="text" placeholder="Recherche" v-model="query"
          @keyup.enter="router.push({ name: 'search', query: { q: query } })" class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer"
          @click="router.push({ name: 'search', query: { q: query } })">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
    </div>

    <NavigationComponent />
  </nav>
</template>


