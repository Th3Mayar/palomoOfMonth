<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-bold">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a Palomo del Mes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-foreground">
              Usuario
            </label>
            <div class="relative">
              <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Ingresa tu usuario"
                class="pl-10"
                required
              />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Ingresa tu contraseña"
                class="pl-10"
                required
              />
            </div>
          </div>
          
          <!-- Mensaje de error -->
          <div v-if="error" class="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
            <AlertCircle class="h-4 w-4 mr-2" />
            {{ error }}
          </div>
          
          <!-- Mensaje de éxito -->
          <div v-if="success" class="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-md flex items-center">
            <CheckCircle class="h-4 w-4 mr-2" />
            {{ success }}
          </div>
          
          <Button 
            type="submit" 
            class="w-full" 
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </Button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            ¿Olvidaste tu contraseña?
            <NuxtLink to="/auth/forgot-password" class="text-primary hover:underline">
              Recuperar contraseña
            </NuxtLink>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { User, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import Input from '~/components/ui/Input.vue'

// Configuración de la página
definePageMeta({
  layout: 'auth-layout'
})

// Estado del formulario
const form = reactive({
  name: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Composable de autenticación
const { login } = useAuth()

// El tema se inicializa en el layout auth-layout.vue

// Función para manejar el login
const handleLogin = async () => {
  if (!form.name || !form.password) {
    error.value = 'Por favor completa todos los campos'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await login({
      name: form.name,
      password: form.password
    })

    if (result.success) {
      success.value = 'Inicio de sesión exitoso. Redirigiendo...'
      // La redirección se maneja en el composable useAuth
    } else {
      error.value = result.message || 'Error al iniciar sesión'
    }
  } catch (err: any) {
    error.value = 'Error de conexión. Por favor, intenta de nuevo.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Limpiar el formulario cuando se monta el componente
onMounted(() => {
  form.name = ''
  form.password = ''
  error.value = ''
  success.value = ''
})
</script>