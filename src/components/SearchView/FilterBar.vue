<script setup lang="ts">
import mobile from 'is-mobile'
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
import { ref } from 'vue'

import { useSessionStore } from '@/stores/session'
import { useAstronomyStore } from '@/stores/astronomy'

import SelectFilter from '@/components/SearchView/SelectFilter.vue'
import SearchSelectFilter from '@/components/SearchView/SearchSelectFilter.vue'
import LocationDialog from '@/components/SearchView/LocationDialog.vue'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle
} from '@/components/ui/drawer'

import {
    MapPin,
    Eye,
    MoonStar,
    BookOpen,
    MoveHorizontal,
    RotateCw,
    ScanSearch,
    Sparkles,
    Sparkle,
    Sun
} from 'lucide-vue-next'

var session = useSessionStore()
var astronomy = useAstronomyStore()

const [FilterTemplate, UseFilterTemplate] = createReusableTemplate()
var showFilterSideNav = useMediaQuery('(min-width: 1000px)')
var isOpen = defineModel<boolean>()
const isMobile = mobile()


const filters = ref({
    time: {
        from: 18,
        to: 4
    },
    altitude: {
        value: 20,
        time: 10
    },
    mag: {
        unit: `arc_minute`
    },
    objectType: 'globular_cluster',
    catalog: 'messier',
    constellation: 'Andromeda'
})

//do an array map from 0 to 23
const hours = ref<number[]>(Array.from({ length: 24 }, (_, i) => i))

const objectTypes = ref<string[]>([
    'Dark Nebula',
    'Emission Nebula',
    'Galaxy',
    'Globular Cluster',
    'Group of Galaxies',
    'Open Cluster',
    'Planetary Nebula',
    'Reflection Nebula',
    'Supernova'
])
const catalogs = ref<string[]>(['Messier', 'New General Catalog', 'Index Catalog'])

const constellations = ref<{ label: string; value: string }[]>([
    { label: 'Andromeda', value: 'AND' },
    { label: 'Antlia', value: 'ANT' },
    { label: 'Aquarius', value: 'AQU' }
])
const magUnits = ref<string[]>(['degré', 'arc minute', 'arc second'])
</script>

