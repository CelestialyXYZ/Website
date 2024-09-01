<script setup lang="ts">
import mobile from "is-mobile"
import { ref } from "vue"
import { useMediaQuery } from "@vueuse/core"

import { useAstronomyStore } from "@/stores/astronomy"
import { useSessionStore } from "@/stores/session"

import { Button } from "@/components/ui/button"

import ResultCard from "@/components/SearchView/ResultCard.vue"
import FilterBar from "@/components/SearchView/FilterBar.vue"
import LocationDialog from "@/components/SearchView/LocationDialog.vue"

import { Filter } from "lucide-vue-next"

var isMobile = mobile()
var showFilterNavButton = useMediaQuery("(max-width: 1000px)")
var isFilterOpen = ref<boolean>(false)

var astronomy = useAstronomyStore()
var session = useSessionStore()
</script>

<template>
  <main class="flex mt-10">
    <FilterBar v-model="isFilterOpen" />

    <div class="w-full px-8">
      <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Résultats de recherche pour : orion
      </h3>
      <p class="text-sm text-muted-foreground mt-2 mb-4">128 résultats (0.48 secondes)</p>

      <p
        class="font-semibold w-full overflow-ellipsis overflow-hidden text-nowrap mb-4"
        v-show="isMobile || showFilterNavButton"
      >
        Localisation :
        <br />
        <span class="font-normal">
          {{ session.location.cityName || "Aucune ville"
          }}{{ session.location.countryName ? ", " : "" }}{{ session.location.countryName }}
        </span>
        <br />
        <LocationDialog />
      </p>

      <Button
        variant="outline"
        class="mb-4 inline-flex items-center"
        v-show="isMobile || showFilterNavButton"
        @click="isFilterOpen = !isFilterOpen"
      >
        <Filter class="h-4 mr-2" />Afficher les filtres
      </Button>

      <ResultCard
        title="Les Pleiades"
        descriptors="Lever : 18h22 - Coucher : 2h15"
        :img="astronomy.utils.getImgUrl({ m: ['M31'] }, '500x300')"
      />
    </div>
  </main>
</template>
