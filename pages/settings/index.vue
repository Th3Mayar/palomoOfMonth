<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p class="text-muted-foreground">Customize your Palomo of the Month experience</p>
      </div>
      <Button as="a" href="/" variant="outline">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Back to Home
      </Button>
    </div>

    <!-- Alerts -->
    <div class="fixed top-0 right-0 z-50">
      <Alert
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :alert="alert"
        :index="index"
        @remove="removeAlert"
      />
    </div>

    <div class="grid gap-6">
      <!-- Theme Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Palette class="mr-2 h-5 w-5" />
            Theme and Appearance
          </CardTitle>
          <CardDescription>
            Customize the visual theme of the application
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Dark/Light Mode -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Theme Mode</label>
            <div class="flex gap-3">
              <Button 
                @click="setTheme('light')" 
                :variant="currentTheme === 'light' ? 'default' : 'outline'"
                size="sm"
              >
                <Sun class="mr-2 h-4 w-4" />
                Light
              </Button>
              <Button 
                @click="setTheme('dark')" 
                :variant="currentTheme === 'dark' ? 'default' : 'outline'"
                size="sm"
              >
                <Moon class="mr-2 h-4 w-4" />
                Dark
              </Button>
              <Button 
                @click="setTheme('auto')" 
                :variant="currentTheme === 'auto' ? 'default' : 'outline'"
                size="sm"
              >
                <Monitor class="mr-2 h-4 w-4" />
                Auto
              </Button>
            </div>
          </div>

          <!-- Primary Color -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Primary color</label>
            <div class="grid grid-cols-6 gap-2">
              <button
                v-for="color in primaryColors"
                :key="color.name"
                @click="setPrimaryColor(color.value)"
                :class="[
                  'w-10 h-10 rounded-md border-2 transition-all',
                  currentPrimaryColor === color.value ? 'border-gray-900 scale-110' : 'border-gray-300'
                ]"
                :style="{ backgroundColor: color.preview }"
                :title="color.name"
              />
            </div>
          </div>

          <!-- Logo Color -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Logo color</label>
            <div class="flex items-center space-x-4">
              <input
                v-model="logoColor"
                type="color"
                class="w-12 h-10 rounded border border-input"
                @change="updateLogoColor"
              />
              <span class="text-sm text-muted-foreground">{{ logoColor }}</span>
              <Button @click="resetLogoColor" variant="outline" size="sm">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Typography Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Type class="mr-2 h-5 w-5" />
            Typography
          </CardTitle>
          <CardDescription>
            Adjust text size and font family
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Font size -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Font size</label>
            <div class="flex gap-2">
              <Button 
                @click="setFontSize('small')" 
                :variant="currentFontSize === 'small' ? 'default' : 'outline'"
                size="sm"
              >
                Small
              </Button>
              <Button 
                @click="setFontSize('medium')" 
                :variant="currentFontSize === 'medium' ? 'default' : 'outline'"
                size="sm"
              >
                Medium
              </Button>
              <Button 
                @click="setFontSize('large')" 
                :variant="currentFontSize === 'large' ? 'default' : 'outline'"
                size="sm"
              >
                Large
              </Button>
            </div>
          </div>

          <!-- Font family -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Font family</label>
            <select
              v-model="currentFont"
              @change="setFont"
              class="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="poppins">Poppins (Default)</option>
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="opensans">Open Sans</option>
              <option value="lato">Lato</option>
              <option value="system">System font</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <!-- Layout Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Layout class="mr-2 h-5 w-5" />
            Design and Layout
          </CardTitle>
          <CardDescription>
            Customize element arrangement
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Container width -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Container width</label>
            <div class="flex gap-2">
              <Button 
                @click="setContainerWidth('narrow')" 
                :variant="currentContainerWidth === 'narrow' ? 'default' : 'outline'"
                size="sm"
              >
                Narrow
              </Button>
              <Button 
                @click="setContainerWidth('normal')" 
                :variant="currentContainerWidth === 'normal' ? 'default' : 'outline'"
                size="sm"
              >
                Normal
              </Button>
              <Button 
                @click="setContainerWidth('wide')" 
                :variant="currentContainerWidth === 'wide' ? 'default' : 'outline'"
                size="sm"
              >
                Wide
              </Button>
            </div>
          </div>

          <!-- Card spacing -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Card spacing</label>
            <input
              v-model="cardSpacing"
              type="range"
              min="2"
              max="8"
              step="1"
              class="w-full"
              @input="updateCardSpacing"
            />
            <div class="text-sm text-muted-foreground">Spacing: {{ cardSpacing }}</div>
          </div>

          <!-- Border radius -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Border radius</label>
            <div class="flex gap-2">
              <Button 
                @click="setBorderRadius('none')" 
                :variant="currentBorderRadius === 'none' ? 'default' : 'outline'"
                size="sm"
              >
                None
              </Button>
              <Button 
                @click="setBorderRadius('small')" 
                :variant="currentBorderRadius === 'small' ? 'default' : 'outline'"
                size="sm"
              >
                Small
              </Button>
              <Button 
                @click="setBorderRadius('medium')" 
                :variant="currentBorderRadius === 'medium' ? 'default' : 'outline'"
                size="sm"
              >
                Medium
              </Button>
              <Button 
                @click="setBorderRadius('large')" 
                :variant="currentBorderRadius === 'large' ? 'default' : 'outline'"
                size="sm"
              >
                Large
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Language Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Globe class="mr-2 h-5 w-5" />
            Language and Localization
          </CardTitle>
          <CardDescription>
            Configure language and regional format
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Language -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Language</label>
            <select
              v-model="currentLanguage"
              @change="setLanguage"
              class="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <!-- Date format -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Date format</label>
            <select
              v-model="currentDateFormat"
              @change="setDateFormat"
              class="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              <option value="dd-mm-yyyy">DD-MM-YYYY</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <!-- Animations Section -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Zap class="mr-2 h-5 w-5" />
            Animations and Effects
          </CardTitle>
          <CardDescription>
            Control animations and transitions
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Enable animations -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium">Animations</label>
              <p class="text-sm text-muted-foreground">Enable or disable animations</p>
            </div>
            <Button
              @click="toggleAnimations"
              :variant="animationsEnabled ? 'default' : 'outline'"
              size="sm"
            >
              {{ animationsEnabled ? 'Enabled' : 'Disabled' }}
            </Button>
          </div>

          <!-- Transition speed -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Transition speed</label>
            <div class="flex gap-2">
              <Button 
                @click="setTransitionSpeed('slow')" 
                :variant="currentTransitionSpeed === 'slow' ? 'default' : 'outline'"
                size="sm"
              >
                Slow
              </Button>
              <Button 
                @click="setTransitionSpeed('normal')" 
                :variant="currentTransitionSpeed === 'normal' ? 'default' : 'outline'"
                size="sm"
              >
                Normal
              </Button>
              <Button 
                @click="setTransitionSpeed('fast')" 
                :variant="currentTransitionSpeed === 'fast' ? 'default' : 'outline'"
                size="sm"
              >
                Fast
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Actions -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Settings class="mr-2 h-5 w-5" />
            Actions
          </CardTitle>
          <CardDescription>
            Manage your settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-4">
            <Button @click="saveSettings" variant="default">
              <Save class="mr-2 h-4 w-4" />
              Save changes
            </Button>
            <Button @click="resetSettings" variant="outline">
              <RotateCcw class="mr-2 h-4 w-4" />
              Reset to default
            </Button>
            <Button @click="exportSettings" variant="secondary">
              <Download class="mr-2 h-4 w-4" />
              Export settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, Palette, Type, Layout, Globe, Zap, Settings, 
  Save, RotateCcw, Download, Sun, Moon, Monitor
} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import Alert from '~/components/ui/Alert.vue'

