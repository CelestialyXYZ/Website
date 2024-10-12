<script setup lang="ts">
import { ref } from "vue"
import axios from "axios"
import mobile from "is-mobile"

import { useSessionStore } from "@/stores/session"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

import { Search, Map, Check, LoaderCircle } from "lucide-vue-next"

var session = useSessionStore()

var searchInput = ref<string>("")
var isSearching = ref<boolean>(false)
var searchResult = ref<any>([])
var selectionId = ref<number>(-1)

var isMobile = mobile()

async function search() {
  isSearching.value = true
  selectionId.value = -1

  try {
    const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
      params: {
        api_key: "5b3ce3597851110001cf6248d728cf6c6faf414c96e6aca31fcbd571",
        text: searchInput.value
      }
    })

    selectionId.value = 0

    const features = response.data.features
    const flagPromises = features.map(async (item: any) => {
      const flag = await getFlag(item.properties.country_a)
      return { ...item, flag }
    })

    searchResult.value = await Promise.all(flagPromises)
  } catch (error) {
    console.log(error)
  } finally {
    isSearching.value = false
  }
}

async function getFlag(country: string) {
  const unknownFlag =
    "data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ccc' d='M0 0h512v512H0z'/%3E%3Ctext fill='%23999' x='256' y='384' style='font: bold 333px sans-serif' text-anchor='middle'%3E%3F%3C/text%3E%3C/svg%3E"

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${country}`)
    return response.data[0].flags.svg
  } catch (error) {
    console.error(error)
    return unknownFlag
  }
}

function saveLocation() {
  axios
    .get("https://api.openrouteservice.org/elevation/point", {
      params: {
        api_key: "5b3ce3597851110001cf6248d728cf6c6faf414c96e6aca31fcbd571",
        geometry: `${searchResult.value[selectionId.value].geometry.coordinates[0]},${searchResult.value[selectionId.value].geometry.coordinates[1]}`
      }
    })
    .then((response) => {
      console.log("🌍 Got elevation from OpenRouteService api")
      session.setLocation(
        searchResult.value[selectionId.value].geometry.coordinates[1],
        searchResult.value[selectionId.value].geometry.coordinates[0],
        response.data.geometry.coordinates[2],
        searchResult.value[selectionId.value].properties.county,
        searchResult.value[selectionId.value].properties.country,
        searchResult.value[selectionId.value].properties.label,
        searchResult.value[selectionId.value].properties.country_a
      )
    })
    .catch((error) => {
      console.log(error)

      //Setting default location to Paris
      session.setLocation(48.864716, 2.349014, 46, "Paris", "France", "Paris", "FRA")
    })
}
</script>

<template>
  <Dialog v-if="!isMobile">
    <DialogTrigger>
      <a href="#" class="font-semibold text-primary underline underline-offset-4">Modifier</a>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editer la localisation</DialogTitle>
        <DialogDescription>
          Modifiez la localisation par défaut en effectuant une recherche ci-dessous. Cliquez sur
          Sauvergarder une fois terminé.
        </DialogDescription>
      </DialogHeader>

      <div class="flex w-full gap-4">
        <Input
          id="search"
          type="text"
          v-model="searchInput"
          placeholder="Entrez une ville, une addresse (recommandé)..."
          :disabled="isSearching"
          @keyup.enter="search"
        />
        <Button
          variant="secondary"
          @click="search"
          class="w-40 flex items-center justify-center"
          :disabled="isSearching || searchInput.length == 0"
        >
          <span v-show="!isSearching">Chercher</span>
          <Search v-show="!isSearching" :size="16" class="ml-2" />
          <LoaderCircle v-show="isSearching" :size="20" class="animate-spin" />
        </Button>
      </div>

      <ScrollArea v-show="searchResult.length > 0 && !isSearching" class="h-[200px] w-full">
        <div
          class="flex cursor-pointer items-center justify-between border p-3 rounded-lg first:mt-0 mt-4"
          v-for="(item, index) in searchResult"
          :key="index"
          @click="selectionId = index"
        >
          <div
            class="w-5 h-5 rounded-full mr-4 flex items-center justify-center"
            :class="{
              'bg-primary': selectionId == index,
              border: selectionId != index,
              'border-primary': selectionId != index
            }"
          >
            <Check :size="16" class="text-white" v-show="selectionId == index" />
          </div>
          <p class="font-semibold break-all">
            {{ item.properties.label }}
          </p>
          <img :src="item.flag" class="ml-2 h-4 rounded-sm" />
        </div>
      </ScrollArea>

      <div v-show="isSearching" class="w-full h-[200px] flex flex-col items-center justify-center">
        <Skeleton class="w-full h-[50px] rounded-lg first:mt-0 mt-4" />
        <Skeleton class="w-full h-[50px] rounded-lg first:mt-0 mt-4" />
        <Skeleton class="w-full h-[50px] rounded-lg first:mt-0 mt-4" />
      </div>

      <div
        v-show="searchResult.length == 0 && !isSearching"
        class="w-full h-[200px] flex flex-col items-center justify-center"
      >
        <Map :size="64" :stroke-width="1.2" class="text-muted-foreground mb-1" />
        <p class="text-muted-foreground text-center">
          Aucun résultat.<br />Effectuez une recherche ou changez celle-ci.
        </p>
      </div>

      <DialogFooter>
        <DialogClose as-child>
          <Button
            type="submit"
            @click="saveLocation"
            :disabled="selectionId == -1 || isSearching || searchResult.length == 0"
            >Sauvegarder</Button
          >
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Drawer v-if="isMobile">
    <DrawerTrigger>
      <a href="#" class="font-semibold text-primary underline underline-offset-4">Modifier</a>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Editer la localisation</DrawerTitle>
        <DrawerDescription>
          Modifiez la localisation par défaut en effectuant une recherche ci-dessous. Cliquez sur
          Sauvergarder une fois terminé.
        </DrawerDescription>
      </DrawerHeader>

      <div class="flex w-full gap-4 mb-4 px-4">
        <Input
          id="search"
          type="text"
          v-model="searchInput"
          placeholder="Entrez une ville, une addresse (recommandé)..."
          :disabled="isSearching"
          @keyup.enter="search"
        />
        <Button
          variant="secondary"
          @click="search"
          class="w-40 flex items-center justify-center"
          :disabled="isSearching || searchInput.length == 0"
        >
          <span v-show="!isSearching">Chercher</span>
          <Search v-show="!isSearching" :size="16" class="ml-2" />
          <LoaderCircle v-show="isSearching" :size="20" class="animate-spin" />
        </Button>
      </div>

      <ScrollArea v-show="searchResult.length > 0 && !isSearching" class="h-[200px] w-full px-4">
        <div
          class="flex cursor-pointer items-center justify-between border p-3 rounded-lg first:mt-0 mt-4"
          v-for="(item, index) in searchResult"
          :key="index"
          @click="selectionId = index"
        >
          <div
            class="w-5 h-5 rounded-full mr-4 flex items-center justify-center"
            :class="{
              'bg-primary': selectionId == index,
              border: selectionId != index,
              'border-primary': selectionId != index
            }"
          >
            <Check :size="16" class="text-white" v-show="selectionId == index" />
          </div>
          <p class="font-semibold break-all">
            {{ item.properties.label }}
          </p>
          <img :src="item.flag" class="ml-2 h-4 rounded-sm" />
        </div>
      </ScrollArea>

      <div
        v-show="isSearching"
        class="w-full h-[200px] flex flex-col items-center justify-center px-4"
      >
        <Skeleton class="w-full h-[50px] rounded-lg first:mt-0 mt-4" />
        <Skeleton class="w-full h-[50px] rounded-lg first:mt-0 mt-4" />
        <Skeleton class="w-full h-[50px] rounded-lg first:mt-0 mt-4" />
      </div>

      <div
        v-show="searchResult.length == 0 && !isSearching"
        class="w-full h-[200px] flex flex-col items-center justify-center px-4"
      >
        <Map :size="64" :stroke-width="1.2" class="text-muted-foreground mb-1" />
        <p class="text-muted-foreground text-center">
          Aucun résultat.<br />Effectuez une recherche ou changez celle-ci.
        </p>
      </div>

      <DrawerFooter>
        <DrawerClose>
          <Button
            @click="saveLocation"
            class="w-full mb-4"
            :disabled="selectionId == -1 || isSearching || searchResult.length == 0"
          >
            Sauvegarder
          </Button>
          <Button variant="outline" class="w-full"> Annuler </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
