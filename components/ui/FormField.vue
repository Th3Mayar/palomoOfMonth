<template>
  <div class="space-y-2">
    <label 
      v-if="label" 
      :for="name" 
      class="text-sm font-medium text-foreground"
    >
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>
    
    <div class="relative">
      <!-- Icon slot -->
      <slot name="icon" />
      
      <VeeField
        :id="name"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        v-slot="{ field, errorMessage }"
      >
        <Input
          v-bind="field"
          :type="type"
          :placeholder="placeholder"
          :class="cn(
            icon && 'pl-10',
            errorMessage && 'border-destructive focus-visible:ring-destructive',
            inputClass
          )"
        />
      </VeeField>
      
      <!-- Error icon -->
      <AlertCircle 
        v-if="errorMessage" 
        class="absolute right-3 top-3 h-4 w-4 text-destructive" 
      />
    </div>
    
    <!-- Error message -->
    <VeeErrorMessage 
      :name="name" 
      class="text-sm text-destructive flex items-center gap-1"
    />
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  icon?: boolean
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  icon: false
})

// Get error message for this field
const { errorMessage } = useField(props.name)
</script>
