<script setup lang="ts">
import { SquareArrowOutUpRight, Sparkles, Map, CloudSun } from "lucide-vue-next"
</script>

<template>
  <main class="mt-20 px-10 sm:px-16">
    <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight transition-colors">
      Remerciements
    </h1>
    <h4 class="scroll-m-20 text-xl mt-4 tracking-tight">
      Ce projet n'aurait probablement jamais vu le jour sans l'aide d'entreprises et d'autres
      projets open-source ou non. Cette page leur est dédiée !
    </h4>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
      <div>
        <div class="flex items-center gap-4">
          <img src="/logos/xata.svg" alt="Xata logo" class="w-12 h-12" />
          <a
            href="https://xata.io/"
            target="_blank"
            class="text-xl text-primary hover:underline inline-flex items-center"
          >
            Xata
            <img src="/assets/golden-badge.svg" class="w-5 h-5 ml-2" />
            <SquareArrowOutUpRight class="w-5 h-5 ml-1 text-primary" />
          </a>
        </div>
        <p class="mt-3 text-justify">
          Xata est une base de données tout en un fonctionnant sous Postgres qui permet de faire des
          recherches avancées sur une base de données. Xata offre des crédits pour nous aider à
          stocker les données !
        </p>
      </div>

      <div>
        <div class="flex items-center gap-4">
          <Map :stroke-width="1.5" class="w-12 h-12" />
          <a
            href="https://openrouteservice.org/"
            target="_blank"
            class="text-xl text-primary hover:underline inline-flex items-center"
          >
            OpenRouteService
            <img src="/assets/golden-badge.svg" class="w-5 h-5 ml-2" />
            <SquareArrowOutUpRight class="w-5 h-5 ml-1 text-primary" />
          </a>
        </div>
        <p class="mt-3 text-justify">
          OpenRouteService est une API qui fournit des fonctionnalitées de géocoding. Ce service
          nous offre son plan pour les projets collaboratifs !
        </p>
      </div>

      <div>
        <div class="flex items-center gap-4">
          <Sparkles :stroke-width="1.5" class="w-12 h-12" />
          <a
            href="https://github.com/mattiaverga/OpenNGC"
            target="_blank"
            class="text-xl text-primary hover:underline inline-flex items-center"
          >
            OpenNGC Project
            <SquareArrowOutUpRight class="w-5 h-5 ml-2 text-primary" />
          </a>
        </div>
        <p class="mt-3 text-justify">
          La base de données open source OpenNGC contient les informations sur les principaux objets
          IC et NGC. Ce projet nous as permis d'établir notre propre base de données.
        </p>
      </div>

      <div>
        <div class="flex items-center gap-4">
          <CloudSun :stroke-width="1.5" class="w-12 h-12" />
          <a
            href="https://open-meteo.com/"
            target="_blank"
            class="text-xl text-primary hover:underline inline-flex items-center"
          >
            Open-Meteo
            <SquareArrowOutUpRight class="w-5 h-5 ml-2 text-primary" />
          </a>
        </div>
        <p class="mt-3 text-justify">
          Open-Meteo est une API open source qui permet d'obtenir de informations précises sur les
          prédictions météo.
        </p>
      </div>

      <div>
        <div class="flex items-center gap-4">
          <img src="/logos/lucide.svg" alt="Lucide logo" class="w-12 h-12" />
          <a
            href="https://lucide.dev/"
            target="_blank"
            class="text-xl text-primary hover:underline inline-flex items-center"
          >
            Lucide Icons
            <SquareArrowOutUpRight class="w-5 h-5 ml-2 text-primary" />
          </a>
        </div>
        <p class="mt-3 text-justify">
          La librairie Lucide Icons est une collection complète de 1500+ icônes vectorielles qui
          sont utilisées sur ce site.
        </p>
      </div>
    </div>

    <div class="inline-flex items-center gap-2 mt-8">
      <img src="/assets/golden-badge.svg" class="w-5 h-5" />
      <p class="text-muted-foreground italic">Ces sites sont affiliés avec Celestialy</p>
    </div>
  </main>
</template>
