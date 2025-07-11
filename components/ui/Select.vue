<template>
  <div class="relative">
    <button
      type="button"
      @click="toggleDropdown"
      :class="[
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-destructive' : '',
        disabled ? 'cursor-not-allowed opacity-50' : ''
      ]"
      :disabled="disabled"
    >
      <span :class="selectedLabel ? 'text-foreground' : 'text-muted-foreground'">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDown 
        :class="[
          'h-4 w-4 transition-transform duration-200',
          isOpen ? 'rotate-180' : ''
        ]"
      />
    </button>
    
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1 w-full rounded-md border border-input bg-popover shadow-lg"
      >
      <!-- Search Input -->
        <div class="border-b border-border p-2">
          <div class="relative">
            <Search class="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search options..."
              class="w-full pl-8 pr-3 py-1.5 text-sm border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
              @click.stop
              @keydown="handleKeydown"
            />
          </div>
        </div>
        
        <!-- Options List -->
        <div class="max-h-60 overflow-auto py-1">
          <!-- No results message -->
          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-2 text-sm text-muted-foreground text-center"
          >
            No options found
          </div>
        </div>

        <div class="max-h-60 overflow-auto py-1">
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            @mousedown.prevent="selectOption(option)"
            :class="[
              'w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
              selectedValue === option.value ? 'bg-accent text-accent-foreground' : ''
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Search } from 'lucide-vue-next'

interface SelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  disabled: false,
  error: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)

const searchQuery = ref('')

const selectedValue = computed(() => props.modelValue)

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === selectedValue.value)
  return option?.label || ''
})

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value

    // Reset filter values
    searchQuery.value = '';

    // Focus to selectedValue
    // For the future...
  }
}

const closeDropdown = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

const selectOption = (option: SelectOption) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option => 
    option.label.toLowerCase().includes(query)
  )
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
