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
import { SkyPath } from "@/lib/astronomy/skyPathCanvas"
import { useSessionStore } from "@/stores/session"
import moment from "moment"

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
  name_en: "loading",
  declination: 0,
  right_ascension: 0
}
const defaultDso: Dso = new Dso(defaultData, session.getObserver())

var object = ref<Dso>(defaultDso)
var objectData = ref<DsoObject>(defaultData)
var objectAltAz = ref<{ altitude: number; azimuth: number }>(object.value.getAltAz(moment()))
var skyPath = ref<SkyPath>()

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

    skyPath.value = new SkyPath("sky-path", object.value, 0.25)
  }
}

onMounted(() => {
  getDso()
})
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
          <p>
            Visibilité :
            {{
              object.isAltitudeVisible(moment(), 30)
                ? "Difficile"
                : `${object.getRiseAltitude(moment(), 30) ? object.getRiseAltitude(moment(), 30)?.format("HH:mm") : "--:--"} - ${object.getSetAltitude(moment(), 30) ? object.getSetAltitude(moment(), 30)?.format("HH:mm") : "--:--"}`
            }}
          </p>

          <p class="inline-flex items-center mt-2 text-red-500">
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
            <div class="border rounded-xl w-full h-full overflow-clip relative">
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
              <canvas id="sky-path" width="1000" height="450" class="w-full h-full"></canvas>
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
                  `skyPath_${moment()}_${object.getMainIdentifier()}.png`
                )
              "
            >
              <Download :size="18" class="mr-3" /> Enregistrer l'image en PNG
            </ContextMenuItem>
            <ContextMenuItem
              @click="
                skyPath?.download(
                  'image/jpg',
                  `skyPath_${moment()}_${object.getMainIdentifier()}.jpg`
                )
              "
            >
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

      <p class="mt-1">
        Lever / Coucher :
        {{
          object.isVisibleAllDay(moment())
            ? "Jamais"
            : `${object.getRise(moment()) ? object.getRise(moment())?.format("HH:mm") : "--:--"} - ${object.getSet(moment()) ? object.getSet(moment())?.format("HH:mm") : "--:--"}`
        }}
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
