<script setup lang="ts">
import TelescopeSimulator from "@/components/TelescopeSimulator.vue"

import axios from "axios"
import { useRoute, useRouter } from "vue-router"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu"

import { Telescope, Bug, ExternalLink, Star, Download } from "lucide-vue-next"

import SelectInput from "@/components/ObjectView/SelectInput.vue"
import { onMounted, ref } from "vue"

import { Dso } from "@/lib/astronomy/dso"
import { Sun } from "@/lib/astronomy/sun"
import { useSessionStore } from "@/stores/session"

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

var dsoTypes: { [key: string]: string } = {
  "*": "Étoile",
  "**": "Étoile double",
  "*Ass": "Association d'étoiles",
  OCl: "Amas ouvert",
  GCl: "Amas globulaire",
  "Cl+N": "Amas d'étoile et nébuleuse",
  G: "Galaxie",
  GPair: "Paire de galaxies",
  GTrpl: "Triplet de galaxies",
  GGroup: "Groupe de galaxie",
  PN: "Nébuleuse planétaire",
  HII: "Région ionisée HII",
  DrkN: "Nébuleuse sombre",
  EmN: "Nébuleuse à émission",
  Neb: "Nébuleuse",
  RfN: "Nébuleuse à réflexion",
  SNR: "Reste de supernovae",
  Nova: "Étoile novae",
  NonEx: "Objet non-existant",
  Dup: "Duplicata (voir notes)",
  Other: "Autre"
}

var hours = ref<string[]>([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23"
])
var annualMode = ref<boolean>(false)
var selectedAnnualyHour = ref<string>("0")

function downloadCanvasAsImage(canvasId: string, format: string, title: string) {
  let downloadLink = document.createElement("a")
  downloadLink.setAttribute("download", title)
  let canvas = document.getElementById(canvasId) as HTMLCanvasElement
  let dataURL = canvas.toDataURL(format)
  let url = dataURL.replace(/^data:image\/png/, "data:application/octet-stream")
  downloadLink.setAttribute("href", url)
  downloadLink.click()
}

function convertHoursToPixels(hours: number, maxPixels: number): number {
  if (hours >= 0 && hours <= 12) {
    return maxPixels / 2 + (hours / 12) * (maxPixels / 2)
  } else if (hours > 12 && hours <= 24) {
    return ((hours - 12) / 12) * (maxPixels / 2)
  } else {
    return -1 // Return -1 for invalid hours
  }
}

