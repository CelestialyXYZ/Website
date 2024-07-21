<script setup lang="ts">
import { ref } from 'vue'
import { Check, ChevronsUpDown } from 'lucide-vue-next'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

defineProps<{ values: Array<{ label: string; value: string }>, notFoundTitle: string }>()

const open = ref<any>(false)
const value = defineModel<string>()
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button variant="outline" role="combobox" :aria-expanded="open" class="w-full justify-between">
        {{ value ? values.find((data) => data.value === value)?.label : 'Select framework...' }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-full p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Recherche" />
        <CommandEmpty>{{ notFoundTitle }}</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem v-for="data in values" :key="data.value" :value="data.value" @select="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    value = ev.detail.value
                  }
                  open = false
                }
  ">
              {{ data.label }}
              <Check :class="cn('ml-auto h-4 w-4', value === data.value ? 'opacity-100' : 'opacity-0')" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
