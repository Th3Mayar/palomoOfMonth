<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <!-- Main content area -->
    <main class="flex-1 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
    
    <!-- Responsive footer -->
    <footer class="mt-auto py-4 sm:py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="border-t border-border pt-4 sm:pt-6">
          <div class="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p class="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              © 2025 Palomo of the Month. All rights reserved.
            </p>
            
            <!-- Optional footer links -->
            <div class="flex space-x-4 text-xs sm:text-sm">
              <a href="/privacy" class="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" class="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
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
