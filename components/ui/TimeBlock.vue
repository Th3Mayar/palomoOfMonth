<template>
  <div class="flex flex-col items-center bg-card rounded-2xl p-4 w-20 shadow-md animate-pulse">
    <span class="text-3xl font-bold">{{ value.toString().padStart(2, '0') }}</span>
    <span class="text-sm text-card-foreground uppercase mt-1 tracking-wide">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: number
}>()
</script>