<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-textPrimary mb-2">Configuración</h1>
        <p class="text-textVariant1">Personaliza tu experiencia en Palomo del Mes</p>
      </div>
      <Button as="a" href="/" variant="outline">
        <ArrowLeft class="mr-2 h-4 w-4" />
        Volver al inicio
      </Button>
    </div>

    <!-- Alertas -->
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
      <!-- Sección de Tema -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Palette class="mr-2 h-5 w-5" />
            Tema y Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza el tema visual de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Modo Oscuro/Claro -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Modo de tema</label>
            <div class="flex gap-3">
              <Button 
                @click="setTheme('light')" 
                :variant="currentTheme === 'light' ? 'default' : 'outline'"
                size="sm"
              >
                <Sun class="mr-2 h-4 w-4" />
                Claro
              </Button>
              <Button 
                @click="setTheme('dark')" 
                :variant="currentTheme === 'dark' ? 'default' : 'outline'"
                size="sm"
              >
                <Moon class="mr-2 h-4 w-4" />
                Oscuro
              </Button>
              <Button 
                @click="setTheme('auto')" 
                :variant="currentTheme === 'auto' ? 'default' : 'outline'"
                size="sm"
              >
                <Monitor class="mr-2 h-4 w-4" />
                Automático
              </Button>
            </div>
          </div>

          <!-- Color Principal -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Color principal</label>
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

          <!-- Color del Logo -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Color del logo</label>
            <div class="flex items-center space-x-4">
              <input
                v-model="logoColor"
                type="color"
                class="w-12 h-10 rounded border border-input"
                @change="updateLogoColor"
              />
              <span class="text-sm text-textVariant1">{{ logoColor }}</span>
              <Button @click="resetLogoColor" variant="outline" size="sm">
                Restaurar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Sección de Tipografía -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Type class="mr-2 h-5 w-5" />
            Tipografía
          </CardTitle>
          <CardDescription>
            Ajusta el tamaño y la fuente del texto
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Tamaño de fuente -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Tamaño de fuente</label>
            <div class="flex gap-2">
              <Button 
                @click="setFontSize('small')" 
                :variant="currentFontSize === 'small' ? 'default' : 'outline'"
                size="sm"
              >
                Pequeña
              </Button>
              <Button 
                @click="setFontSize('medium')" 
                :variant="currentFontSize === 'medium' ? 'default' : 'outline'"
                size="sm"
              >
                Mediana
              </Button>
              <Button 
                @click="setFontSize('large')" 
                :variant="currentFontSize === 'large' ? 'default' : 'outline'"
                size="sm"
              >
                Grande
              </Button>
            </div>
          </div>

          <!-- Familia de fuente -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Familia de fuente</label>
            <select
              v-model="currentFont"
              @change="setFont"
              class="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="poppins">Poppins (Por defecto)</option>
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="opensans">Open Sans</option>
              <option value="lato">Lato</option>
              <option value="system">Fuente del sistema</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <!-- Sección de Layout -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Layout class="mr-2 h-5 w-5" />
            Diseño y Layout
          </CardTitle>
          <CardDescription>
            Personaliza la disposición de los elementos
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Ancho del contenedor -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Ancho del contenedor</label>
            <div class="flex gap-2">
              <Button 
                @click="setContainerWidth('narrow')" 
                :variant="currentContainerWidth === 'narrow' ? 'default' : 'outline'"
                size="sm"
              >
                Estrecho
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
                Ancho
              </Button>
            </div>
          </div>

          <!-- Espaciado de las tarjetas -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Espaciado entre tarjetas</label>
            <input
              v-model="cardSpacing"
              type="range"
              min="2"
              max="8"
              step="1"
              class="w-full"
              @input="updateCardSpacing"
            />
            <div class="text-sm text-textVariant1">Espaciado: {{ cardSpacing }}</div>
          </div>

          <!-- Radio de bordes -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Radio de bordes</label>
            <div class="flex gap-2">
              <Button 
                @click="setBorderRadius('none')" 
                :variant="currentBorderRadius === 'none' ? 'default' : 'outline'"
                size="sm"
              >
                Sin bordes
              </Button>
              <Button 
                @click="setBorderRadius('small')" 
                :variant="currentBorderRadius === 'small' ? 'default' : 'outline'"
                size="sm"
              >
                Pequeño
              </Button>
              <Button 
                @click="setBorderRadius('medium')" 
                :variant="currentBorderRadius === 'medium' ? 'default' : 'outline'"
                size="sm"
              >
                Mediano
              </Button>
              <Button 
                @click="setBorderRadius('large')" 
                :variant="currentBorderRadius === 'large' ? 'default' : 'outline'"
                size="sm"
              >
                Grande
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Sección de Idioma -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Globe class="mr-2 h-5 w-5" />
            Idioma y Localización
          </CardTitle>
          <CardDescription>
            Configura el idioma y formato regional
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Idioma -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Idioma</label>
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

          <!-- Formato de fecha -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Formato de fecha</label>
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

      <!-- Sección de Animaciones -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Zap class="mr-2 h-5 w-5" />
            Animaciones y Efectos
          </CardTitle>
          <CardDescription>
            Controla las animaciones y transiciones
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Activar animaciones -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium">Animaciones</label>
              <p class="text-sm text-textVariant1">Activa o desactiva las animaciones</p>
            </div>
            <Button
              @click="toggleAnimations"
              :variant="animationsEnabled ? 'default' : 'outline'"
              size="sm"
            >
              {{ animationsEnabled ? 'Activadas' : 'Desactivadas' }}
            </Button>
          </div>

          <!-- Velocidad de transiciones -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Velocidad de transiciones</label>
            <div class="flex gap-2">
              <Button 
                @click="setTransitionSpeed('slow')" 
                :variant="currentTransitionSpeed === 'slow' ? 'default' : 'outline'"
                size="sm"
              >
                Lenta
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
                Rápida
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Acciones -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center">
            <Settings class="mr-2 h-5 w-5" />
            Acciones
          </CardTitle>
          <CardDescription>
            Gestiona tu configuración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-4">
            <Button @click="saveSettings" variant="default">
              <Save class="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
            <Button @click="resetSettings" variant="outline">
              <RotateCcw class="mr-2 h-4 w-4" />
              Restaurar por defecto
            </Button>
            <Button @click="exportSettings" variant="secondary">
              <Download class="mr-2 h-4 w-4" />
              Exportar configuración
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

