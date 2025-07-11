<template>
  <div class="min-h-screen bg-background text-foreground">
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
// Initialize default theme (dark mode)
const { initializeTheme } = useTheme()

onMounted(() => {
  initializeTheme()
})
</script>

<style scoped>
/* Specific layout styles if needed */
</style>
