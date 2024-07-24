<script setup lang="ts">
import { SquareArrowOutUpRight, Sparkles, Map } from 'lucide-vue-next'
</script>

<template>
    <main class="mt-20 px-16">
        <h1 class="scroll-m-20 text-4xl font-semibold tracking-tight transition-colors">
            Remerciements
        </h1>
        <h4 class="scroll-m-20 text-xl mt-4 tracking-tight">
            Ce projet n'aurait probablement jamais vu le jour sans l'aide d'entreprises et d'autres projets open-source
            ou non.
            Cette page leur est dédiée !
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            <div>
                <div class="flex items-center gap-4">
                    <img src="/logos/xata.svg" alt="Xata logo" class="w-12 h-12">
                    <a href="https://xata.io/" target="_blank"
                        class="text-xl text-primary hover:underline inline-flex items-center">
                        Xata
                        <SquareArrowOutUpRight class="w-5 h-5 ml-2 text-primary" />
                    </a>
                </div>
                <p class="mt-3 text-justify">
                    Xata est une base de données tout en un fonctionnant sous Postgres qui permet de faire des
                    recherches
                    avancées sur une base de données.
                </p>
            </div>

            <div>
                <div class="flex items-center gap-4">
                    <img src="/logos/lucide.svg" alt="Lucide logo" class="w-12 h-12">
                    <a href="https://lucide.dev/" target="_blank"
                        class="text-xl text-primary hover:underline inline-flex items-center">
                        Lucide Icons
                        <SquareArrowOutUpRight class="w-5 h-5 ml-2 text-primary" />
                    </a>
                </div>
                <p class="mt-3 text-justify">
                    La librairie Lucide Icons est une collection de 1500+ icônes vectorielles sous licence ISC.
                </p>
            </div>

            <div>
                <div class="flex items-center gap-4">
                    <Sparkles :stroke-width="1.5" class="w-12 h-12" />
                    <a href="https://github.com/mattiaverga/OpenNGC" target="_blank"
                        class="text-xl text-primary hover:underline inline-flex items-center">
                        OpenNGC Project
                        <SquareArrowOutUpRight class="w-5 h-5 ml-2 text-primary" />
                    </a>
                </div>
                <p class="mt-3 text-justify">
                    La base de données OpenNGC contient les informations sur les principaux objets IC et NGC. A
                    l'inverse d'autres bases de données, OpenNGC est sous licence CC-BY-SA-4.0.
                </p>
            </div>

            <div>
                <div class="flex items-center gap-4">
                    <Map :stroke-width="1.5" class="w-12 h-12" />
                    <a href="https://openrouteservice.org/" target="_blank"
                        class="text-xl text-primary hover:underline inline-flex items-center">
                        OpenRouteService
                        <SquareArrowOutUpRight class="w-5 h-5 ml-2 text-primary" />
                    </a>
                </div>
                <p class="mt-3 text-justify">
                    OpenRouteService est une API qui fournit des fonctionnalitées de géocoding.
                </p>
            </div>
        </div>
    </main>
</template>