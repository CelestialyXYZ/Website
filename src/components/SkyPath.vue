<script setup lang="ts">
import { SkyPath } from "@/lib/astronomy/skyPathCanvas"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu"

import { Download } from "lucide-vue-next"
import { onMounted, ref, watch } from "vue"
import { Moon } from "@/lib/astronomy/moon"
import { Sun } from "@/lib/astronomy/sun"
import { Dso } from "@/lib/astronomy/dso"
import { Constellation } from "@/lib/astronomy/constellation"
import moment, { type Moment } from "moment"
import { azimuthToDirection } from "@/lib/astronomy/utils"

var skyPath = ref<SkyPath>()

const { skyObject, canvasHeight, canvasWidth, canvasId, showMoon } = defineProps<{
  skyObject: Dso | Moon | Sun | Constellation
  canvasWidth: number
  canvasHeight: number
  canvasId: string
  showMoon?: boolean
}>()

let date = defineModel<Moment>("date", { required: true })
let direction = defineModel<string>("direction", { required: false })

onMounted(() => {
  skyPath.value = new SkyPath(`sky_path_${canvasId}`, skyObject, 0.25, moment(date.value), showMoon)
  direction.value = azimuthToDirection(skyPath.value.maxAltitudePosition.azimuth || 0, false)
  console.log(direction.value)
})

watch(date, () => {
  if (date.value) {
    skyPath.value?.changeDate(date.value)
    direction.value = azimuthToDirection(skyPath.value?.maxAltitudePosition.azimuth || 0, false)
  }
})
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <div class="border rounded-xl w-full overflow-clip relative mt-4 md:mt-0 cursor-ew-resize">
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
          :id="`sky_path_${canvasId}`"
          :width="canvasWidth"
          :height="canvasHeight"
          class="w-full"
        ></canvas>
        <p
          class="absolute left-0 right-0 z-20 text-center bottom transition-transform duration-75 pointer-events-none"
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
      <ContextMenuItem @click="skyPath?.download('image/png', `skyPath_${moment()}_moon.png`)">
        <Download :size="18" class="mr-3" /> Enregistrer l'image en PNG
      </ContextMenuItem>
      <ContextMenuItem @click="skyPath?.download('image/jpg', `skyPath_${moment()}_moon.jpg`)">
        <Download :size="18" class="mr-3" /> Enregistrer l'image en JPG
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
