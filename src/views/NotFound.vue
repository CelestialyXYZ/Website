<script setup lang="ts">
import { Telescope } from "lucide-vue-next"
</script>

<template>
  <main class="text-center flex flex-col items-center mt-20 mb-40 px-10 md:px-20">
    <Telescope :size="120" />
    <h1 class="scroll-m-20 text-6xl font-bold tracking-tight lg:text-7xl mb-4 text-red-600">
      Erreur 404
    </h1>
    <p class="text-lg md:text-xl lg:text-2xl">
      Houston, nous avons un problème, la page que vous cherchez n'existe pas...
    </p>
  </main>
</template>
