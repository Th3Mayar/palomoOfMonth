<template>
  <div class="form-field">
    <label 
      v-if="label" 
      :for="name" 
      class="text-sm font-medium text-foreground transition-colors duration-200"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-1">*</span>
    </label>
    
    <div class="field-wrapper">
      <!-- Icon slot -->
      <component 
        v-if="icon" 
        :is="icon" 
        class="field-icon" 
      />
      
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
            'auth-input transition-all duration-200',
            icon && 'pl-10',
            errorMessage ? 'error border-destructive focus-visible:ring-destructive bg-destructive/5' : 'focus-visible:ring-primary',
            inputClass
          )"
        />
        <component 
          v-if="errorMessage" 
          :is="AlertCircle"
          class="error-icon animate-pulse" 
        />
      </VeeField>
    </div>
    
    <!-- Error message -->
    <VeeErrorMessage 
      :name="name" 
      class="error-message animate-slide-in-left"
    />
  </div>
</template>

<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import type { Component } from 'vue'

interface Props {
  name: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  icon?: Component
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
})
</script>
