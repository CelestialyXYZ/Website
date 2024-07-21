<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useSessionStore } from '@/stores/session'

import TopNavbar from '@/components/TopNavigationBar.vue'
import BottomNavbar from '@/components/BottomNavigationBar.vue'

var session = useSessionStore()

session.checkLocation()
</script>

<template>
  <TopNavbar />

  <router-view />

  <BottomNavbar />

  <div class="text-center text-2xl bg-yellow-500 bg-opacity-50 py-4">
    🚧 Site en cours de construction 🚧
  </div>
</template>
