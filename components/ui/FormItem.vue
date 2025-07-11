<template>
  <div class="space-y-2">
    <label 
      v-if="label"
      :for="id"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>
    <Input
      :id="id"
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :class="cn(error && 'border-destructive', props.class)"
      v-bind="$attrs"
    />
    <p v-if="error" class="text-sm text-destructive">
      {{ error }}
    </p>
    <p v-else-if="description" class="text-sm text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import Input from './Input.vue'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  description?: string
  required?: boolean
  class?: string
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

const emit = defineEmits<Emits>()

const value = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value)
})
</script>
