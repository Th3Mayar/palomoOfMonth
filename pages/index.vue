<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Contenedor de alertas -->
    <div class="fixed top-0 right-0 z-50">
      <Alert
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :alert="alert"
        :index="index"
        @remove="removeAlert"
      />
    </div>

    <!-- Header con navegación -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-button-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold">P</span>
        </div>
        <h1 class="text-3xl font-bold text-foreground font-poppins">
          Palomo del Mes
        </h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Botón de configuración siempre visible para testing -->
        <Button as="a" href="/settings" variant="ghost" size="sm">
          <Settings class="mr-2 h-4 w-4" />
          Configuración
        </Button>
        
        <Button v-if="!isLoggedIn" ref="loginButtonRef" as="a" href="/auth/login" variant="default">
          <LogIn class="mr-2 h-4 w-4" />
          Iniciar Sesión
        </Button>
        <div v-else class="flex items-center space-x-2">
          <span class="text-foreground">Hola, {{ user?.name || 'Usuario' }}</span>
          <Button @click="logout" variant="outline" size="sm">
            <LogOut class="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>
    </div>

    <div class="text-center">
      <p class="text-lg text-muted-foreground mb-8">
        {{ isLoggedIn ? 'Bienvenido de vuelta' : 'Bienvenido a la aplicación' }} para reconocer al empleado destacado del mes
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-center justify-center w-12 h-12 bg-button-primary/10 rounded-lg mb-4 mx-auto">
              <Users class="h-6 w-6 text-button-primary" />
            </div>
            <h2 class="text-xl font-semibold mb-3 text-foreground">Empleados</h2>
            <p class="text-muted-foreground mb-4">Gestiona la información de los empleados</p>
            <Button 
              @click="handleEmpleadosClick" 
              class="w-full"
              variant="default"
            >
              Ver Empleados
            </Button>
          </CardContent>
        </Card>
        
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-center justify-center w-12 h-12 bg-button-secondary/10 rounded-lg mb-4 mx-auto">
              <Award class="h-6 w-6 text-button-secondary" />
            </div>
            <h2 class="text-xl font-semibold mb-3 text-foreground">Nominados</h2>
            <p class="text-muted-foreground mb-4">Revisa las nominaciones del mes</p>
            <Button 
              @click="handleNominadosClick" 
              variant="secondary" 
              class="w-full"
            >
              Ver Nominados
            </Button>
          </CardContent>
        </Card>
        
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-center justify-center w-12 h-12 bg-button-variant/10 rounded-lg mb-4 mx-auto">
              <BarChart3 class="h-6 w-6 text-button-variant" />
            </div>
            <h2 class="text-xl font-semibold mb-3 text-foreground">Puntuaciones</h2>
            <p class="text-muted-foreground mb-4">Consulta las puntuaciones actuales</p>
            <Button 
              @click="handlePuntuacionesClick" 
              variant="outline" 
              class="w-full"
            >
              Ver Puntuaciones
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <!-- Sección adicional para mostrar más contenido -->
      <div class="mt-12">
        <h2 class="text-2xl font-semibold mb-6 text-foreground">Características principales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardContent class="p-6 text-center">
              <div class="text-button-primary text-4xl mb-4">🏆</div>
              <h3 class="font-semibold text-foreground mb-2">Sistema de votación</h3>
              <p class="text-muted-foreground text-sm">Vota por el empleado del mes de manera fácil y transparente</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-6 text-center">
              <div class="text-button-secondary text-4xl mb-4">📊</div>
              <h3 class="font-semibold text-foreground mb-2">Estadísticas</h3>
              <p class="text-muted-foreground text-sm">Revisa las estadísticas y tendencias de las votaciones</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Mensaje para usuarios no autenticados -->
      <div v-if="!isLoggedIn" class="mt-12 p-6 bg-primary/5 rounded-lg max-w-2xl mx-auto">
        <h3 class="text-lg font-semibold text-foreground mb-2">
          ¿Listo para participar?
        </h3>
        <p class="text-muted-foreground mb-4">
          Inicia sesión para votar y ver todas las funcionalidades de la aplicación
        </p>
        <Button as="a" href="/auth/login" size="lg">
          <LogIn class="mr-2 h-4 w-4" />
          Iniciar Sesión Ahora
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LogIn, LogOut, Users, Award, BarChart3, Settings } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Alert from '~/components/ui/Alert.vue'

// Configuración de la página
definePageMeta({
  layout: 'default'
})

// Usar el composable de autenticación
const { user, isLoggedIn, logout, checkAuth } = useAuth()

// Usar el composable de alertas
const { alerts, showWarning, removeAlert } = useAlert()

// Referencias para elementos del DOM
const loginButtonRef = ref(null)

// Función para manejar clic en Empleados
const handleEmpleadosClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Acceso requerido',
      'Debes iniciar sesión para acceder a la sección de empleados'
    )
    
    // Enfocar el botón de login después de un pequeño delay
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    // Lógica para usuarios autenticados - navegar a empleados
    navigateTo('/employees')
  }
}

// Función para manejar clic en Nominados
const handleNominadosClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Acceso requerido',
      'Debes iniciar sesión para acceder a la sección de nominados'
    )
    
    // Enfocar el botón de login después de un pequeño delay
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    // Lógica para usuarios autenticados - navegar a nominados
    navigateTo('/nominees')
  }
}

// Función para manejar clic en Puntuaciones
const handlePuntuacionesClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Acceso requerido',
      'Debes iniciar sesión para acceder a la sección de puntuaciones'
    )
    
    // Enfocar el botón de login después de un pequeño delay
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    // Lógica para usuarios autenticados - navegar a puntuaciones
    navigateTo('/scores')
  }
}

// Verificar autenticación al montar el componente
onMounted(() => {
  checkAuth()
})
</script>