function drawSkyPathBackground(
  ctx: CanvasRenderingContext2D,
  sunRiseHours: number,
  sunSetHours: number,
  canvasWidth: number,
  canvasHeight: number,
  offsetHour: number,
  dayColor: string,
  duskColor: string,
  nightColor: string
): void {
  const hourInPx = canvasWidth / 24

  // Convert hours to x-coordinate pixels
  const sunriseHoursPx = convertHoursToPixels(sunRiseHours, canvasWidth)
  const sunsetHoursPx = convertHoursToPixels(sunSetHours, canvasWidth)

  //Set the color to skyColor
  ctx.fillStyle = dayColor
  //Draw the day section before sunset (left part)
  ctx.fillRect(0, 0, sunsetHoursPx - hourInPx * offsetHour + 3, canvasHeight) //add 3px offset
  //Draw the day section after sunset (right part)
  ctx.fillRect(
    sunriseHoursPx + hourInPx * offsetHour - 3,
    0,
    canvasWidth - sunriseHoursPx,
    canvasHeight
  ) //add 3px offset

  //Draw the night section
  ctx.fillStyle = nightColor
  ctx.fillRect(
    sunsetHoursPx,
    0,
    sunriseHoursPx - sunsetHoursPx - hourInPx * offsetHour,
    canvasHeight
  )

  //First left gradient from day to dusk
  //Register gradient
  const gradDayToDusk = ctx.createLinearGradient(
    sunsetHoursPx - hourInPx * offsetHour,
    0,
    sunsetHoursPx,
    0
  )
  gradDayToDusk.addColorStop(0, dayColor)
  gradDayToDusk.addColorStop(1, duskColor)
  //Draw gradient
  ctx.fillStyle = gradDayToDusk
  ctx.fillRect(sunsetHoursPx - hourInPx * offsetHour, 0, hourInPx * offsetHour, canvasHeight)

  //Second left gradient from dusk to night
  //Register gradient
  const gradDuskToNight = ctx.createLinearGradient(
    sunsetHoursPx - 1, //add 1px offset to fix black line issue
    0,
    sunsetHoursPx + hourInPx * offsetHour,
    0
  )
  gradDuskToNight.addColorStop(0, duskColor)
  gradDuskToNight.addColorStop(1, nightColor)
  //Draw gradient
  ctx.fillStyle = gradDuskToNight
  ctx.fillRect(sunsetHoursPx - 1, 0, hourInPx * offsetHour, canvasHeight) //add 1px offset to fix black line issue

  //First right gradient from night to dusk
  //Register gradient
  const gradNightToDusk = ctx.createLinearGradient(
    sunriseHoursPx - hourInPx * offsetHour,
    0,
    sunriseHoursPx,
    0
  )
  gradNightToDusk.addColorStop(0, nightColor)
  gradNightToDusk.addColorStop(1, duskColor)
  //Draw gradient
  ctx.fillStyle = gradNightToDusk
  ctx.fillRect(sunriseHoursPx - hourInPx * offsetHour, 0, hourInPx * offsetHour, canvasHeight)

  //Second right gradient from dusk to day
  //Register gradient
  const gradDuskToDay = ctx.createLinearGradient(
    sunriseHoursPx - 1, //add 1px offset
    0,
    sunriseHoursPx + hourInPx * offsetHour,
    0
  )
  gradDuskToDay.addColorStop(0, duskColor)
  gradDuskToDay.addColorStop(1, dayColor)
  //Draw gradient
  ctx.fillStyle = gradDuskToDay
  ctx.fillRect(sunriseHoursPx - 1, 0, hourInPx * offsetHour, canvasHeight) //add 1px offset

  /* //Set param for Sunset and Sunrise lines
      ctx.strokeStyle = "#0000FF" // Blue line for sunset
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])

      // Draw sunrise line
      ctx.beginPath()
      ctx.moveTo(sunriseHoursPx, 0)
      ctx.lineTo(sunriseHoursPx, height)
      ctx.stroke()

      // Draw sunset line
      ctx.beginPath()
      ctx.moveTo(sunsetHoursPx, 0)
      ctx.lineTo(sunsetHoursPx, height)
      ctx.stroke() */

  // Debugging logs
  console.log(`Sunrise at: ${sunRiseHours} hours (${sunriseHoursPx}px)`)
  console.log(`Sunset at: ${sunSetHours} hours (${sunsetHoursPx}px)`)
}

function drawSkyPathLines(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  altitude: number,
  stepHour: number
) {
  //Draw middle chart line
  ctx.strokeStyle = "#52525b"
  ctx.lineWidth = 2
  //Set the style to a dashed line
  ctx.setLineDash([10, 5])

  ctx.beginPath()
  ctx.moveTo(canvasWidth / 2, 0)
  ctx.lineTo(canvasWidth / 2, canvasHeight)
  ctx.stroke()

  //Draw minimum altitude line
  ctx.strokeStyle = "#22c55e"
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(0, canvasHeight - (altitude / 90) * canvasHeight)
  ctx.lineTo(canvasWidth, canvasHeight - (altitude / 90) * canvasHeight)
  ctx.stroke()

  //Draw path of the object line
  ctx.strokeStyle = "#dc2626"
  ctx.lineWidth = 3
  //Reset dashed line style
  ctx.setLineDash([])

  const path = object.value.getSkyPath(stepHour)

  ctx.beginPath()
  path.forEach((data, i) => {
    if (i == 0) {
      ctx.moveTo(0, canvasHeight - (data.altitude / 90) * canvasHeight)
    } else {
      ctx.lineTo(
        convertHoursToPixels(data.hour, canvasWidth),
        canvasHeight - (data.altitude / 90) * canvasHeight
      )
    }
    console.log(
      `x: ${convertHoursToPixels(data.hour, canvasWidth)}, y: ${canvasHeight - (data.altitude / 90) * canvasHeight}, hour: ${data.hour}, altitude: ${data.altitude}, date: ${data.time}`
    )
  })
  ctx.stroke()
}

