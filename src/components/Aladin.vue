<script setup lang="ts">
import A from "aladin-lite"

import AladinMenuBar from "./AladinMenuBar.vue"

A.init.then(() => {
  let aladin = A.aladin("#aladin-lite-div", {
    fov: 4,
    target: "M42",
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
  //aladin.setCooGrid({ color: '#6D28D9', enabled: true });
})
</script>

<template>
  <div class="relative">
    <div
      id="aladin-lite-div"
      class="w-full aspect-video overflow-clip rounded-xl border box-border"
    ></div>
    <AladinMenuBar class="absolute top-2 left-2" />
  </div>
</template>