<template>
    <FilterTemplate>
        <p class="font-semibold flex items-center space-x-2">
            <Eye class="w-4 h-4" />
            <span>Visibilité</span>
        </p>
        <div class="mt-3 flex items-center space-x-2">
            <span>De</span>
            <SelectFilter :values="hours" suffix="h" v-model="filters.time.from" />
            <span>à</span>
            <SelectFilter :values="hours" suffix="h" v-model="filters.time.to" />
        </div>
        <div class="mt-2 flex items-center space-x-2">
            <span class="text-nowrap">Altitude min</span>
            <NumberField @update:model-value="(v) => { v ? filters.altitude.value = v : filters.altitude.value = 0 }"
                :default-value="filters.altitude.value" :min="0" :max="90" :step="5">
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
            <span>°</span>
        </div>
        <div class="mt-2 flex items-center space-x-2">
            <span>pour</span>
            <NumberField @update:model-value="(v) => { v ? filters.altitude.time = v : filters.altitude.time = 0 }"
                :default-value="filters.altitude.time" :min="0" :max="900" :step="5">
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
            <span>minutes</span>
        </div>

        <p class="mt-5 font-semibold flex items-center space-x-2">
            <MoonStar class="w-4 h-4" />
            <span>Type d'objet</span>
        </p>
        <div class="mt-3 flex items-center">
            <SelectFilter :values="objectTypes" v-model="filters.objectType" />
        </div>

        <p class="mt-5 font-semibold flex items-center space-x-2">
            <BookOpen class="w-4 h-4" />
            <span>Catalogue</span>
        </p>
        <div class="mt-3">
            <SelectFilter :values="catalogs" v-model="filters.catalog" />
        </div>

        <p class="mt-5 font-semibold flex items-center space-x-2">
            <Sparkles class="w-4 h-4" />
            <span>Constellation</span>
        </p>
        <div class="mt-3">
            <SearchSelectFilter :values="constellations" notFoundTitle="Aucune constellation trouvée."
                v-model="filters.constellation" />
        </div>

        <p class="mt-5 font-semibold flex items-center space-x-2">
            <RotateCw class="w-4 h-4" />
            <span>Ascension droite</span>
        </p>
        <div class="mt-3 flex items-center space-x-2">
            <span>De</span>
            <SelectFilter :values="hours" suffix="h" v-model="filters.time.from" />
            <span>à</span>
            <SelectFilter :values="hours" suffix="h" v-model="filters.time.to" />
        </div>

        <p class="mt-5 font-semibold flex items-center space-x-2">
            <MoveHorizontal class="w-4 h-4" />
            <span>Déclinaison</span>
        </p>
        <div class="mt-3 flex items-center space-x-2">
            <span>De</span>
            <SelectFilter :values="hours" suffix="h" v-model="filters.time.from" />
            <span>à</span>
            <SelectFilter :values="hours" suffix="h" v-model="filters.time.to" />
        </div>

        <p class="mt-5 font-semibold flex items-center space-x-2">
            <Sparkle class="w-4 h-4" />
            <span>Magnitude apparente</span>
        </p>
        <div class="mt-3 flex items-center space-x-2">
            <span>De</span>

            <NumberField @update:model-value="(v) => { v ? filters.altitude.value = v : filters.altitude.value = 0 }"
                :default-value="filters.altitude.value" :min="0" :step="1">
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
            <span>à</span>

            <NumberField @update:model-value="(v) => { v ? filters.altitude.value = v : filters.altitude.value = 0 }"
                :default-value="filters.altitude.value" :min="0" :step="1">
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
        </div>
        <div class="mt-2 flex items-center space-x-2">
            <Checkbox id="magAllMissing" />
            <label for="magAllMissing"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Inclure manquant
            </label>
        </div>

        <p class="mt-5 font-semibold flex items-center space-x-2">
            <ScanSearch class="w-4 h-4" />
            <span>Taille apparente</span>
        </p>
        <div class="mt-3 flex items-center space-x-2">
            <span>De</span>
            <Input type="number" min="0" step="1" v-model="filters.altitude.value" />
            <span>à</span>
            <Input type="number" min="0" step="1" v-model="filters.altitude.value" />
        </div>
        <div class="mt-2 flex items-center space-x-2">
            <span>Unité</span>
            <SelectFilter :values="magUnits" v-model="filters.mag.unit" />
        </div>
        <div class="mt-2 flex items-center space-x-2">
            <Checkbox id="SizeAllMissing" />
            <label for="SizeAllMissing"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Inclure manquant
            </label>
        </div>

        <p class="mt-5 font-semibold flex items-center">
            <Sun class="w-4 h-4 mr-2" />
            <span>Luminosité de l'objet</span>
        </p>
        <div class="mt-3 flex items-center space-x-2">
            <span>De</span>

            <NumberField @update:model-value="(v) => { v ? filters.altitude.value = v : filters.altitude.value = 0 }"
                :default-value="filters.altitude.value" :min="0" :step="1">
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
            <span>à</span>
        </div>
        <div class="mt-2 flex items-center space-x-2">

            <NumberField @update:model-value="(v) => { v ? filters.altitude.value = v : filters.altitude.value = 0 }"
                :default-value="filters.altitude.value" :min="0" :step="1">
                <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                </NumberFieldContent>
            </NumberField>
            <span>mag/arcsec²</span>
        </div>
        <div class="mt-2 flex items-center space-x-2">
            <Checkbox id="LuminosityAllMissing" />
            <label for="LuminosityAllMissing"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Inclure manquant
            </label>
        </div>
    </FilterTemplate>


    <div class="w-[18.5rem] w-max-[18.5rem] flex-shrink-0 px-8" v-show="showFilterSideNav">
        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight">Localisation</h4>

        <p class="mt-4 font-semibold flex items-center space-x-2">
            <MapPin class="w-4 h-4" />
            <span class="overflow-ellipsis overflow-hidden w-[14rem] text-nowrap">{{
                session.location.cityName ||
                "Aucune ville"
            }}{{
                    session.location.countryName ? ", " : ""
                }}{{ session.location.countryName }}</span>
        </p>
        <p class="text-sm text-muted-foreground">
            {{ astronomy.utils.latitudeatitudeToSexagesimal(session.location.lat) || "N0° 0' 0.00''" }}<br />
            {{ astronomy.utils.longitudeToSexagesimal(session.location.lon) || "E0° 0' 0.00''" }}
        </p>
        <LocationDialog />

        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mt-8">Filtres</h4>

        <Button class="my-4 w-full">Réinitialiser les filtres</Button>

        <UseFilterTemplate />
    </div>

    <Sheet v-model:open="isOpen" v-if="!isMobile">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>
                    Ajoutez des filtres à votre recherche pour l'affiner à l'aide des champs ci-dessous.
                </SheetDescription>
            </SheetHeader>
            <Button class="my-4 w-full">Réinitialiser les filtres</Button>

            <ScrollArea class="w-full h-[calc(100%-140px)]">
                <UseFilterTemplate />
            </ScrollArea>
        </SheetContent>
    </Sheet>

    <Drawer v-model:open="isOpen" v-if="isMobile">
        <DrawerContent>
            <ScrollArea class="w-full h-[60vh]">
                <DrawerHeader>
                    <DrawerTitle>Filtres</DrawerTitle>
                    <DrawerDescription>Ajoutez des filtres à votre recherche pour l'affiner à l'aide des champs
                        ci-dessous.
                    </DrawerDescription>
                </DrawerHeader>

                <div class="w-full mx-auto max-w-[25rem] px-4 mb-6">
                    <Button class="my-4 w-full">Réinitialiser les filtres</Button>

                    <UseFilterTemplate />
                </div>
            </ScrollArea>
        </DrawerContent>
    </Drawer>
</template>