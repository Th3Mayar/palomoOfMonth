<template>
    <ParticlesBg class="h-full" />
    <div class="min-h-screen bg-bg-dark-background/50 flex items-center justify-center relative z-10">
        <SnakeGame class="h-full relative" />
    </div>
</template>


<script setup lang="ts">
import ParticlesBg from '~/components/ui/ParticlesBg.vue';
import SnakeGame from '~/components/ui/SnakeGame.vue'

// Page configuration
definePageMeta({
    middleware: 'auth',
    layout: 'auth-layout'
})
</script>