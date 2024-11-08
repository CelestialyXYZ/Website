<script setup lang="ts">
import { RouterView } from "vue-router"

import PageLoader from "./components/PageLoader.vue"

import { useSessionStore } from "@/stores/session"

import TopNavbar from "@/components/TopNavigationBar.vue"
import BottomFooter from "@/components/BottomFooter.vue"

var session = useSessionStore()

session.checkLocation()
</script>

<template>
  <PageLoader />

  <TopNavbar />

  <router-view class="px-8 mt-10" />

  <BottomFooter />
</template>
