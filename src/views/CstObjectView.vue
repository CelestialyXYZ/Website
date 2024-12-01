<script setup lang="ts">
import axios from "axios"
import { useRoute, useRouter } from "vue-router"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import { Bug, ExternalLink, Star, Download, Compass } from "lucide-vue-next"

import SelectInput from "@/components/ObjectView/SelectInput.vue"
import { onMounted, ref } from "vue"

import { Constellation } from "@/lib/astronomy/constellation"
import { useSessionStore } from "@/stores/session"
import moment from "moment"
import type { ConstObject } from "@/declare"

import SkyPath from "@/components/SkyPath.vue"

const route = useRoute()
const router = useRouter()
const session = useSessionStore()

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

const defaultData = {
  id: "",
  name_en: "loading",
  name_fr: "Chargement",
  name_latin: "",
  iau_code: "",
  declination: 0,
  right_ascension: 0,
  xata: {
    table: "constellations"
  }
}
const defaultConst: Constellation = new Constellation(defaultData, session.getObserver())

var object = ref<Constellation>(defaultConst)
var objectData = ref<ConstObject>(defaultData)
var objectAltAz = ref<{ altitude: number; azimuth: number }>(object.value.getAltAz(moment()))

setInterval(() => {
  objectAltAz.value = object.value.getAltAz(moment())
}, 1000)

const getConst = async () => {
  const response = await axios
    .get(`https://api.celestialy.xyz/v1/objects/constellations/${route.params.id}`)
    .catch((err) => {
      if (err.status == 404) {
        router.push("/404")
      }

      console.log(err)
      throw err // rethrow the error
    })

  if (response) {
    const { data } = response
    object.value = new Constellation(data, session.getObserver())
    objectData.value = data
  }
}

onMounted(() => {
  getConst()
})

function handleImageError(event: Event): void {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src =
      "https://cdn.statically.io/gh/CelestialyXYZ/Astronomy-images/main/images/not_available/fallback_900x900_inverted.jpg"
  }
}
</script>

<template>
  <main class="flex flex-col lg:flex-row lg:gap-8">
    <div class="m-auto max-w-lg md:max-w-2xl xl:max-w-2xl">
      <h2
        class="scroll-m-20 text-3xl mb-1 font-semibold tracking-tight transition-colors first:mt-0"
      >
        {{ objectData.name_fr }} ({{ objectData.iau_code }})
      </h2>

      <h4 class="scroll-m-20 text-lg text-muted-foreground tracking-tight mb-4 text-red-500">
        Constellation de l'hémisphère Sud
      </h4>

      <div
        class="rounded-xl border w-full overflow-hidden flex justify-center items-center relative"
      >
        <img
          :src="object.getImg()"
          :alt="`Image of ${objectData.iau_code?.toUpperCase()} constellation`"
          class="w-full md:w-4/5 invert"
          @error="handleImageError"
        />
        <img
          :src="object.getImg()"
          :alt="`Image of ${objectData.iau_code?.toUpperCase()} constellation`"
          class="object-cover absolute -z-10 blur-sm invert pointer-events-none"
          @error="handleImageError"
        />
      </div>

      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 mb-4 inline-flex items-center"
      >
        <Compass :size="26" class="mr-3" />
        Altitude dans le ciel
      </h2>

      <div class="w-full md:h-52 flex-col md:flex-row flex items-stretch justify-between gap-4">
        <div>
          <div class="grid grid-cols-2 md:grid-cols-1">
            <div>
              <h5 class="text-lg font-semibold">En direct</h5>
              <p>
                Alt : {{ objectAltAz.altitude.toFixed(2) }}° - Az :
                {{ objectAltAz.azimuth.toFixed(2) }}°
              </p>
            </div>

            <div>
              <h5 class="text-lg font-semibold mt-2">Aujourd'hui</h5>
              <p>
                Visibilité :
                {{
                  object.isAltitudeVisible(moment(), 30)
                    ? "Difficile"
                    : `${object.getRiseAltitude(moment(), 30) ? object.getRiseAltitude(moment(), 30)?.format("HH:mm") : "--:--"} - ${object.getSetAltitude(moment(), 30) ? object.getSetAltitude(moment(), 30)?.format("HH:mm") : "--:--"}`
                }}
              </p>
            </div>
          </div>

          <div class="text-red-500">
            <p class="inline-flex items-center mt-2">
              <label class="text-lg font-semibold" for="annual-mode">Mode annuel</label>
              <Switch
                class="ml-2"
                id="annual-mode"
                :checked="annualMode"
                @update:checked="annualMode = !annualMode"
                :disabled="true"
              />
            </p>

            <p :class="{ 'opacity-60': !annualMode }">Pour la position de l'objet</p>
            <div class="flex items-center">
              <p class="text-nowrap mr-2" :class="{ 'opacity-60': !annualMode }">chaque jour à</p>
              <SelectInput
                :values="hours"
                v-model="selectedAnnualyHour"
                suffix="h"
                :isDisabled="!annualMode"
              />
            </div>
          </div>
        </div>
        <div class="w-full">
          <SkyPath
            :canvas-id="objectData.id"
            :canvas-height="450"
            :canvas-width="1000"
            :date="moment()"
            :sky-object="object"
            :show-moon="true"
          />
        </div>
      </div>
    </div>
    <div class="m-auto w-full lg:m-0 max-w-lg md:max-w-2xl lg:w-72">
      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 lg:mt-0 mb-4 inline-flex items-center"
      >
        <Star :size="26" class="mr-3" />
        Informations
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
        <p>Ascension droite (J2000) : {{ object.getRaHMS() }}</p>
        <p>Déclinaison (J2000) : {{ object.getDecHMS() }}</p>

        <p>
          Lever / Coucher :
          {{
            object.isVisibleAllDay(moment())
              ? "Jamais"
              : `${object.getRise(moment()) ? object.getRise(moment())?.format("HH:mm") : "--:--"} - ${object.getSet(moment()) ? object.getSet(moment())?.format("HH:mm") : "--:--"}`
          }}
        </p>
      </div>

      <p class="text-md mt-4">Liens externes :</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 mt-2">
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          :href="`https://fr.wikipedia.org/wiki/${objectData.name_fr}`"
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
          :href="`https://www.google.com/search?q=${objectData.name_fr} constellation`"
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
          :href="`https://www.google.com/search?q=${objectData.name_fr} constellation&tbm=isch`"
        >
          <img
            src="https://favicone.com/google.com?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          Google Images
          <ExternalLink class="ml-2" :size="16" />
        </a>
      </div>

      <p class="text-md mt-4">Fichiers annexes :</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 mt-2">
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          :href="`https://cdn.statically.io/gh/CelestialyXYZ/Astronomy-images/main/images/constellations/pdf/${objectData.iau_code}.pdf`"
        >
          <img
            src="https://favicone.com/iau.org?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          {{ objectData.iau_code }}.pdf
          <Download class="ml-2" :size="16" />
        </a>
      </div>

      <Separator class="my-4" />

      <Button class="w-full inline-flex items-center" variant="secondary">
        <Bug :size="16" class="mr-2" /> Signaler une erreur
      </Button>
    </div>
  </main>
</template>
