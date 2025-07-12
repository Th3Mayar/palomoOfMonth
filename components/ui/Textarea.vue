<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="[
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      error ? 'border-destructive' : '',
      disabled ? 'cursor-not-allowed opacity-50' : '',
      className
    ]"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :maxlength="maxlength"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
interface TextareaProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  rows?: number
  maxlength?: number
  className?: string
}

interface TextareaEmits {
  'update:modelValue': [value: string]
}

withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  error: false,
  rows: 3,
  className: ''
})

defineEmits<TextareaEmits>()
</script>
