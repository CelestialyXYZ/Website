<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import { Telescope, Sparkles, Compass, Sun } from 'lucide-vue-next'

import Card from '../components/MainView/SuggestionCard.vue'
</script>

<template>
  <section class="py-40 px-10 flex justify-center">
    <div class="text-center">
      <h1
        class="scroll-m-20 font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
      >
        Qu'allez-vous observer <br />
        cette nuit ?
      </h1>
      <h3 class="sm:text-2xl md:text-2xl lg:text-3xl 2xl:text-4xl pt-5 text-muted-foreground">
        Ce soir, le ciel est dégagé c'est parfait pour l'observation du ciel profond !
      </h3>
    </div>
  </section>

  <section class="lg:px-20 px-10">
    <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight mb-10">Recommandé pour vous</h3>
    <div class="flex justify-center">
      <Carousel class="w-11/12">
        <CarouselContent>
          <CarouselItem class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
            <Card
              title="M45 - Pléiades"
              descriptors="Lever : 2h21 - Coucher : 4h12"
              img="https://telescopius.com/img/dsos/b6fb62638c21aec1e70d9a32d1966391_fullhd.webp"
            >
              <Badge>
                <Telescope :size="18" class="mr-2" />
                NGC 1432
              </Badge>
              <Badge>
                <Sparkles :size="18" class="mr-2" />
                Taureau
              </Badge>
              <Badge>
                <Compass :size="18" class="mr-2" />
                Zénith
              </Badge>
              <Badge>
                <Sun :size="18" class="mr-2" />
                Mag : 2.86
              </Badge>
            </Card>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
            <Card
              title="M42 - Nébuleuse d'Orion"
              descriptors="Lever : 18h22 - Coucher : 2h15"
              img="https://telescopius.com/img/dsos/6ad5dfee4eda09255d9a7bd929b23df9_fullhd.webp"
            >
              <Badge>
                <Telescope :size="18" class="mr-2" />
                NGC 1976
              </Badge>
              <Badge>
                <Sparkles :size="18" class="mr-2" />
                Orion
              </Badge>
              <Badge>
                <Compass :size="18" class="mr-2" />
                Sud
              </Badge>
              <Badge>
                <Sun :size="18" class="mr-2" />
                Mag : 4
              </Badge>
            </Card>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
            <Card
              title="M101 - Galaxie du moulinet"
              descriptors="Lever : 20h15 - Coucher : 1h31"
              img="https://telescopius.com/img/dsos/ebecfd13a15702c65b2941eca81b8bcb_fullhd.webp"
            >
              <Badge>
                <Telescope :size="18" class="mr-2" />
                NGC 5457
              </Badge>
              <Badge>
                <Sparkles :size="18" class="mr-2" />
                Grande Ourse
              </Badge>
              <Badge>
                <Compass :size="18" class="mr-2" />
                Nord
              </Badge>
              <Badge>
                <Sun :size="18" class="mr-2" />
                Mag : 7.9
              </Badge>
            </Card>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
            <Card
              title="M101 - Galaxie du moulinet"
              descriptors="Lever : 20h15 - Coucher : 1h31"
              img="https://telescopius.com/img/dsos/ebecfd13a15702c65b2941eca81b8bcb_fullhd.webp"
            >
              <Badge>
                <Telescope :size="18" class="mr-2" />
                NGC 5457
              </Badge>
              <Badge>
                <Sparkles :size="18" class="mr-2" />
                Grande Ourse
              </Badge>
              <Badge>
                <Compass :size="18" class="mr-2" />
                Nord
              </Badge>
              <Badge>
                <Sun :size="18" class="mr-2" />
                Mag : 7.9
              </Badge>
            </Card>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
            <Card
              title="M101 - Galaxie du moulinet"
              descriptors="Lever : 20h15 - Coucher : 1h31"
              img="https://telescopius.com/img/dsos/ebecfd13a15702c65b2941eca81b8bcb_fullhd.webp"
            >
              <Badge>
                <Telescope :size="18" class="mr-2" />
                NGC 5457
              </Badge>
              <Badge>
                <Sparkles :size="18" class="mr-2" />
                Grande Ourse
              </Badge>
              <Badge>
                <Compass :size="18" class="mr-2" />
                Nord
              </Badge>
              <Badge>
                <Sun :size="18" class="mr-2" />
                Mag : 7.9
              </Badge>
            </Card>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
            <Card
              title="M45 - Pléiades"
              descriptors="Lever : 2h21 - Coucher : 4h12"
              img="https://telescopius.com/img/dsos/b6fb62638c21aec1e70d9a32d1966391_fullhd.webp"
            >
              <Badge>
                <Telescope :size="18" class="mr-2" />
                NGC 1432
              </Badge>
              <Badge>
                <Sparkles :size="18" class="mr-2" />
                Taureau
              </Badge>
              <Badge>
                <Compass :size="18" class="mr-2" />
                Zénith
              </Badge>
              <Badge>
                <Sun :size="18" class="mr-2" />
                Mag : 2.86
              </Badge>
            </Card>
          </CarouselItem>
          <CarouselItem class="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
            <Card
              title="M42 - Nébuleuse d'Orion"
              descriptors="Lever : 18h22 - Coucher : 2h15"
              img="https://telescopius.com/img/dsos/6ad5dfee4eda09255d9a7bd929b23df9_fullhd.webp"
            >
              <Badge>
                <Telescope :size="18" class="mr-2" />
                NGC 1976
              </Badge>
              <Badge>
                <Sparkles :size="18" class="mr-2" />
                Orion
              </Badge>
              <Badge>
                <Compass :size="18" class="mr-2" />
                Sud
              </Badge>
              <Badge>
                <Sun :size="18" class="mr-2" />
                Mag : 4
              </Badge>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </section>
</template>
