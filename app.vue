<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '~/composables/useTheme'

const theme = useTheme()

onMounted(() => {
  theme.initializeTheme()
  theme.loadSettings()
})
</script>
