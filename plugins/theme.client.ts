// plugins/theme.client.ts
import { defineNuxtPlugin } from '#app'
import { useTheme } from '~/composables/useTheme'
import { watch } from 'vue'

export default defineNuxtPlugin(() => {
  const theme = useTheme()

  // 1️⃣ Initialize default values if none are saved
  theme.initializeTheme()
  // 2️⃣ Load settings from localStorage and apply all changes
  theme.loadSettings()

  // 3️⃣ Watch for changes in settings and reapply each section
  watch(
    () => theme.settings.value,
    (s) => {
      theme.applyTheme(s.theme)
      theme.applyPrimaryColor(s.primaryColor)
      theme.applyLogoColor(s.logoColor)
      theme.applyTypography(s.fontSize, s.font)
      theme.applyLayout(s.containerWidth, s.cardSpacing, s.borderRadius)
      theme.applyLocale(s.language)
      theme.applyAnimations(s.animations, s.transitionSpeed)
    },
    { deep: true, immediate: true }
  )
})