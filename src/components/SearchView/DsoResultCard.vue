<script setup lang="ts">
import { CardDescription, CardTitle } from "@/components/ui/card"

import { Telescope, Sparkles, Compass, Sun } from "lucide-vue-next"

//define title, descriptors and img urls props
defineProps<{
  title: string
  descriptors: string
  img: string
  identifier: string
  magnitude?: number
}>()
</script>

<template>
  <div class="w-full sm:max-w-[45rem] flex flex-col sm:flex-row overflow-clip border rounded-md">
    <div class="w-full sm:w-2/3 aspect-video relative">
      <img :src="img" class="w-full h-full object-cover" :alt="`Object image of ${identifier}`" />
      <p class="absolute top-2 left-3 z-20 inline-flex items-center">
        <Telescope class="w-4 h-4 drop-shadow-img shadow-black" />
        <span class="ml-1 text-shadow shadow-black">{{ identifier }}</span>
      </p>

      <p class="absolute top-2 right-3 z-20 inline-flex items-center">
        <Sparkles class="w-4 h-4 drop-shadow-img shadow-black" />
        <span class="ml-1 text-shadow shadow-black">TODO</span>
      </p>

      <p class="absolute bottom-2 left-3 z-20 inline-flex items-center">
        <Compass class="w-4 h-4 drop-shadow-img shadow-black" />
        <span class="ml-1 text-shadow shadow-black">TODO</span>
      </p>

      <p class="absolute bottom-2 right-3 z-20 inline-flex items-center">
        <Sun class="w-4 h-4 drop-shadow-img shadow-black" />
        <span class="ml-1 text-shadow shadow-black">Mag : {{ magnitude ? magnitude : "N/A" }}</span>
      </p>
    </div>
    <div class="p-4 w-full">
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ descriptors }}</CardDescription>

      <div class="w-full h-28 mt-3 rounded-md bg-violet-950 flex items-center justify-center">
        Altitude chart for the object (TODO)
      </div>
    </div>
  </div>
</template>
