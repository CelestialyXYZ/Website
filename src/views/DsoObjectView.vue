<script setup lang="ts">
import TelescopeSimulator from "@/components/TelescopeSimulator.vue"

import axios from "axios"
import { useRoute, useRouter } from "vue-router"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import { Telescope, Bug, ExternalLink, Star, Compass } from "lucide-vue-next"

import SelectInput from "@/components/ObjectView/SelectInput.vue"
import { onMounted, ref } from "vue"

import { Dso } from "@/lib/astronomy/dso"
import { useSessionStore } from "@/stores/session"
import moment from "moment"
import type { DsoObject, MultipleImages } from "@/declare"

import SkyPath from "@/components/SkyPath.vue"
import ImageViewer from "@/components/ImageViewer.vue"

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

const defaultData = {
  id: "",
  name_en: "loading",
  declination: 0,
  right_ascension: 0,
  xata: {
    table: ""
  }
}
const defaultDso: Dso = new Dso(defaultData, session.getObserver())

var object = ref<Dso>(defaultDso)
var objectData = ref<DsoObject>(defaultData)
var objectAltAz = ref<{ altitude: number; azimuth: number }>(object.value.getAltAz(moment()))

setInterval(() => {
  objectAltAz.value = object.value.getAltAz(moment())
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
  }
}

onMounted(async () => {
  await getDso()
  await getImages()
})

const images = ref<MultipleImages>({
  baseUrl: "",
  res: "1920x1280",
  images: []
})

async function getImages() {
  images.value = await object.value.getImgs("1920x1280")
}
</script>

<template>
  <main class="flex flex-col lg:flex-row lg:gap-8">
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

      <ImageViewer :images="images" />

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

      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 mb-4 inline-flex items-center"
      >
        <Telescope :size="26" class="mr-3" />
        Simulateur de vue
      </h2>
      <TelescopeSimulator :object="object.getMainIdentifier()" />
    </div>
    <div class="m-auto lg:m-0 max-w-lg md:max-w-2xl lg:w-72">
      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 lg:mt-0 mb-4 inline-flex items-center"
      >
        <Star :size="26" class="mr-3" />
        Informations
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
        <p>Ascension droite (J2000) : {{ object.getRaHMS() }}</p>
        <p>Déclinaison (J2000) : {{ object.getDecHMS() }}</p>
        <p v-if="objectData?.type">Type : {{ dsoTypes[objectData.type] }}</p>
        <p v-if="objectData?.hubble_type">Type Hubble : {{ objectData.hubble_type }}</p>
        <p v-if="objectData?.messier">Messier : {{ objectData.messier.join(", ") }}</p>
        <p v-if="objectData?.new_general_catalog">
          NGC : {{ objectData.new_general_catalog.join(", ") }}
        </p>
        <p v-if="objectData?.index_catalog">IC : {{ objectData.index_catalog.join(", ") }}</p>

        <p>
          Lever / Coucher :
          {{
            object.isVisibleAllDay(moment())
              ? "Jamais"
              : `${object.getRise(moment()) ? object.getRise(moment())?.format("HH:mm") : "--:--"} - ${object.getSet(moment()) ? object.getSet(moment())?.format("HH:mm") : "--:--"}`
          }}
        </p>

        <p v-if="objectData?.v_magnitude">Magnitude visuelle : {{ objectData.v_magnitude }}</p>

        <p v-if="objectData?.position_angle">Inclinaison : {{ objectData.position_angle }} °</p>

        <p>Lum. de surface : {{ objectData?.surface_brightness || "N/A" }} mag/arcsec²</p>

        <p>Redshift : {{ objectData?.redshift || "N/A" }}</p>
      </div>

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

      <p class="text-md mt-4">Identifiants :</p>
      <div class="mt-1 w-full flex gap-2 flex-wrap">
        <Badge
          variant="secondary"
          v-for="(identifier, index) in object.getIdentifiers()"
          :key="index"
          >{{ identifier }}</Badge
        >
      </div>

      <p class="text-md mt-4">Liens externes :</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5 mt-2">
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
