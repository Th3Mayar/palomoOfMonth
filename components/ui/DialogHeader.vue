<template>
  <div class="flex flex-col space-y-1.5 text-center sm:text-left">
    <DialogTitle 
      v-if="$slots.title"
      class="text-lg font-semibold leading-none tracking-tight"
    >
      <slot name="title" />
    </DialogTitle>
    <DialogDescription 
      v-if="$slots.description"
      class="text-sm text-muted-foreground"
    >
      <slot name="description" />
    </DialogDescription>
  </div>
</template>

<script setup lang="ts">
import { DialogTitle, DialogDescription } from 'radix-vue'
</script>
