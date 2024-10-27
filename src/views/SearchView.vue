<script setup lang="ts">
import mobile from "is-mobile"
import { ref, watch } from "vue"
import { useMediaQuery } from "@vueuse/core"
import { useRoute, useRouter } from "vue-router"
import axios from "axios"

import { useSessionStore } from "@/stores/session"

import { Button } from "@/components/ui/button"

import DsoResultCard from "@/components/SearchView/DsoResultCard.vue"
import CstResultCard from "@/components/SearchView/CstResultCard.vue"
import FilterBar from "@/components/SearchView/FilterBar.vue"
import LocationDialog from "@/components/SearchView/LocationDialog.vue"

import { Filter, LoaderCircle } from "lucide-vue-next"
import { Dso } from "@/lib/astronomy/dso"

var isMobile = mobile()
var showFilterNavButton = useMediaQuery("(max-width: 1000px)")
var isFilterOpen = ref<boolean>(false)

var session = useSessionStore()

const results = ref<any>({ records: [], totalCount: 0 })

const loading = ref<boolean>(true)

const route = useRoute()
const router = useRouter()

// Initialize the query with the existing query param 'q' if present
const query = ref<string>((route.query.q as string) || "")

// Watch for changes in the query parameters in the route and update the ref
watch(
  () => route.query.q,
  (newQuery) => {
    query.value = (newQuery as string) || ""
    getResults()
  }
)

const getResults = () => {
  axios
    .get(`https://api.celestialy.xyz/v1/search?q=${query.value}`)
    .then((response) => {
      results.value = response.data
      loading.value = false

      if (results.value.records.length == 1) {
        if (results.value.records[0].xata.table == "dso") {
          router.push(`/objects/dso/${results.value.records[0].id}`)
        } else if (results.value.records[0].xata.table == "constellations") {
          router.push(`/objects/constellations/${results.value.records[0].id}`)
        }
      }
    })
    .catch((err) => console.log(err))
}

//avoid search if query is empty
if (query.value != "") {
  getResults()
}
</script>

<template>
  <main class="flex mt-10">
    <FilterBar v-model="isFilterOpen" />

    <div class="w-full px-8 relative">
      <div
        class="absolute top-0 bottom-0 left-0 right-0 z-50 bg-background/55 text-lg flex flex-col items-center p-20"
        v-show="loading"
      >
        Recherche en cours
        <LoaderCircle :size="60" class="mt-4 animate-spin" />
      </div>
      <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
        Résultats de recherche pour : {{ query }}
      </h3>
      <p class="text-sm text-muted-foreground mt-2 mb-4">
        {{ results.totalCount }} résultats trouvés
      </p>

      <p
        class="font-semibold w-full overflow-ellipsis overflow-hidden text-nowrap mb-4"
        v-show="isMobile || showFilterNavButton"
      >
        Localisation :
        <br />
        <span class="font-normal">
          {{ session.location.cityName || "Aucune ville" }}
          {{ session.location.countryName ? ", " : "" }}
          {{ session.location.countryName }}
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

      <div class="grid grid-cols-1 gap-6">
        <div v-for="obj of results.records" :key="obj.id">
          <RouterLink :to="`/objects/dso/${obj.id}`" v-if="obj.xata.table == 'dso'">
            <DsoResultCard
              :title="new Dso(obj, session.getObserver()).getName() || 'No name for the DSO object'"
              descriptors="Lever : 18h22 - Coucher : 2h15"
              :img="new Dso(obj, session.getObserver()).getImg('500x300')"
              :magnitude="obj.v_magnitude"
              :identifier="new Dso(obj, session.getObserver()).getMainIdentifier()"
            />
          </RouterLink>

          <RouterLink
            :to="`/objects/constellations/${obj.id}`"
            v-else-if="obj.xata.table == 'constellations'"
          >
            <!-- TODO: <CstResultCard
              :title="obj.name_fr != '' ? obj.name_fr : obj.name_en"
              descriptors="Lever : 18h22 - Coucher : 2h15"
              :img="astronomy.utils.getCstImgUrl(obj.iau_code)"
            /> -->
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>