// Configuración de la página
definePageMeta({
  layout: 'default'
})

// Usar el composable de alertas y tema
const { alerts, showSuccess, showInfo, removeAlert } = useAlert()
const { settings, updateSettings, saveSettings: saveThemeSettings, loadSettings } = useTheme()

// Estados reactivos basados en el composable de tema
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

// Colores principales disponibles
const primaryColors = [
  { name: 'Morado', value: '#9333EA', preview: '#9333EA' },
  { name: 'Azul', value: '#3B82F6', preview: '#3B82F6' },
  { name: 'Verde', value: '#10B981', preview: '#10B981' },
  { name: 'Naranja', value: '#F59E0B', preview: '#F59E0B' },
  { name: 'Rojo', value: '#EF4444', preview: '#EF4444' },
  { name: 'Rosa', value: '#EC4899', preview: '#EC4899' },
  { name: 'Indigo', value: '#6366F1', preview: '#6366F1' },
  { name: 'Teal', value: '#14B8A6', preview: '#14B8A6' }
]

// Funciones para manejar los cambios
const setTheme = (theme: 'light' | 'dark' | 'auto') => {
  currentTheme.value = theme
  showInfo('Tema actualizado', `Cambiado a modo ${theme}`)
}

const setPrimaryColor = (color: string) => {
  currentPrimaryColor.value = color
  showInfo('Color actualizado', 'Color principal cambiado')
}

const updateLogoColor = () => {
  // El valor se actualiza automáticamente a través del computed
  showInfo('Logo actualizado', 'Color del logo cambiado')
}

const resetLogoColor = () => {
  logoColor.value = currentTheme.value === 'light' ? '#EF6C00' : '#9575CD'
}

const setFontSize = (size: 'small' | 'medium' | 'large') => {
  currentFontSize.value = size
  showInfo('Tamaño de fuente actualizado')
}

const setFont = () => {
  showInfo('Fuente actualizada')
}

const setContainerWidth = (width: 'narrow' | 'normal' | 'wide') => {
  currentContainerWidth.value = width
  showInfo('Ancho del contenedor actualizado')
}

const updateCardSpacing = () => {
  // El valor se actualiza automáticamente a través del computed
}

const setBorderRadius = (radius: 'none' | 'small' | 'medium' | 'large') => {
  currentBorderRadius.value = radius
  showInfo('Radio de bordes actualizado')
}

const setLanguage = () => {
  showInfo('Idioma cambiado', `Configurado a ${currentLanguage.value}`)
}

const setDateFormat = () => {
  showInfo('Formato de fecha actualizado')
}

const toggleAnimations = () => {
  animationsEnabled.value = !animationsEnabled.value
  showInfo(
    'Animaciones ' + (animationsEnabled.value ? 'activadas' : 'desactivadas')
  )
}

const setTransitionSpeed = (speed: 'slow' | 'normal' | 'fast') => {
  currentTransitionSpeed.value = speed
  showInfo('Velocidad de transición actualizada')
}

const saveSettings = () => {
  saveThemeSettings()
  showSuccess('Configuración guardada', 'Todos los cambios han sido guardados correctamente')
}

const resetSettings = () => {
  // Resetear usando el composable de tema
  updateSettings({
    theme: 'dark',
    primaryColor: '#9333EA',
    logoColor: '#9575CD',
    fontSize: 'medium',
    font: 'poppins',
    containerWidth: 'normal',
    cardSpacing: 6,
    borderRadius: 'medium',
    language: 'es',
    dateFormat: 'dd/mm/yyyy',
    animations: true,
    transitionSpeed: 'normal'
  })
  
  showSuccess('Configuración restablecida', 'Se han restaurado los valores por defecto (modo oscuro)')
}

const exportSettings = () => {
  const dataStr = JSON.stringify(settings.value, null, 2)
  const dataBlob = new Blob([dataStr], {type: 'application/json'})
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'palomo-settings.json'
  link.click()
  
  showSuccess('Configuración exportada', 'Archivo descargado correctamente')
}

// Cargar configuración al montar
onMounted(() => {
  loadSettings()
})
</script>