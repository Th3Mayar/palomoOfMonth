<template>
  <div class="min-h-screen bg-background text-textPrimary">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Inicializar el tema por defecto (dark mode)
const { initializeTheme } = useTheme()

onMounted(() => {
  initializeTheme()
})
</script>

<style scoped>
/* Layout específico si es necesario */
</style>
