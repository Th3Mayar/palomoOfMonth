<template>
  <DialogTrigger v-bind="$attrs">
    <slot />
  </DialogTrigger>
</template>

<script setup lang="ts">
import { DialogTrigger } from 'radix-vue'
</script>
