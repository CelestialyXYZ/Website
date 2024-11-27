<script setup lang="ts">
import moment, { type Moment } from "moment"

import DatePicker from "@/components/DatePicker.vue"
import { Button } from "@/components/ui/button"
import SkyPath from "@/components/SkyPath.vue"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { Moon } from "@/lib/astronomy/moon"

import {
  Eye,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Compass,
  CalendarFold,
  MoonStar,
  EyeOff,
  Sparkles,
  CalendarClock,
  Box,
  LoaderCircle
} from "lucide-vue-next"
import { ref, watch } from "vue"
import { useSessionStore } from "@/stores/session"
import { azimuthToDirection } from "@/lib/astronomy/utils"

var session = useSessionStore()

var currentDate = ref<Date>(new Date())
var currentMoment = ref<Moment>(moment(currentDate.value))

var showPOIs = ref<boolean>(false)

var moon = ref<Moon>(new Moon(session.getObserver()))
var objectAltAz = ref<{ altitude: number; azimuth: number }>(moon.value.getAltAz(moment()))

var isCurrentDay = ref<boolean>(true)

function updateAltAz() {
  objectAltAz.value = moon.value.getAltAz(isCurrentDay.value ? moment() : currentMoment.value)
}

setInterval(() => {
  updateAltAz()
}, 1000)

var loadingImg = ref<boolean>(true)

watch(currentDate, (newValue, oldValue) => {
  console.log(`Old value: ${oldValue}, New value: ${newValue}`)

  if (newValue == null) {
    currentDate.value = new Date()
  } else {
    console.log("changing date")
    loadingImg.value = true
    currentMoment.value = moment(newValue)
    isCurrentDay.value = moment().diff(moment(currentDate.value), "days") == 0
    updateAltAz()
  }

  setTimeout(() => {
    loadingImg.value = false
    console.log("IMAGE HAS NOT LOADED CORRECTLY")
  }, 3000) //In case of infinite load, stop the loader
})

function handleImgError(event: Event): void {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = ""
    setTimeout(() => {
      target.src = moon.value.getImg(moment(currentDate.value))
    }, 100)
  }
}

function addMonths(months: number) {
  currentDate.value = moment(currentDate.value).add(months, "months").toDate()
}

function addYears(years: number) {
  currentDate.value = moment(currentDate.value).add(years, "years").toDate()
}
</script>

