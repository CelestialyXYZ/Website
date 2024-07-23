<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Search } from 'lucide-vue-next'
import MainLogo from './MainLogo.vue'
import NavigationComponent from './NavigationComponent.vue'

const router = useRouter()
</script>

<template>
  <nav class="px-7 pt-5 flex justify-between">
    <div class="inline-flex items-center">
      <RouterLink href="/">
        <MainLogo class="h-6 w-36 cursor-pointer" alt="Logo de Celestialy" />
      </RouterLink>
      <div class="relative inline-flex w-56 ml-7 items-center">
        <Input id="search" type="text" placeholder="Recherche"
          @keyup.enter="router.push({ name: 'search', query: { q: $event.target.value } })" class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
    </div>

    <div class="inline-flex">
      <NavigationComponent />

      <Button class="ml-5">Connexion</Button>
    </div>
  </nav>
</template>
