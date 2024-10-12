<script setup lang="ts">
/* import { format } from "date-fns"
import { fr } from "date-fns/locale"

import DatePicker from "../components/DatePicker.vue"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import {
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight
} from "lucide-vue-next"
import { ref, watch } from "vue"

var currentDate = ref<Date>(new Date())

var moonData = ref<any>(moon.getData(currentDate.value, 0, 0))

watch(currentDate, () => {
  moonData.value = moon.getData(currentDate.value, 0, 0)
}) */
</script>

<template>
  TODO
  <!--   <main class="m-auto w-fit pt-20">
    <section class="flex gap-16">
      <img :src="moonData.img" class="rounded-full h-[28rem] aspect-square" />
      <div>
        <h2 class="text-3xl font-semibold tracking-tight transition-colors mb-2">
          {{ format(currentDate, "EEEE d MMMM", { locale: fr }) }} - Lune gibbeuse décroissante
        </h2>
        <p class="text-lg text-muted-foreground mb-6 text-red-600">
          Le
          {{
          format(currentDate, "d MMMM", {
          locale: fr
          })
          }}
          le ciel est dégagé, la Lune devrait être visible peu après 00h00
        </p>
        <div class="flex gap-6">
          <div class="w-64">
            <div class="mb-4">
              <p class="text-xl font-semibold mb-2">Plus d'informations</p>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Distance :</p>
                <p class="text-red-600">399 650 km</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Âge de la Lune :</p>
                <p>{{ moonData.age.toFixed(1) }} jours</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Illumination :</p>
                <p>{{ moonData.illumination.toFixed(1) }} %</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Altitude :</p>
                <p class="text-red-600">10.56°</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Azimut :</p>
                <p class="text-red-600">133.96° SE</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Lever :</p>
                <p class="text-red-600">10h56</p>
              </div>
              <div class="inline-flex w-full justify-between">
                <p class="font-semibold">Coucher :</p>
                <p class="text-red-600">22h03</p>
              </div>
            </div>
            <p class="text-xl font-semibold mb-2">Choix de la date</p>
            <DatePicker class="w-full" v-model="currentDate" />
            <Button class="w-full mt-6 inline-flex items-center">
              <Eye class="mr-2" :size="16" /> Afficher les points d'interêt
            </Button>
          </div>
          <div class="w-72">
            <p class="text-xl font-semibold mb-2">Illumination</p>
            <canvas class="w-full rounded-lg border bg-violet-700" width="600" height="275"></canvas>
            <p class="text-xl font-semibold mt-4 mb-2">Résumé de la nuit</p>
            <canvas class="w-full rounded-lg border bg-violet-700" width="600" height="275"></canvas>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-3xl font-semibold tracking-tight transition-colors mb-6 mt-20">
        Calendrier lunaire
      </h2>

      <div class="flex gap-2 justify-center items-center mb-4">
        <Button variant="outline" class="p-2">
          <ChevronsLeft :size="20" />
        </Button>
        <Button variant="outline" class="p-2">
          <ChevronLeft :size="20" />
        </Button>
        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mx-6">Janvier 2024</h4>
        <Button variant="outline" class="p-2">
          <ChevronRight :size="20" />
        </Button>
        <Button variant="outline" class="p-2">
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
          <TableRow>
            <TableCell class="font-medium"> 27 </TableCell>
            <TableCell>
              <div class="flex flex-col items-center gap-2">
                <p>1</p>
                <img src="/moon.png" class="w-20 aspect-square rounded-full" />
                <p class="text-sm text-muted-foreground">27% illuminé</p>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col items-center gap-2">
                <p>2</p>
                <img src="/moon.png" class="w-20 aspect-square rounded-full" />
                <p class="text-sm text-muted-foreground">51% illuminé</p>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col items-center gap-2">
                <p>3</p>
                <img src="/moon.png" class="w-20 aspect-square rounded-full" />
                <p class="text-sm text-muted-foreground">75% illuminé</p>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col items-center gap-2">
                <p>4</p>
                <img src="/moon.png" class="w-20 aspect-square rounded-full" />
                <p class="text-sm text-muted-foreground">100% illuminé</p>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col items-center gap-2">
                <p>5</p>
                <img src="/moon.png" class="w-20 aspect-square rounded-full" />
                <p class="text-sm text-muted-foreground">100% illuminé</p>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col items-center gap-2">
                <p>6</p>
                <img src="/moon.png" class="w-20 aspect-square rounded-full" />
                <p class="text-sm text-muted-foreground">100% illuminé</p>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col items-center gap-2">
                <p>7</p>
                <img src="/moon.png" class="w-20 aspect-square rounded-full" />
                <p class="text-sm text-muted-foreground">100% illuminé</p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>

    <section>
      <h2 class="text-3xl font-semibold tracking-tight transition-colors mb-6 mt-20">Modèle 3D</h2>

      <div class="relative">
        <img src="/logos/nasa-full.svg" class="w-20 aspect-square absolute bottom-4 right-4 z-10" />
        <iframe src="https://solarsystem.nasa.gov/gltf_embed/2366/"
          class="w-full aspect-video rounded-xl border"></iframe>
      </div>
    </section>
  </main> -->
</template>
