<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import DatePicker from "../components/DatePicker.vue"

import {
  Telescope,
  Bug,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Play,
  Satellite,
  Box
} from "lucide-vue-next"

import SelectInput from "@/components/ObjectView/SelectInput.vue"
import { ref } from "vue"

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
var halfHours = ref<string[]>([
  "Maintenant",
  "0h00",
  "0h30",
  "1h00",
  "1h30",
  "2h00",
  "2h30",
  "3h00",
  "3h30",
  "4h00",
  "4h30",
  "5h00",
  "5h30",
  "6h00",
  "6h30",
  "7h00",
  "7h30",
  "8h00",
  "8h30",
  "9h00",
  "9h30",
  "10h00",
  "10h30",
  "11h00",
  "11h30",
  "12h00",
  "12h30",
  "13h00",
  "13h30",
  "14h00",
  "14h30",
  "15h00",
  "15h30",
  "16h00",
  "16h30",
  "17h00",
  "17h30",
  "18h00",
  "18h30",
  "19h00",
  "19h30",
  "20h00",
  "20h30",
  "21h00",
  "21h30",
  "22h00",
  "22h30",
  "23h00",
  "23h30"
])
var annualMode = ref<boolean>(false)
var selectedAnnualyHour = ref<string>("0")

var selectedHalfHour = ref<string>("23h30")
</script>

<template>
  <main class="flex mt-10 px-8">
    <div class="m-auto max-w-lg md:max-w-2xl xl:max-w-2xl">
      <h2
        class="scroll-m-20 text-4xl mb-1 font-semibold tracking-tight transition-colors first:mt-0"
      >
        Jupiter
      </h2>

      <h4 class="scroll-m-20 text-lg text-muted-foreground tracking-tight mb-4">Planète gazeuse</h4>

      <img
        src="https://www.lecosmographe.com/wp-content/uploads/2021/01/Jupiter.jpg"
        alt="Jupiter planet"
        class="rounded-xl border w-full"
      />

      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 mb-4 inline-flex items-center"
      >
        <Star :size="26" class="mr-3" />
        Altitude annuelle/journalière
      </h2>

      <div class="flex justify-between w-full">
        <div class="w-full pr-4">
          <h5 class="text-lg font-semibold">En direct</h5>
          <p>Alt : 45.3° - Az : 83.6°</p>

          <h5 class="text-lg font-semibold mt-2">Aujourd'hui</h5>
          <p>Visibilité : 5h12 - 19h36</p>

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

        <Canvas width="450" height="200" class="border rounded-xl"></Canvas>
      </div>

      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 mb-4 inline-flex items-center"
      >
        <Satellite :size="26" class="mr-3" />
        Position des satellites
      </h2>

      <img src="/jupsim.png" class="w-full rounded-xl border bg-black p-4" />
      <p class="text-sm text-muted-foreground text-end mt-2 mr-2">
        Heure de la simulation : 16/07/2024 00:36:12
      </p>

      <h5 class="text-lg font-semibold mt-2 mb-4">Réglages</h5>

      <div class="flex gap-4">
        <DatePicker />
        <SelectInput :values="halfHours" v-model="selectedHalfHour" />
      </div>
      <div class="mt-4 flex gap-2">
        <Button variant="outline" class="p-2 w-full">
          <ChevronsLeft class="mr-1" :size="20" /> 1 jour
        </Button>
        <Button variant="outline" class="p-2 w-full">
          <ChevronsLeft class="mr-1" :size="20" /> 1 h
        </Button>
        <Button variant="outline" class="p-2 w-full">
          <ChevronLeft class="mr-1" :size="20" /> 5 mins
        </Button>
        <Button class="w-full inline-flex justify-center"> Maintenant </Button>
        <Button variant="outline" class="p-2 w-full">
          5 mins
          <ChevronRight class="ml-2" :size="20" />
        </Button>
        <Button variant="outline" class="p-2 w-full">
          1 h
          <ChevronsRight class="ml-1" :size="20" />
        </Button>
        <Button variant="outline" class="p-2 w-full">
          1 jour
          <ChevronsRight class="ml-1" :size="20" />
        </Button>
      </div>
      <div class="mt-4 flex items-center gap-2">
        <Button>
          <Play class="mr-2" :size="16" />
          Animer
        </Button>
        <Button variant="outline" :disabled="true"> Accélérer </Button>
        <Button variant="outline" :disabled="true"> Ralentir </Button>
        <p class="ml-2 text-muted-foreground">Vitesse : 80 ms</p>
      </div>

      <p class="mt-4 text-muted-foreground text-sm">
        Le code du simulateur de position des satellites de Jupiter disponible ci-dessus est sous
        licence GNU Public v2 © 2000 - 2019 par Akkana Peck (<a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          href="https://shallowsky.com/"
          >Shallow sky</a
        >).
      </p>

      <h2
        class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-8 mb-4 inline-flex items-center"
      >
        <Box :size="26" class="mr-3" />
        Modèle 3D
      </h2>

      <div class="relative">
        <img src="/logos/nasa-full.svg" class="w-16 aspect-square absolute bottom-4 right-4 z-10" />
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2375/"
          class="w-full aspect-video rounded-xl border"
        ></iframe>
      </div>
    </div>
    <div class="w-72">
      <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">Informations</h3>
      <p class="mt-3">Ascension droite : 0° 0' 0.00"</p>
      <p class="mt-1">Déclinaison : 0° 0' 0.00"</p>
      <p class="mt-1">Type : planète</p>

      <p class="text-md mt-1">Identifiants :</p>
      <div class="mt-1 w-full flex gap-2 flex-wrap">
        <Badge variant="secondary">M42</Badge>
        <Badge variant="secondary">NGC 1976</Badge>
        <Badge variant="secondary">Orion's nebula</Badge>
        <Badge variant="secondary">Orion nebula</Badge>
        <Badge variant="secondary">Nébuleuse d'Orion</Badge>
      </div>

      <p class="text-md mt-4">Liens externes :</p>

      <div class="flex flex-col mt-1">
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          href="https://en.wikipedia.org/wiki/Orion_Nebula"
        >
          <img
            src="https://favicone.com/en.wikipedia.org?s=32"
            class="w-5 mr-2 aspect-square rounded-full"
          />
          Wikipedia
          <ExternalLink class="ml-2" :size="16" />
        </a>
        <a
          class="underline text-primary font-semibold inline-flex items-center"
          target="_blank"
          href="https://www.google.com/search?q=La+Grande+nebuleuse+d%27Orion"
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
          href="https://www.google.com/search?q=La+Grande+nebuleuse+d%27Orion&tbm=isch"
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
