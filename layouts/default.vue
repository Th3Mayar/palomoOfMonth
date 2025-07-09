<template>
  <div class="min-h-screen bg-background text-foreground">
    <slot />
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
