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
  </div>
</template>

<script setup lang="ts">
// Layout specific for authentication pages

// Theme composable
const { initializeTheme } = useTheme()

// Initialize theme on mount
onMounted(() => {
  initializeTheme()
})

// Also apply theme immediately if we're on the client
if (process.client) {
  initializeTheme()
}
</script>

<style>
/* Component-specific styles */
.transition-transform {
  transition: transform 0.2s ease-in-out;
}

/* Slide down animation for collapsible content */
.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Table layout optimizations */
:deep(.table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.table th:nth-child(1)),
:deep(.table td:nth-child(1)) {
  width: 140px;
}

:deep(.table th:nth-child(2)),
:deep(.table td:nth-child(2)) {
  min-width: 200px;
}

:deep(.table th:nth-child(3)),
:deep(.table td:nth-child(3)) {
  width: 80px;
}

:deep(.table th:nth-child(4)),
:deep(.table td:nth-child(4)) {
  width: auto;
}

:deep(.table th:nth-child(5)),
:deep(.table td:nth-child(5)) {
  width: 140px;
}
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23999' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20'><path d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.89-1.99 2L3 20c0 1.1.89 2 2 2h14a2 2 0 0 0 2-2V6c0-1.11-.9-2-2-2zm0 16H5V10h14v10z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem 1rem;
  padding-right: 2.5rem;
  color-scheme: light dark;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0.75rem;
  width: 1rem;
  height: 100%;
  cursor: pointer;
}

.overflow-y-auto {
  height: 100%;
  overflow-x: auto;
  overflow-y: auto;
  scrollbar-color: hsl(var(--border)) transparent;
  scrollbar-width: thin;
}
</style>