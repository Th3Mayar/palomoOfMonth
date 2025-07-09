<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Alerts container -->
    <div class="fixed top-0 right-0 z-50">
      <Alert
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :alert="alert"
        :index="index"
        @remove="removeAlert"
      />
    </div>

    <!-- Header with navigation -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-button-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold">P</span>
        </div>
        <h1 class="text-3xl font-bold text-foreground font-poppins">
          Palomo of the Month
        </h1>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- Settings button always visible for testing -->
        <Button as="a" href="/settings" variant="ghost" size="sm">
          <Settings class="mr-2 h-4 w-4" />
          Settings
        </Button>
        
        <Button v-if="!isLoggedIn" ref="loginButtonRef" as="a" href="/auth/login" variant="default">
          <LogIn class="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <div v-else class="flex items-center space-x-2">
          <span class="text-foreground">Hello, {{ user?.name || 'User' }}</span>
          <Button @click="logout" variant="outline" size="sm">
            <LogOut class="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>

    <div class="text-center">
      <p class="text-lg text-muted-foreground mb-8">
        {{ isLoggedIn ? 'Welcome back' : 'Welcome to the application' }} to recognize the outstanding palomo of the month
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-center justify-center w-12 h-12 bg-button-primary/10 rounded-lg mb-4 mx-auto">
              <Users class="h-6 w-6 text-button-primary" />
            </div>
            <h2 class="text-xl font-semibold mb-3 text-foreground">Palomos</h2>
            <p class="text-muted-foreground mb-4">Manage palomo information</p>
            <Button 
              @click="handlePalomosClick" 
              class="w-full"
              variant="default"
            >
              View Palomos
            </Button>
          </CardContent>
        </Card>
        
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-center justify-center w-12 h-12 bg-button-secondary/10 rounded-lg mb-4 mx-auto">
              <Award class="h-6 w-6 text-button-secondary" />
            </div>
            <h2 class="text-xl font-semibold mb-3 text-foreground">Nominees</h2>
            <p class="text-muted-foreground mb-4">Review this month's nominations</p>
            <Button 
              @click="handleNomineesClick" 
              variant="secondary" 
              class="w-full"
            >
              View Nominees
            </Button>
          </CardContent>
        </Card>
        
        <Card class="hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-center justify-center w-12 h-12 bg-button-variant/10 rounded-lg mb-4 mx-auto">
              <BarChart3 class="h-6 w-6 text-button-variant" />
            </div>
            <h2 class="text-xl font-semibold mb-3 text-foreground">Scores</h2>
            <p class="text-muted-foreground mb-4">Check current scores</p>
            <Button 
              @click="handleScoresClick" 
              variant="outline" 
              class="w-full"
            >
              View Scores
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <!-- Additional section to show more content -->
      <div class="mt-12">
        <h2 class="text-2xl font-semibold mb-6 text-foreground">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card>
            <CardContent class="p-6 text-center">
              <div class="text-button-primary text-4xl mb-4">🏆</div>
              <h3 class="font-semibold text-foreground mb-2">Voting System</h3>
              <p class="text-muted-foreground text-sm">Vote for the palomo of the month easily and transparently</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent class="p-6 text-center">
              <div class="text-button-secondary text-4xl mb-4">📊</div>
              <h3 class="font-semibold text-foreground mb-2">Statistics</h3>
              <p class="text-muted-foreground text-sm">Review voting statistics and trends</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Message for unauthenticated users -->
      <div v-if="!isLoggedIn" class="mt-12 p-6 bg-primary/5 rounded-lg max-w-2xl mx-auto">
        <h3 class="text-lg font-semibold text-foreground mb-2">
          Ready to participate?
        </h3>
        <p class="text-muted-foreground mb-4">
          Sign in to vote and see all application features
        </p>
        <Button as="a" href="/auth/login" size="lg">
          <LogIn class="mr-2 h-4 w-4" />
          Sign In Now
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

// Page configuration
definePageMeta({
  layout: 'default'
})

// Use authentication composable
const { user, isLoggedIn, logout, checkAuth } = useAuth()

// Use alerts composable
const { alerts, showWarning, removeAlert } = useAlert()

// DOM element references
const loginButtonRef = ref(null)

// Function to handle Palomos click
const handlePalomosClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Access Required',
      'You must sign in to access the palomos section'
    )
    
    // Focus login button after a small delay
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    // Logic for authenticated users - navigate to palomos
    navigateTo('/palomos')
  }
}

// Function to handle Nominees click
const handleNomineesClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Access Required',
      'You must sign in to access the nominees section'
    )
    
    // Focus login button after a small delay
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    // Logic for authenticated users - navigate to nominees
    navigateTo('/nominees')
  }
}

// Function to handle Scores click
const handleScoresClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Access Required',
      'You must sign in to access the scores section'
    )
    
    // Focus login button after a small delay
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    // Logic for authenticated users - navigate to scores
    navigateTo('/scores')
  }
}

// Check authentication when mounting component
onMounted(() => {
  checkAuth()
})
</script>