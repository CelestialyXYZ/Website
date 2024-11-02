<script setup lang="ts">
import { onMounted, ref } from "vue"
import moment from "moment"

import { useSessionStore } from "@/stores/session"
import { Constellation } from "@/lib/astronomy/constellation"
import { SkyPath } from "@/lib/astronomy/skyPathCanvas"
import { azimuthToDirection } from "@/lib/astronomy/utils"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Telescope, Compass, Download, Heart } from "lucide-vue-next"

const session = useSessionStore()

//define title, descriptors and img urls props
const { objectData } = defineProps<{
  objectData: ConstObject
}>()

var object: Constellation = new Constellation(objectData, session.getObserver())
var skyPath = ref<SkyPath>()

onMounted(() => {
  skyPath.value = new SkyPath(`sky_path_${objectData.id}`, object, 0.25)
})
</script>

<template>
  <div class="w-full sm:max-w-[45rem] overflow-clip border rounded-md relative">
    <button class="absolute top-5 right-4 z-50">
      <Heart :size="24" class="hover:text-red-500 hover:fill-red-500" />
    </button>
    <RouterLink :to="`/objects/constellations/${objectData.id}`" class="flex flex-col sm:flex-row">
      <div class="w-full sm:w-2/3 aspect-video relative">
        <img
          :src="object.getImg()"
          class="w-full h-full object-cover invert blur-sm pointer-events-none"
          :alt="`Object image of ${objectData.iau_code?.toUpperCase()}`"
        />
        <img
          :src="object.getImg()"
          class="w-full h-full object-contain invert absolute top-0 z-10"
          :alt="`Object image of ${objectData.iau_code?.toUpperCase()}`"
        />
        <p class="absolute top-2 left-3 z-20 inline-flex items-center">
          <Telescope class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black">{{ objectData.iau_code }}</span>
        </p>

        <p class="absolute bottom-2 left-3 z-20 inline-flex items-center">
          <Compass class="w-4 h-4 drop-shadow-img shadow-black" />
          <span class="ml-1 text-shadow shadow-black">{{
            azimuthToDirection(skyPath?.maxAltitudePosition.azimuth || 0, false)
          }}</span>
        </p>
      </div>
      <div class="p-4 w-full">
        <div class="pr-8">
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

        <ContextMenu>
          <ContextMenuTrigger>
            <div class="border w-full h-32 mt-3 rounded-md overflow-clip relative cursor-ew-resize">
              <div
                class="bg-primary h-full absolute w-[0.2rem] pointer-events-none"
                :style="{ left: `${skyPath?.label?.hourPercentage ?? 0}%` }"
              ></div>
              <div
                class="absolute w-4 h-4 bg-white z-10 rounded-full border-[0.2rem] border-primary pointer-events-none"
                :style="{
                  left: `calc(${skyPath?.label?.hourPercentage ?? 0}% - 0.4rem)`,
                  bottom: `calc(${skyPath?.label?.altitudePercentage ?? 0}% - 0.5rem)`
                }"
              ></div>
              <canvas
                :id="`sky_path_${objectData.id}`"
                width="1000"
                height="450"
                class="w-full h-full"
              ></canvas>
              <p
                class="absolute left-0 right-0 z-20 text-center bottom transition-transform duration-75"
                style="text-shadow: 0px 0px 3px black"
                :class="{
                  'bottom-0': skyPath?.label?.coords?.altitude > 45,
                  'top-0': skyPath?.label?.coords?.altitude <= 45
                }"
              >
                {{ skyPath?.label?.text ?? "" }}
              </p>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              @click="
                skyPath?.download(
                  'image/png',
                  `skyPath_${moment()}_${objectData.iau_code?.toLowerCase()}.png`
                )
              "
            >
              <Download :size="18" class="mr-3" /> Enregistrer l'image en PNG
            </ContextMenuItem>
            <ContextMenuItem
              @click="
                skyPath?.download(
                  'image/jpg',
                  `skyPath_${moment()}_${objectData.iau_code?.toLowerCase()}.jpg`
                )
              "
            >
              <Download :size="18" class="mr-3" /> Enregistrer l'image en JPG
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </RouterLink>
  </div>
</template>
