<script setup lang="ts">
import { Mail, Github, MessagesSquare, Activity } from 'lucide-vue-next'

import { RouterLink } from 'vue-router'

import XataBadge from './XataBadge.vue'
import MainLogo from './MainLogo.vue'
</script>

<template>
  <!-- <div class="w-2/3 lg:px-20 px-10">
    <h4 class="scroll-m-20 mt-10 text-xl font-semibold tracking-tight">
      Citation de la semaine
    </h4>
    <blockquote class="mt-6 border-l-2 pl-6 italic">
      "Deux choses sont infinies : l'Univers et la bêtise humaine. Mais, en ce qui concerne l'Univers, je n'en
      ait pas
      encore acquis la certitude absolue."
    </blockquote>
  </div> -->
  <footer class="mt-20 px-5 sm:px-10 xl:px-16 border-t pt-12">
    <div class="flex flex-col lg:flex-row gap-12 lg:gap-20">
      <div class="flex flex-col items-center sm:flex-row sm:justify-between lg:block">
        <div class="flex flex-col items-center sm:block">
          <MainLogo class="w-40 h-fit" />

          <div class="flex items-center gap-8 sm:gap-6 mt-4">
            <a href="mailto:contact@celestialy.xyz" target="_blank" title="Send us an email at contact@celestialy.xyz">
              <Mail :stroke-width="1.75"
                class="w-7 h-7 text-muted-foreground hover:text-primary-foreground transition-colors duration-100 cursor-pointer" />
            </a>
            <a href="https://github.com/CelestialyXYZ" target="_blank" title="Go to our GitHub">
              <Github :stroke-width="1.75"
                class="w-7 h-7 text-muted-foreground hover:text-primary-foreground transition-colors duration-100 cursor-pointer" />
            </a>
            <a href="https://celestialy.featurebase.app/" target="_blank" title="Tell us what functionalities you need">
              <MessagesSquare :stroke-width="1.75"
                class="w-7 h-7 text-muted-foreground hover:text-primary-foreground transition-colors duration-100 cursor-pointer" />
            </a>
            <a href="https://celestialy.openstatus.dev/" target="_blank" title="Know if everything's fine">
              <Activity :stroke-width="1.75"
                class="w-7 h-7 text-muted-foreground hover:text-primary-foreground transition-colors duration-100 cursor-pointer" />
            </a>
          </div>
        </div>

        <a href="https://xata.io/" target="_blank">
          <XataBadge class="mt-6 sm:mt-0 lg:mt-10" />
        </a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
        <div>
          <h6 class="mb-4 text-lg text-muted-foreground font-semibold">Projet</h6>
          <div class="flex flex-col gap-2">
            <a href="" target="_blank" class="text-red-600 hover:underline">
              Contribuer
            </a>
            <a href="" target="_blank" class="text-red-600 hover:underline">
              À propos
            </a>
            <RouterLink to="/thanks" class="hover:underline">
              Remerciements
            </RouterLink>
          </div>
        </div>

        <div>
          <h6 class="mb-4 text-lg text-muted-foreground font-semibold">Site Web</h6>
          <div class="flex flex-col gap-2">
            <RouterLink to="/" class="hover:underline">
              Accueil
            </RouterLink>
            <a href="https://github.com/CelestialyXYZ/Website" target="_blank" class="text-white hover:underline">
              Code source
            </a>
            <a href="https://celestialy.featurebase.app/fr/roadmap" target="_blank" class="text-white hover:underline">
              Feuille de route
            </a>
            <a href="https://celestialy.featurebase.app/fr/changelog" target="_blank"
              class="text-white hover:underline">
              Annonces
            </a>
          </div>
        </div>

        <div>
          <h6 class="mb-4 text-lg text-muted-foreground font-semibold">Légal</h6>
          <div class="flex flex-col gap-2">
            <a href="" target="_blank" class="text-red-600 hover:underline">
              Sécurité
            </a>
            <a href="" target="_blank" class="text-red-600 hover:underline">
              Confidentialité
            </a>
            <a href="" target="_blank" class="text-red-600 hover:underline">
              Plan du site
            </a>
          </div>
        </div>

        <div>
          <h6 class="mb-4 text-lg text-muted-foreground font-semibold">Contact</h6>
          <div class="flex flex-col gap-2">
            <RouterLink to="/contact" class="hover:underline text-red-600">
              Contactez-nous
            </RouterLink>
            <a href="https://celestialy.featurebase.app/fr/" target="_blank" class="hover:underline">
              Reporter un bug
            </a>
            <a href="https://celestialy.featurebase.app/fr/" target="_blank" class="text-white hover:underline">
              Demander une fonctionnalité
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full bg-yellow-600 bg-opacity-50 mt-8 text-center text-xl p-6 rounded-xl border">
      <h4>Site en cours de développement<br />⚠️ Toutes les fonctionnalitées ne sont pas encore disponibles ⚠️</h4>
    </div>

    <p class="py-6 text-center text-sm text-muted-foreground">
      Site dévelopé par
      <a class="underline" href="https://github.com/Zoliex" target="_blank">Zoliex</a> avec ❤ -
      Celestialy © 2024
    </p>
  </footer>
</template>