function generateSkyPath(canvasId: string): void {
  const dayColor = "#0369a1"
  const duskColor = "#d97706"
  const nightColor = "#111111"

  const offsetHour = 1 //1 hour

  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (canvas) {
    const { width, height } = canvas.getBoundingClientRect()

    // Set the actual canvas size to match the display size
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.scale(dpr, dpr) // Scale canvas for high-DPI screens
      ctx.clearRect(0, 0, width, height) // Clear the canvas

      // Mock sunrise and sunset times (replace with actual Sun class)
      const sunRise = sun.getRise(new Date()) || new Date()
      const sunSet = sun.getSet(new Date()) || new Date()

      // Convert times to decimal hours
      const sunRiseHours = sunRise.getHours() + sunRise.getMinutes() / 60
      const sunSetHours = sunSet.getHours() + sunSet.getMinutes() / 60

      drawSkyPathBackground(
        ctx,
        sunRiseHours,
        sunSetHours,
        width,
        height,
        offsetHour,
        dayColor,
        duskColor,
        nightColor
      )

      drawSkyPathLines(ctx, width, height, 30, 0.25)

      //debugging logs
      console.log(`Canvas width: ${width}px, height: ${height}px`)
      console.log("REGLER PROBLEME FUSEAU HORAIRE DECALAGE GRAPHIQUE")
    }
  }
}

onMounted(() => {
  window.onresize = () => {
    generateSkyPath("skyPath")
  }
})

const defaultData = {
  name_en: "Loading...",
  declination: 0,
  right_ascension: 0
}
const defaultDso: Dso = new Dso(defaultData, session.getObserver())

var object = ref<Dso>(defaultDso)
var objectData = ref<DsoObject>(defaultData)
var objectAltAz = ref<{ altitude: number; azimuth: number }>(object.value.getAltAz(new Date()))

var sun = new Sun(session.getObserver())

setInterval(() => {
  objectAltAz.value = object.value.getAltAz(new Date())
}, 1000)

const getDso = async () => {
  const response = await axios
    .get(`https://api.celestialy.xyz/v1/objects/dso/${route.params.id}`)
    .catch((err) => {
      if (err.status == 404) {
        router.push("/404")
      }

      console.log(err)
      throw err // rethrow the error
    })

  if (response) {
    const { data } = response
    object.value = new Dso(data, session.getObserver())
    objectData.value = data

    generateSkyPath("skyPath")
  }
}

getDso()
</script>

