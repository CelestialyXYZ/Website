<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { watchOnce } from "@vueuse/core"
import { ref } from "vue"

import { api as viewerApi } from "v-viewer"

import type { MultipleImages } from "@/declare"

const emblaMainApi = ref<CarouselApi>()
const emblaThumbnailApi = ref<CarouselApi>()
const selectedIndex = ref(0)

const { images } = defineProps<{ images: MultipleImages }>()

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap())
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return
  emblaMainApi.value.scrollTo(index)
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return

  onSelect()
  emblaMainApi.on("select", onSelect)
  emblaMainApi.on("reInit", onSelect)
})

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement | null
  if (target === null) return

  const img = images.images.find((img) => img.filename === target.src)
  if (img === undefined) return

  const fallbackImgUrl = `https://cdn.statically.io/gh/CelestialyXYZ/Astronomy-images/main/images/not_available/fallback_${images.res}.jpg`
  img.filename = fallbackImgUrl
  target.src = fallbackImgUrl
}

const show = (initialIndex: number) => {
  viewerApi({
    images: images.images.map((elmt) => elmt.filename),
    options: {
      inline: false,
      initialViewIndex: initialIndex,
      title: false
    }
  })
  console.log(images.images.map((elmt) => elmt.filename))
}
</script>

<template>
  <div class="w-full flex flex-col items-center lg:px-8 xl:px-0 px-10">
    <Carousel class="relative" @init-api="(val) => (emblaMainApi = val)">
      <CarouselContent>
        <CarouselItem v-for="(image, index) in images.images" :key="index">
          <div @click="show(index)">
            <Card>
              <CardContent class="flex items-center justify-center p-0">
                <img
                  :src="image.filename"
                  :alt="image.description"
                  class="w-full rounded-xl"
                  @error="handleImageError"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    <Carousel class="relative w-full pt-3" @init-api="(val) => (emblaThumbnailApi = val)">
      <CarouselContent class="flex gap-2 ml-0">
        <CarouselItem
          v-for="(image, index) in images.images"
          :key="index"
          class="pl-0 basis-1/4 cursor-pointer"
          @click="onThumbClick(index)"
          @dblclick="show(index)"
        >
          <div class="p-1" :class="index === selectedIndex ? '' : 'opacity-50'">
            <Card>
              <CardContent class="flex items-center justify-center p-0">
                <img
                  :src="image.filename"
                  :alt="image.description"
                  class="w-full rounded-xl"
                  @error="handleImageError"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  </div>
</template>
