<script setup lang="ts">
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from "@/components/ui/menubar"
import { ref } from "vue"

import {
  Glasses,
  Camera,
  Edit3,
  Eye,
  Image,
  Map,
  Maximize2,
  RotateCcw,
  Search,
  Settings,
  Telescope,
  ZoomIn,
  ZoomOut
} from "lucide-vue-next"

const mode = ref("astrophotographie")
</script>

<template>
  <Menubar>
    <!-- Display Menu -->
    <MenubarMenu>
      <MenubarTrigger> Affichage </MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger> <Settings :size="18" class="mr-3" /> Mode </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarRadioGroup v-model="mode">
              <MenubarRadioItem value="astrophotographie">
                <Camera :size="18" class="mr-3" /> Astrophotographie
              </MenubarRadioItem>
              <MenubarRadioItem value="jumelles">
                <Glasses :size="18" class="mr-3" /> Jumelles
              </MenubarRadioItem>
              <MenubarRadioItem value="oculaire">
                <Eye :size="18" class="mr-3" /> Oculaire
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem> <Maximize2 :size="18" class="mr-3" /> Plein écran </MenubarItem>
        <MenubarItem> <Search :size="18" class="mr-3" /> Chercher un objet </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- View Menu -->
    <MenubarMenu>
      <MenubarTrigger> Vue </MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger> <Map :size="18" class="mr-3" /> Atlas </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarRadioGroup value="DSS2 Color">
              <MenubarRadioItem value="Mellinger"> Mellinger </MenubarRadioItem>
              <MenubarRadioItem value="DSS2 Color"> DSS2 Color </MenubarRadioItem>
              <MenubarRadioItem value="DSS2 Blue"> DSS2 Blue </MenubarRadioItem>
              <MenubarRadioItem value="DSS2 Red"> DSS2 Red </MenubarRadioItem>
              <MenubarRadioItem value="2MASS"> 2MASS </MenubarRadioItem>
              <MenubarRadioItem value="GLIMPSE360"> GLIMPSE360 </MenubarRadioItem>
              <MenubarRadioItem value="Fermi"> Fermi </MenubarRadioItem>
              <MenubarRadioItem value="XMM PN"> XMM PN </MenubarRadioItem>
              <MenubarRadioItem value="Chandra"> Chandra </MenubarRadioItem>
              <MenubarRadioItem value="GALEXGR6_7"> GALEXGR6_7 </MenubarRadioItem>
              <MenubarRadioItem value="Finkbeiner"> Finkbeiner </MenubarRadioItem>
              <MenubarRadioItem value="SDSS9"> SDSS9 </MenubarRadioItem>
              <MenubarRadioItem value="VTSS Ha"> VTSS Ha </MenubarRadioItem>
              <MenubarRadioItem value="PanSTARRS DR1 color"> PanSTARRS DR1 color </MenubarRadioItem>
              <MenubarRadioItem value="DECaPS DR2"> DECaPS DR2 </MenubarRadioItem>
              <MenubarRadioItem value="DESI Legacy DR10"> DESI Legacy DR10 </MenubarRadioItem>
              <MenubarRadioItem value="SPITZER"> SPITZER </MenubarRadioItem>
              <MenubarRadioItem value="allWISE"> allWISE </MenubarRadioItem>
              <MenubarRadioItem value="IRIS"> IRIS </MenubarRadioItem>
              <MenubarRadioItem value="AKARI FIS"> AKARI FIS </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSub>
          <MenubarSubTrigger> <Image :size="18" class="mr-3" /> Image </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem> <Settings :size="18" class="mr-3" /> Réglages </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Afficher</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Coordonnées</MenubarItem>
                <MenubarItem>FOV</MenubarItem>
                <MenubarItem>Réticule central</MenubarItem>
                <MenubarItem>Rotation</MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger>Grid</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>Afficher</MenubarItem>
                    <MenubarItem>Réglages</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarSeparator />
        <MenubarItem> <ZoomIn :size="18" class="mr-3" /> Zoomer </MenubarItem>
        <MenubarItem> <ZoomOut :size="18" class="mr-3" /> Dézoomer </MenubarItem>
        <MenubarItem> <Edit3 :size="18" class="mr-3" /> Annoter </MenubarItem>
        <MenubarItem> <Maximize2 :size="18" class="mr-3" /> Plein écran </MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <!-- Settings Menu -->
    <MenubarMenu>
      <MenubarTrigger> Paramètres </MenubarTrigger>
      <MenubarContent>
        <template v-if="mode === 'astrophotographie'">
          <MenubarItem> <Telescope :size="18" class="mr-3" /> Téléscope </MenubarItem>
          <MenubarItem> <Camera :size="18" class="mr-3" /> Caméra </MenubarItem>
          <MenubarItem> <RotateCcw :size="18" class="mr-3" /> Rotation de champ </MenubarItem>
        </template>
        <template v-if="mode === 'jumelles'">
          <MenubarItem> <Binoculars :size="18" class="mr-3" /> Jumelles </MenubarItem>
        </template>
        <template v-if="mode === 'oculaire'">
          <MenubarItem> <Eye :size="18" class="mr-3" /> Oculaire </MenubarItem>
        </template>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>
