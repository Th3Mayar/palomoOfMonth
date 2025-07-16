<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const theme = useTheme()

onBeforeMount(() => {
  theme.initializeTheme()
  theme.loadSettings()
})
</script>
