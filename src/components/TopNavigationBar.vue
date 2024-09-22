<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"
import { ref, watch } from "vue"

// Import other components
import { Input } from "@/components/ui/input"
import { Search } from "lucide-vue-next"
import MainLogo from "./MainLogo.vue"
import NavigationComponent from "./NavigationComponent.vue"

const router = useRouter()
const route = useRoute()

// Initialize the query with the existing query param 'q' if present
const query = ref<string>((route.query.q as string) || "")

// Watch for changes in the query parameters in the route and update the ref
watch(
  () => route.query.q,
  (newQuery) => {
    query.value = (newQuery as string) || ""
  }
)

// Function to handle search
const handleSearch = () => {
  router.push({ name: "search", query: { q: query.value }, force: true })
}
</script>

<template>
  <nav
    class="px-7 pt-5 flex flex-row justify-between md:justify-normal md:flex-col gap-5 lg:flex-row lg:gap-0 lg:justify-between items-center"
  >
    <div class="inline-flex items-center bg-gree-500">
      <RouterLink to="/">
        <MainLogo class="h-6 w-36 cursor-pointer" alt="Logo de Celestialy" />
      </RouterLink>
      <div class="relative w-56 ml-7 items-center hidden sm:inline-flex">
        <Input
          id="search"
          type="text"
          placeholder="Recherche"
          v-model="query"
          @keyup.enter="handleSearch"
          class="pl-10"
        />
        <span
          class="absolute start-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer"
          @click="handleSearch"
        >
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
    </div>

    <NavigationComponent />
  </nav>
</template>
