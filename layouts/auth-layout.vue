<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-secondary/20">
    <!-- Optional auth header -->
    <div class="absolute top-4 left-4">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-button-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">P</span>
        </div>
        <span class="font-semibold text-foreground">Palomo of the Month</span>
      </NuxtLink>
    </div>
    
    <!-- Main content -->
    <slot />
    
    <!-- Optional footer -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <p class="text-sm text-muted-foreground text-center">
        © 2025 Palomo of the Month. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout specific for authentication pages

// Theme composable
const { initializeTheme, settings } = useTheme()

// Initialize theme on mount
onMounted(() => {
  initializeTheme()
})

// Also apply theme immediately if we're on the client
if (process.client) {
  initializeTheme()
}
</script>

<style scoped>
/* Estilos específicos para el layout de auth */
</style>
