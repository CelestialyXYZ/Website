<script setup lang="ts">
import { RouterView } from "vue-router"

import { useSessionStore } from "@/stores/session"

import TopNavbar from "@/components/TopNavigationBar.vue"
import BottomFooter from "@/components/BottomFooter.vue"

var session = useSessionStore()

session.checkLocation()
</script>

<template>
  <TopNavbar />

  <router-view />

  <BottomFooter />
</template>