<template>
  <main class="w-full flex justify-center">
    <div class="w-full max-w-5xl">
      <section class="w-full grid gap-4 grid-cols-2">
        <div class="mr-8 flex items-center relative">
          <div
            class="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center bg-background/55 rounded-full transition-opacity"
            :class="{ 'opacity-100': loadingImg, 'opacity-0': !loadingImg }"
          >
            <LoaderCircle :size="80" class="animate-spin" />
          </div>
          <img
            :src="moon.getImg(moment(currentDate))"
            @load="loadingImg = false"
            @error="handleImgError"
            class="w-full rounded-full border"
            :class="{ 'rotate-180': session.getObserver().latitude < 0 }"
          />
        </div>

        <div>
          <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors mb-4">
            {{ currentMoment.format("DD MMMM") }}
            <br />
            Lune gibbeuse décroissante
          </h2>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <h3
                class="scroll-m-20 text-xl font-semibold tracking-tight transition-colors mb-3 inline-flex items-center"
              >
                <MoonStar :size="26" class="mr-3" />
                Plus d'informations
              </h3>

              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Distance :</p>
                <p>{{ Math.round(moon.getDistance(moment(currentDate))) }} km</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Âge de la Lune :</p>
                <p>{{ moon.getAge(moment(currentDate)).toFixed(1) }} jours</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Illumination :</p>
                <p>
                  {{ (moon.getIllumination(moment(currentDate)).phase_fraction * 100).toFixed(1) }}
                  %
                </p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Magnitude :</p>
                <p>
                  {{ moon.getIllumination(moment(currentDate)).mag.toFixed(2) }}
                </p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">
                  Altitude ({{ isCurrentDay ? "en direct" : "à minuit" }}) :
                </p>
                <p>{{ objectAltAz.altitude.toFixed(2) }}°</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">
                  Azimut ({{ isCurrentDay ? "en direct" : "à minuit" }}) :
                </p>
                <p>
                  {{ objectAltAz.azimuth.toFixed(2) }}°
                  {{ azimuthToDirection(objectAltAz.azimuth) }}
                </p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Lever :</p>
                <p>
                  {{
                    moon.isVisibleAllDay(currentMoment)
                      ? "Jamais"
                      : moon.getRise(currentMoment)
                        ? moon.getRise(currentMoment)?.format("HH:mm")
                        : "--:--"
                  }}
                </p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Coucher :</p>
                <p>
                  {{
                    moon.isVisibleAllDay(currentMoment)
                      ? "Jamais"
                      : moon.getSet(currentMoment)
                        ? moon.getSet(currentMoment)?.format("HH:mm")
                        : "--:--"
                  }}
                </p>
              </div>

              <h3
                class="scroll-m-20 text-xl font-semibold tracking-tight transition-colors mt-5 mb-3 inline-flex items-center"
              >
                <CalendarFold :size="26" class="mr-3" />
                Choix de la date
              </h3>
              <DatePicker class="w-full relative" v-model="currentDate" />

              <Button class="w-full mt-5 inline-flex items-center" @click="showPOIs = !showPOIs">
                <Eye class="mr-2" :size="16" v-show="!showPOIs" /><EyeOff
                  class="mr-2"
                  :size="16"
                  v-show="showPOIs"
                />
                {{ showPOIs ? "Cacher" : "Afficher" }} les points d'interêt
              </Button>
            </div>
            <div>
              <h3
                class="scroll-m-20 text-xl font-semibold tracking-tight transition-colors mb-3 inline-flex items-center text-red-500"
              >
                <Sparkles :size="26" class="mr-3" />
                Illumination
              </h3>

              <canvas
                id="moon_illumination"
                width="600"
                height="300"
                class="w-full bg-primary rounded-xl border"
              ></canvas>

              <h3
                class="scroll-m-20 text-xl font-semibold tracking-tight transition-colors mt-5 mb-3 inline-flex items-center text-red-500"
              >
                <Compass :size="26" class="mr-3" />
                Altitude dans le ciel
              </h3>
              <SkyPath
                :canvas-width="600"
                :canvas-height="300"
                canvas-id="moon"
                :sky-object="moon"
                :date="currentMoment"
                :show-moon="false"
              />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2
          class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-20 mb-4 inline-flex items-center"
        >
          <CalendarClock :size="26" class="mr-3" />
          Calendrier lunaire
        </h2>

        <div class="flex gap-2 justify-center items-center mb-4">
          <Button variant="outline" class="p-2" @click="addYears(-1)">
            <ChevronsLeft :size="20" />
          </Button>
          <Button variant="outline" class="p-2" @click="addMonths(-1)">
            <ChevronLeft :size="20" />
          </Button>
          <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mx-6">
            {{ currentMoment.format("MMMM YYYY") }}
          </h4>
          <Button variant="outline" class="p-2" @click="addMonths(1)">
            <ChevronRight :size="20" />
          </Button>
          <Button variant="outline" class="p-2" @click="addYears(1)">
            <ChevronsRight :size="20" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="w-[100px] text-center"> Semaine </TableHead>
              <TableHead class="text-center">Lundi</TableHead>
              <TableHead class="text-center">Mardi</TableHead>
              <TableHead class="text-center">Mercredi</TableHead>
              <TableHead class="text-center">Jeudi</TableHead>
              <TableHead class="text-center">Vendredi</TableHead>
              <TableHead class="text-center">Samedi</TableHead>
              <TableHead class="text-center">Dimanche</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="text-center">
            <TableRow v-for="week in moon.getCalendar(currentMoment)" :key="week.week">
              <TableCell class="font-medium"> {{ week.week }} </TableCell>
              <TableCell v-for="day in week.days" :key="day.day">
                <div
                  class="flex flex-col items-center gap-2"
                  :class="{ 'opacity-50': !day.dayOfMonth }"
                >
                  <p>{{ day.day }}</p>
                  <img :src="day.img" class="w-20 aspect-square rounded-full" />
                  <p
                    class="text-sm text-muted-foreground"
                    v-if="day.illumination.phase_fraction > 0.98"
                  >
                    Pleine Lune
                  </p>
                  <p
                    class="text-sm text-muted-foreground"
                    v-else-if="day.illumination.phase_fraction < 0.02"
                  >
                    Nouvelle Lune
                  </p>
                  <p class="text-sm text-muted-foreground" v-else>
                    {{ Math.round(day.illumination.phase_fraction * 100) }}% illuminé
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section>
        <h2
          class="scroll-m-20 text-2xl font-semibold tracking-tight transition-colors mt-20 mb-4 inline-flex items-center"
        >
          <Box :size="26" class="mr-3" />
          Modèle 3D
        </h2>

        <div class="relative">
          <img
            src="/logos/nasa-full.svg"
            class="w-20 aspect-square absolute bottom-4 right-4 z-10"
          />
          <iframe
            src="https://solarsystem.nasa.gov/gltf_embed/2366/"
            class="w-full aspect-video rounded-xl border"
          ></iframe>
        </div>
      </section>
    </div>
  </main>
</template>