// Page configuration
definePageMeta({
  layout: 'default'
})

// Use alerts and theme composables
const { alerts, showSuccess, showInfo, removeAlert } = useAlert()
const { settings, updateSettings, saveSettings: saveThemeSettings, loadSettings } = useTheme()

// Reactive states based on theme composable
const currentTheme = computed({
  get: () => settings.value.theme,
  set: (value) => updateSettings({ theme: value })
})
const currentPrimaryColor = computed({
  get: () => settings.value.primaryColor,
  set: (value) => updateSettings({ primaryColor: value })
})
const logoColor = computed({
  get: () => settings.value.logoColor,
  set: (value) => updateSettings({ logoColor: value })
})
const currentFontSize = computed({
  get: () => settings.value.fontSize,
  set: (value) => updateSettings({ fontSize: value })
})
const currentFont = computed({
  get: () => settings.value.font,
  set: (value) => updateSettings({ font: value })
})
const currentContainerWidth = computed({
  get: () => settings.value.containerWidth,
  set: (value) => updateSettings({ containerWidth: value })
})
const cardSpacing = computed({
  get: () => settings.value.cardSpacing,
  set: (value) => updateSettings({ cardSpacing: value })
})
const currentBorderRadius = computed({
  get: () => settings.value.borderRadius,
  set: (value) => updateSettings({ borderRadius: value })
})
const currentLanguage = computed({
  get: () => settings.value.language,
  set: (value) => updateSettings({ language: value })
})
const currentDateFormat = computed({
  get: () => settings.value.dateFormat,
  set: (value) => updateSettings({ dateFormat: value })
})
const animationsEnabled = computed({
  get: () => settings.value.animations,
  set: (value) => updateSettings({ animations: value })
})
const currentTransitionSpeed = computed({
  get: () => settings.value.transitionSpeed,
  set: (value) => updateSettings({ transitionSpeed: value })
})

