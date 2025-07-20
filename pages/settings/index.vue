<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl mt-10">
    <!-- Back to Top Button -->
    <transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full shadow-lg p-3 flex items-center justify-center animate-pulse hover:scale-110 transition-transform"
        aria-label="Back to top"
      >
        <ArrowUp class="h-6 w-6" />
      </button>
    </transition>
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p class="text-muted-foreground">Customize your Palomo of the Month experience</p>
      </div>
      <Button as="button" variant="outline" @click.prevent="navigateTo('/')">
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
      <!-- Account Configuration Section -->
      <Card>
        <CardHeader>
          <div class="flex items-center">
            <User class="mr-2 h-5 w-5" />
            <div>
              <CardTitle>Account Configuration</CardTitle>
              <CardDescription>
                Update your username and password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-6">
          <form @submit="onAccountSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">
                  New Username
                  <span class="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  v-model="accountName"
                  v-bind="accountNameAttrs"
                  :disabled="!isEditingAccount"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-destructive': accountErrors.name }"
                  placeholder="Enter new username"
                />
                <p v-if="accountErrors.name && isEditingAccount" class="text-sm text-destructive">
                  {{ accountErrors.name }}
                </p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">
                  New Password
                  <span class="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  v-model="accountPassword"
                  v-bind="accountPasswordAttrs"
                  :disabled="!isEditingAccount"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-destructive': accountErrors.password }"
                  placeholder="Enter new password"
                />
                <p v-if="accountErrors.password && isEditingAccount" class="text-sm text-destructive">
                  {{ accountErrors.password }}
                </p>
              </div>
              <div class="space-y-2 md:col-span-2" v-if="isEditingAccount">
                <label class="text-sm font-medium leading-none">
                  Confirm Password
                  <span class="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  v-model="confirmPassword"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div class="pt-4 border-t flex gap-2">
              <Button type="button" @click="isEditingAccount = true" v-if="!isEditingAccount" class="w-full md:w-auto">
                <Pencil class="mr-2 h-4 w-4" /> Edit
              </Button>
              <!-- Cancel Button -->
              <Button type="button" @click="isEditingAccount = false" v-if="isEditingAccount" class="w-full md:w-auto" variant="outline">
                <ArrowLeft class="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" :disabled="loading || !isEditingAccount" v-if="isEditingAccount" class="w-full md:w-auto">
                <Save class="mr-2 h-4 w-4" />
                {{ loading ? 'Updating...' : 'Update Account' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

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
        <!-- class="space-y-6" -->
        <CardContent>
          <!-- Font size -->
          <div class="space-y-2 hidden">
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
            <Select
              v-model="currentFont"
              :options="fontOptions"
              placeholder="Select font family"
              class="w-full"
              @update:modelValue="setFont"
            />
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
        <CardContent class="">
          <!-- Container width -->
          <div class="space-y-2 hidden">
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
          <div class="space-y-2 hidden">
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
      <Card class="hidden">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { 
  ArrowLeft, Palette, Type, Layout, Globe, Zap, Settings, 
  Save, RotateCcw, Download, Sun, Moon, Monitor, User,
  Pencil, ArrowUp
} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import Alert from '~/components/ui/Alert.vue'
import Select from '~/components/ui/Select.vue'

// Types and Services
import { UserService } from '~/services/user/userService'

// Composables
const { alerts, showSuccess, showError, showInfo, removeAlert } = useAlert()
const { user, checkAuth } = useAuth()

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Validation schema for account update
const accountUpdateSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
})

// Reactive state
const loading = ref(false)
const isEditingAccount = ref(false)
const confirmPassword = ref('')

// Account form
const {
  defineField: defineAccountField,
  handleSubmit: handleAccountSubmit,
  errors: accountErrors,
  setValues: setAccountValues,
} = useForm({
  validationSchema: accountUpdateSchema
})

const [accountName, accountNameAttrs] = defineAccountField('name')
const [accountPassword, accountPasswordAttrs] = defineAccountField('password')

// Custom function to set account values safely
const setAccountData = (userData: { name?: string; password?: string }) => {
  try {
    setAccountValues({
      name: userData.name || '',
      password: userData.password || ''
    })
    confirmPassword.value = ''
    isEditingAccount.value = false
  } catch (error) {
    console.warn('Error setting account values:', error)
    // Fallback: set values directly
    if (userData.name) {
      accountName.value = userData.name
    }
    if (userData.password !== undefined) {
      accountPassword.value = userData.password
    }
  }
}

// Function to get current user data from available sources
const getCurrentUser = () => {
  // Try user from auth composable first
  if (user.value) {
    return user.value
  }
  
  // If not available, try to get from cookies
  if (process.client) {
    try {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
        ?.split('=')[1]
      
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        return userData
      }
    } catch (error) {
      console.warn('Error parsing user cookie:', error)
    }
  }
  
  return null
}

