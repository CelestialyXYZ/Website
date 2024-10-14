<script setup lang="ts">
import A from "aladin-lite"
import { raToHMS, decToDMS } from "./../lib/astronomy/utils"
import { toRefs, watch, ref } from "vue"

import AladinMenuBar from "./AladinMenuBar.vue"

const props = defineProps<{
  object: string
}>()

const { object } = toRefs(props)

const coords = ref<{ ra: number; dec: number; dragging: boolean }>({
  ra: 0,
  dec: 0,
  dragging: false
})

watch(object, () => {
  console.log(object.value)
  A.init.then(() => {
    let aladin = A.aladin("#aladin-lite-div", {
      fov: 4,
      target: object.value,
      projection: "STG",
      survey: "CDS/P/DSS2/color",
      cooFrame: "equatorial",
      showLayersControl: false,
      showFullscreenControl: false,
      showCooGridControl: false,
      showSimbadPointerControl: false,
      showCooGrid: false,
      showStatusBar: false,
      showFov: false,
      showProjectionControl: false,
      showReticle: false,
      showCooLocation: false,
      showFrame: false
    })
    //aladin.setCooGrid({ color: "#6D28D9", enabled: true })
    //aladin.setRotation(0)

    aladin.on(
      "positionChanged",
      (newCoords: { ra: number; dec: number; dragging: boolean }) => (coords.value = newCoords)
    )
  })
})
</script>

<template>
  <div class="relative">
    <div
      id="aladin-lite-div"
      class="w-full aspect-video overflow-clip rounded-xl border box-border"
    ></div>
    <AladinMenuBar class="absolute top-2 left-2" />
    <div class="absolute bottom-2 left-0 right-0 flex justify-center">
      <div class="py-1 px-3 rounded-md bg-background border text-sm text-red-500">
        Ra: {{ raToHMS(coords.ra) }} Dec: {{ decToDMS(coords.dec) }}
      </div>
    </div>
  </div>
</template>
