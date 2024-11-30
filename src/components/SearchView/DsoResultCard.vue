<script setup lang="ts">
import { ref } from "vue"
import moment from "moment"

import { useSessionStore } from "@/stores/session"
import { Dso } from "@/lib/astronomy/dso"

import { CardDescription, CardTitle } from "@/components/ui/card"
import { Telescope, Sparkles, Compass, Sun, Heart } from "lucide-vue-next"
import type { DsoObject } from "@/declare"

import SkyPath from "../SkyPath.vue"

const session = useSessionStore()

//define title, descriptors and img urls props
const { objectData } = defineProps<{
  objectData: DsoObject
}>()

var object: Dso = new Dso(objectData, session.getObserver())

var objDirection = ref<string>("")

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
    <button class="absolute top-3 right-3 sm:top-5 sm:right-4 z-10">
      <Heart :size="24" class="hover:text-red-500 hover:fill-red-500" />
    </button>
    <RouterLink :to="`/objects/dso/${objectData.id}`" class="flex flex-col sm:flex-row">
      <div class="w-full sm:w-2/3 aspect-video relative">
        <img
          :src="object.getImg('500x300')"
          class="w-full h-full rounded-lg object-cover"
          :alt="`Object image of ${object.getMainIdentifier()}`"
          @error="handleImageError"
        />
        <p class="absolute top-2 left-3 z-20 inline-flex items-center">
          <Telescope class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black">{{ object.getMainIdentifier() }}</span>
        </p>

        <p class="absolute top-2 right-3 z-20 items-center hidden sm:inline-flex">
          <Sparkles class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black">TODO CONST IAU</span>
        </p>

        <p class="absolute bottom-2 left-3 z-20 inline-flex items-center">
          <Compass class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black">
            {{ objDirection }}
          </span>
        </p>

        <p class="absolute bottom-2 right-3 z-20 inline-flex items-center">
          <Sun class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black"
            >Mag : {{ objectData.v_magnitude ? objectData.v_magnitude : "N/A" }}</span
          >
        </p>
      </div>
      <div class="p-4 w-full">
        <div class="pr-8">
          <CardTitle>{{ object.getName() }}</CardTitle>
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
          :canvas-height="450"
          :canvas-width="1000"
          :date="moment()"
          :sky-object="object"
          :show-moon="true"
          :direction="objDirection"
        />
      </div>
    </RouterLink>
  </div>
</template>