// Form submission handler
const onAccountSubmit = handleAccountSubmit(async (values) => {
  // if (!isEditingAccount.value) return
  // if (values.password !== confirmPassword.value) {
  //   showError('Error', 'Passwords do not match.')
  //   return
  // }

  // Get current user data from available sources
  const currentUser = getCurrentUser()
  
  if (!currentUser?.id_user) {
    showError('Error', 'User information not available. Please log in again.')
    console.error('No user found. User from auth:', user.value, 'User from cookie:', currentUser)
    return
  }

  // TEMPORAL FIX: Correct the id_employee if it's equal to id_user
  let correctedIdEmployee = currentUser.id_employee
  if (currentUser.id_employee === currentUser.id_user) {
    correctedIdEmployee = currentUser.id_user + 1
    console.warn('⚠️ TEMPORAL FIX: id_employee was equal to id_user, correcting...', {
      original_id_employee: currentUser.id_employee,
      corrected_id_employee: correctedIdEmployee,
      id_user: currentUser.id_user
    })
  }

  // Correct user data structure - use the proper IDs
  const userData = {
    name: values.name || currentUser.name,
    password: values.password,
    // Use the corrected id_employee
    id_employee: correctedIdEmployee
  }

  loading.value = true
  
  try {
    const userService = UserService.getInstance()
    // Use the correct user ID (id_user, not id_employee)
    const updated = await userService.updateUser(currentUser.id_user, userData)
    
    showSuccess('Account updated', 'Your account information has been updated successfully')
    
    // Update the user data in auth composable
    await checkAuth()
    
    // Reset form with new values using our custom function
    setAccountData({
      name: updated.name,
      password: '' // Don't show password
    })
    
  } catch (err: any) {
    console.error('Update error:', err)
    showError('Error', err.message || 'Failed to update account')
  } finally {
    loading.value = false
  }
})

// Use alerts and theme composables
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
const currentFont = ref('poppins')

watch(
  () => settings.value.font,
  (val) => {
    // Map font-family string to select value
    const fontMap: Record<string, string> = {
      'Poppins, sans-serif': 'poppins',
      'Inter, sans-serif': 'inter',
      'Roboto, sans-serif': 'roboto',
      'Open Sans, sans-serif': 'opensans',
      'Lato, sans-serif': 'lato',
      'system-ui, sans-serif': 'system'
    }
    currentFont.value = fontMap[val] || 'poppins'
  },
  { immediate: true }
)

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

// Opciones de tipografía para el Select
const fontOptions = [
  { value: 'poppins', label: 'Poppins (Default)' },
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'opensans', label: 'Open Sans' },
  { value: 'lato', label: 'Lato' },
  { value: 'system', label: 'System font' }
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

const setFont = (val?: string) => {
  // Map value to actual font-family string
  const fontMap: Record<string, string> = {
    poppins: 'Poppins, sans-serif',
    inter: 'Inter, sans-serif',
    roboto: 'Roboto, sans-serif',
    opensans: 'Open Sans, sans-serif',
    lato: 'Lato, sans-serif',
    system: 'system-ui, sans-serif'
  }
  const fontValue = fontMap[val || currentFont.value] || 'Poppins, sans-serif'
  updateSettings({ font: fontValue })
  // For immediate effect, apply the font directly
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty('--font-family-main', fontValue)
  }
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

// Scroll to top functionality
const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Load settings on mount
onBeforeMount(async () => {
  loadSettings()
  
  // Force check auth first to ensure user data is loaded
  try {
    await checkAuth()
  } catch (error) {
    console.error('Auth check failed:', error)
  }
  
  // Try to get user data from any available source
  const currentUser = getCurrentUser()
  
  if (currentUser?.name) {
    setAccountData({
      name: currentUser.name,
      password: '' // Don't pre-fill password
    })
  } else {
    showError('Authentication Error', 'Please log in again to access settings.')
  }
})

// Global event listener for scroll
if (process.client) {
  window.addEventListener('scroll', handleScroll)
}
</script>

<style scoped>
/**** Responsive container padding and max width ****/
.container {
  max-width: 100vw;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
}
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}

/**** Responsive grid gap ****/
.grid {
  gap: 1.5rem;
}
@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }
}

/**** Responsive card padding ****/
.card-content {
  padding: 1rem;
}
@media (min-width: 640px) {
  .card-content {
    padding: 1.5rem;
  }
}

/**** Responsive button spacing ****/
button {
  min-height: 44px;
  padding: 0.75rem 1rem;
}
@media (min-width: 640px) {
  button {
    min-height: 40px;
    padding: 0.5rem 1rem;
  }
}

/**** Responsive font sizes ****/
h1 {
  font-size: 2rem;
}
@media (min-width: 640px) {
  h1 {
    font-size: 2.5rem;
  }
}

/**** Responsive Back to Top button ****/
.fixed.bottom-8.right-8 {
  bottom: 1.5rem;
  right: 1.5rem;
}
@media (max-width: 640px) {
  .fixed.bottom-8.right-8 {
    bottom: 1rem;
    right: 1rem;
  }
}

/**** Responsive form grid ****/
.grid-cols-1.md\:grid-cols-2 {
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr 1fr;
  }
}

/**** Responsive card section spacing ****/
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
@media (max-width: 640px) {
  .space-y-6 > * + * {
    margin-top: 1rem;
  }
}

/**** Fade transition for Back to Top button ****/
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>