// Available primary colors
const primaryColors = [
  { name: 'Purple', value: '#9333EA', preview: '#9333EA' },
  { name: 'Blue', value: '#3B82F6', preview: '#3B82F6' },
  { name: 'Green', value: '#10B981', preview: '#10B981' },
  { name: 'Orange', value: '#F59E0B', preview: '#F59E0B' },
  { name: 'Red', value: '#EF4444', preview: '#EF4444' },
  { name: 'Pink', value: '#EC4899', preview: '#EC4899' },
  { name: 'Indigo', value: '#6366F1', preview: '#6366F1' },
  { name: 'Teal', value: '#14B8A6', preview: '#14B8A6' }
]

// Functions to handle changes
const setTheme = (theme: 'light' | 'dark' | 'auto') => {
  currentTheme.value = theme
  showInfo('Theme updated', `Changed to ${theme} mode`)
}

const setPrimaryColor = (color: string) => {
  currentPrimaryColor.value = color
  showInfo('Color updated', 'Primary color changed')
}

const updateLogoColor = () => {
  // Value updates automatically through computed
  showInfo('Logo updated', 'Logo color changed')
}

const resetLogoColor = () => {
  logoColor.value = currentTheme.value === 'light' ? '#EF6C00' : '#9575CD'
}

const setFontSize = (size: 'small' | 'medium' | 'large') => {
  currentFontSize.value = size
  showInfo('Font size updated')
}

const setFont = () => {
  showInfo('Font updated')
}

const setContainerWidth = (width: 'narrow' | 'normal' | 'wide') => {
  currentContainerWidth.value = width
  showInfo('Container width updated')
}

const updateCardSpacing = () => {
  // Value updates automatically through computed
}

const setBorderRadius = (radius: 'none' | 'small' | 'medium' | 'large') => {
  currentBorderRadius.value = radius
  showInfo('Border radius updated')
}

const setLanguage = () => {
  showInfo('Language changed', `Set to ${currentLanguage.value}`)
}

const setDateFormat = () => {
  showInfo('Date format updated')
}

const toggleAnimations = () => {
  animationsEnabled.value = !animationsEnabled.value
  showInfo(
    'Animations ' + (animationsEnabled.value ? 'enabled' : 'disabled')
  )
}

const setTransitionSpeed = (speed: 'slow' | 'normal' | 'fast') => {
  currentTransitionSpeed.value = speed
  showInfo('Transition speed updated')
}

const saveSettings = () => {
  saveThemeSettings()
  showSuccess('Settings saved', 'All changes have been saved successfully')
}

const resetSettings = () => {
  // Reset using theme composable
  updateSettings({
    theme: 'dark',
    primaryColor: '#9333EA',
    logoColor: '#9575CD',
    fontSize: 'medium',
    font: 'poppins',
    containerWidth: 'normal',
    cardSpacing: 6,
    borderRadius: 'medium',
    language: 'en',
    dateFormat: 'mm/dd/yyyy',
    animations: true,
    transitionSpeed: 'normal'
  })
  
  showSuccess('Settings reset', 'Default values have been restored (dark mode)')
}

const exportSettings = () => {
  const dataStr = JSON.stringify(settings.value, null, 2)
  const dataBlob = new Blob([dataStr], {type: 'application/json'})
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'palomo-settings.json'
  link.click()
  
  showSuccess('Settings exported', 'File downloaded successfully')
}

// Load settings on mount
onMounted(() => {
  loadSettings()
})
</script>