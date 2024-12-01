<script setup lang="ts">
import moment from "moment"

import { useSessionStore } from "@/stores/session"
import { Constellation } from "@/lib/astronomy/constellation"

import { CardDescription, CardTitle } from "@/components/ui/card"
import { Telescope, Compass, Heart } from "lucide-vue-next"
import type { ConstObject } from "@/declare"

import SkyPath from "../SkyPath.vue"
import { azimuthToDirection } from "@/lib/astronomy/utils"

const session = useSessionStore()

//define title, descriptors and img urls props
const { objectData } = defineProps<{
  objectData: ConstObject
}>()

var object: Constellation = new Constellation(objectData, session.getObserver())

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src =
      "https://cdn.statically.io/gh/CelestialyXYZ/Astronomy-images/main/images/not_available/fallback_500x300.jpg"
  }
}
</script>

<template>
  <div class="w-full sm:max-w-[45rem] overflow-clip border rounded-lg relative">
    <button class="absolute top-5 right-4 z-10">
      <Heart :size="24" class="hover:text-red-500 hover:fill-red-500" />
    </button>
    <RouterLink :to="`/objects/constellations/${objectData.id}`" class="flex flex-col sm:flex-row">
      <div class="w-full sm:w-2/3 aspect-video relative">
        <img
          :src="object.getImg()"
          class="w-full h-full rounded-lg object-cover invert blur-sm pointer-events-none"
          :alt="`Object image of ${objectData.iau_code?.toUpperCase()}`"
          @error="handleImageError"
        />
        <img
          :src="object.getImg()"
          class="w-full h-full rounded-lg object-contain invert absolute top-0 z-10"
          :alt="`Object image of ${objectData.iau_code?.toUpperCase()}`"
          @error="handleImageError"
        />
        <p class="absolute top-2 left-3 z-20 inline-flex items-center">
          <Telescope class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black">{{ objectData.iau_code }}</span>
        </p>

        <p class="absolute bottom-2 left-3 z-20 inline-flex items-center">
          <Compass class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black"
            >.
            {{ azimuthToDirection(object.getCulmination(moment(), 0.25).coords.azimuth, false) }}
          </span>
        </p>
      </div>
      <div class="p-4 w-full">
        <div class="pr-8 mb-4">
          <CardTitle>Constellation : {{ objectData.name_fr }}</CardTitle>
          <CardDescription>
            {{
              object.isVisibleAllDay(moment())
                ? "Lever : Jamais - Coucher : Jamais"
                : `Lever : ${object.getRise(moment()) ? object.getRise(moment())?.format("HH:mm") : "--:--"} - Coucher : ${object.getSet(moment()) ? object.getSet(moment())?.format("HH:mm") : "--:--"}`
            }}
            - Visibilité :
            {{
              object.isAltitudeVisible(moment(), 30)
                ? "Difficile"
                : `${object.getRiseAltitude(moment(), 30) ? object.getRiseAltitude(moment(), 30)?.format("HH:mm") : "--:--"} à ${object.getSetAltitude(moment(), 30) ? object.getSetAltitude(moment(), 30)?.format("HH:mm") : "--:--"}`
            }}
          </CardDescription>
        </div>

        <SkyPath
          :canvas-id="objectData.id"
          :canvas-height="300"
          :canvas-width="1000"
          :date="moment()"
          :sky-object="object"
          :show-moon="true"
        />
      </div>
    </RouterLink>
  </div>
</template>
