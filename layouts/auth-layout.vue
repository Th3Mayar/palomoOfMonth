<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-secondary/20">
    <!-- Header opcional para auth -->
    <div class="absolute top-4 left-4">
      <NuxtLink to="/" class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-button-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">P</span>
        </div>
        <span class="font-semibold text-foreground">Palomo del Mes</span>
      </NuxtLink>
    </div>
    
    <!-- Contenido principal -->
    <slot />
    
    <!-- Footer opcional -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <p class="text-sm text-muted-foreground text-center">
        © 2025 Palomo del Mes. Todos los derechos reservados.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout específico para páginas de autenticación

// Composable de tema
const { initializeTheme, settings } = useTheme()

// Inicializar tema al montar
onMounted(() => {
  initializeTheme()
})

// También aplicar el tema inmediatamente si estamos en el cliente
if (process.client) {
  initializeTheme()
}
</script>

<style scoped>
/* Estilos específicos para el layout de auth */
</style>
