<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const model = defineModel<string>()

defineProps<{ values: Array<string>; suffix?: string; isDisabled?: boolean }>()
</script>

<template>
  <Select v-model="model" :disabled="isDisabled">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="value in values"
        :value="value.replace(/ /g, '_').toLowerCase()"
        :key="value"
      >
        <SelectLabel>{{ value }}{{ suffix ? ` ${suffix}` : "" }}</SelectLabel>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