<template>
  <main class="flex mt-10 px-8">
    <div class="m-auto max-w-lg md:max-w-2xl xl:max-w-2xl">
      <h2
        class="scroll-m-20 text-3xl mb-1 font-semibold tracking-tight transition-colors first:mt-0"
      >
        {{ object.getName(false) != null ? object.getName() : object.getMainIdentifier() }}
        -
        {{ dsoTypes[objectData?.type || "Other"] }}
        {{
          objectData?.type == "G" ||
          objectData?.type == "GPair" ||
          objectData?.type == "GTrpl" ||
          (objectData?.type == "GGroup" && objectData.hubble_type)
            ? ` (${objectData.hubble_type})`
            : ""
        }}
      </h2>

      <h4 class="scroll-m-20 text-lg text-muted-foreground tracking-tight mb-4">
        Constellation :
        <a href=" #" class="underline text-primary font-semibold">Orion</a>
      </h4>

      <img
        :src="object.getImg('1920x1280')"
        :alt="`Image of ${object.getName()}`"
        class="rounded-xl border w-full"
      />

      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 mb-4 inline-flex items-center"
      >
        <Star :size="26" class="mr-3" />
        Altitude annuelle/journalière
      </h2>

      <div class="flex justify-between w-full h-52">
        <div class="w-56 h-full pr-4">
          <h5 class="text-lg font-semibold">En direct</h5>
          <p>
            Alt : {{ objectAltAz.altitude.toFixed(2) }}° - Az :
            {{ objectAltAz.azimuth.toFixed(2) }}°
          </p>

          <h5 class="text-lg font-semibold mt-2">Aujourd'hui</h5>
          <p class="text-red-500">Visibilité : 18h32 - 2h28</p>

          <p class="inline-flex items-center mt-2">
            <label class="text-lg font-semibold" for="annual-mode">Mode annuel</label>
            <Switch
              class="ml-2"
              id="annual-mode"
              :checked="annualMode"
              @update:checked="annualMode = !annualMode"
            />
          </p>

          <p :class="{ 'text-muted-foreground': !annualMode }">Pour la position de l'objet</p>
          <div class="flex items-center">
            <p class="text-nowrap mr-2" :class="{ 'text-muted-foreground': !annualMode }">
              chaque jour à
            </p>
            <SelectInput
              :values="hours"
              v-model="selectedAnnualyHour"
              suffix="h"
              :isDisabled="!annualMode"
            />
          </div>
        </div>

        <ContextMenu>
          <ContextMenuTrigger>
            <canvas id="skyPath" class="border rounded-xl !w-full h-full"></canvas>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem @click="downloadCanvasAsImage('skyPath', 'image/png', 'skyPath.png')">
              <Download :size="18" class="mr-3" /> Enregistrer l'image en PNG
            </ContextMenuItem>
            <ContextMenuItem @click="downloadCanvasAsImage('skyPath', 'image/jpg', 'skyPath.jpg')">
              <Download :size="18" class="mr-3" /> Enregistrer l'image en JPG
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 mb-4 inline-flex items-center"
      >
        <Telescope :size="26" class="mr-3" />
        Simulateur de vue
      </h2>
      <TelescopeSimulator :object="object.getMainIdentifier()" />
    </div>
    <div class="w-72">
      <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Informations</h3>
      <p class="mt-3">Ascension droite (J2000) : {{ object.getRaHMS() }}</p>
      <p class="mt-1">Déclinaison (J2000) : {{ object.getDecHMS() }}</p>
      <p class="mt-1" v-if="objectData?.type">Type : {{ dsoTypes[objectData.type] }}</p>
      <p class="mt-1" v-if="objectData?.hubble_type">Type Hubble : {{ objectData.hubble_type }}</p>
      <p class="mt-1" v-if="objectData?.messier">Messier : {{ objectData.messier.join(", ") }}</p>
      <p class="mt-1" v-if="objectData?.new_general_catalog">
        NGC : {{ objectData.new_general_catalog.join(", ") }}
      </p>
      <p class="mt-1" v-if="objectData?.index_catalog">
        IC : {{ objectData.index_catalog.join(", ") }}
      </p>

      <p class="mt-1" v-if="objectData?.v_magnitude">
        Magnitude visuelle : {{ objectData.v_magnitude }}
      </p>

      <p class="mt-1" v-if="objectData?.position_angle">
        Inclinaison : {{ objectData.position_angle }} °
      </p>

      <p class="mt-1">
        Lum. de surface : {{ objectData?.surface_brightness || "N/A" }} mag/arcsec²
      </p>

      <p class="mt-1">Redshift : {{ objectData?.redshift || "N/A" }}</p>

      <!--
      minor_axis
      major_axis
      posisition_angle
      b_magnitude
      h_magnitude
      k_magnitude
      surface_brightness
      hubble_type
      parallax
      proper_motion_ra
      proper_motion_dec
      radial_velocity
      redshift
      common_star_u_mag
      common_star_b_mag
      common_star_v_mag
      common_star_names
      ned_notes
      open_ngc_notes
      -->

      <p class="text-md mt-1">Identifiants :</p>
      <div class="mt-1 w-full flex gap-2 flex-wrap">
        <Badge
          variant="secondary"
          v-for="identifier in object.getIdentifiers()"
          :key="identifier"
          >{{ identifier }}</Badge
        >
      </div>

      <p class="text-md mt-4">Liens externes :</p>
      <div class="flex flex-col mt-1">
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          :href="`http://cdsportal.u-strasbg.fr/?target=${object.getMainIdentifier()}`"
        >
          <img
            src="https://favicone.com/cdsportal.u-strasbg.fr?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          CDS Portal
          <ExternalLink class="ml-2" :size="16" />
        </a>
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          :href="`https://simbad.cds.unistra.fr/simbad/sim-basic?Ident=${object.getMainIdentifier()}`"
        >
          <img
            src="https://favicone.com/simbad.cds.unistra.fr?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          SIMBAD
          <ExternalLink class="ml-2" :size="16" />
        </a>
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          :href="`https://fr.wikipedia.org/wiki/${object.getMainIdentifier()}`"
        >
          <img
            src="https://favicone.com/fr.wikipedia.org?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          Wikipedia
          <ExternalLink class="ml-2" :size="16" />
        </a>
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          :href="`https://www.google.com/search?q=${object.getName()}`"
        >
          <img
            src="https://favicone.com/google.com?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          Google Search
          <ExternalLink class="ml-2" :size="16" />
        </a>
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          :href="`https://www.google.com/search?q=${object.getName()}&tbm=isch`"
        >
          <img
            src="https://favicone.com/google.com?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          Google Images
          <ExternalLink class="ml-2" :size="16" />
        </a>
      </div>

      <Separator class="my-4" />

      <Button class="w-full inline-flex items-center" variant="secondary">
        <Bug :size="16" class="mr-2" /> Signaler une erreur
      </Button>
    </div>
  </main>
</template>
