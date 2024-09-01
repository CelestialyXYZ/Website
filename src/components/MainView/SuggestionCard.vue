<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

//define title, descriptors and img urls props
defineProps<{
  title: string
  descriptors: string
  img: string
}>()
</script>

<template>
  <Card class="overflow-clip cursor-pointer active:cursor-grabbing">
    <div class="w-full h-40">
      <img :src="img" class="w-full h-full object-cover" alt="Image de l'objet célèste" />
    </div>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>{{ descriptors }}</CardDescription>
    </CardHeader>
    <CardContent class="w-full flex gap-2 flex-wrap">
      <slot />
    </CardContent>
  </Card>
</template>
