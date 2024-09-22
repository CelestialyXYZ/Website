<script setup lang="ts">
import { CardDescription, CardTitle } from "@/components/ui/card"

//define title, descriptors and img urls props
defineProps<{
  title: string
  descriptors: string
  img: string
}>()
</script>

<template>
  <div class="w-full sm:max-w-[45rem] flex flex-col sm:flex-row overflow-clip border rounded-md">
    <div class="w-full sm:w-2/5 aspect-square relative">
      <img :src="img" class="w-full h-full object-cover" alt="Object image" />
    </div>
    <div class="p-4 w-full">
      <CardTitle>Constellation : {{ title }}</CardTitle>
      <CardDescription>{{ descriptors }}</CardDescription>

      <div class="w-full h-32 mt-3 rounded-md bg-violet-950 flex items-center justify-center">
        Altitude chart for the object (TODO)
      </div>
    </div>
  </div>
</template>
