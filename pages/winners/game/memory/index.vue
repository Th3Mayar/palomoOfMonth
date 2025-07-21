<template>
  <div class="w-full min-h-screen flex flex-col items-center justify-center">
    <Button as="button" variant="secondary" @click.prevent="navigateTo('/winners')"
      class="text-end justify-end select-none mb-3 flex items-center w-max">
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back
    </Button>
    <h1 class="text-3xl font-bold mb-4">Memory / Pairs</h1>
    <MemoryGame />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import Button from '~/components/ui/Button.vue';
import MemoryGame from '~/components/ui/MemoryGame.vue'

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})
</script>
