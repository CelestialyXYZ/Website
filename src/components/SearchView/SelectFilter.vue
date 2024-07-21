<script setup lang="ts">
import { ref, watch } from 'vue'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const model = defineModel<any>()

const modelString = ref<string>(model.value.toString() || '')

watch(model, () => {
  modelString.value = model.value.toString() || ''
})

defineProps<{ values: any[]; suffix?: string }>()

function getValueName(value: any): string {
  if (typeof value === 'string') return value.replace(/ /g, '_').toLowerCase()
  else return value.toString()
}
</script>

<template>
  <Select v-model="modelString">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="value in values" :value="getValueName(value)" :key="value">
        <SelectLabel>{{ value.toString() }}{{ suffix ? ` ${suffix}` : '' }}</SelectLabel>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
