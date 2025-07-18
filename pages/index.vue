<template>
  <div class="py-4 sm:py-8">
    <!-- Alerts container -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert v-for="(alert, index) in alerts" :key="alert.id" :alert="alert" :index="index" @remove="removeAlert" />
    </div>

    <!-- Header with navigation -->
    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
      <!-- Logo and title section -->
      <div class="flex items-center justify-center lg:justify-start space-x-3">
        <div class="w-10 h-10 bg-button-primary rounded-lg flex items-center justify-center">
          <span class="text-white font-bold">P</span>
        </div>
        <h1 class="text-xl sm:text-1xl lg:text-1xl font-bold text-foreground font-poppins text-center lg:text-left">
          Palomo of the Month
        </h1>
      </div>

      <!-- Navigation section -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center lg:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <!-- Settings button always visible for testing -->
        <Button as="button" @click.prevent="navigateTo('/settings')" variant="ghost" size="sm" class="w-full sm:w-auto">
          <Settings class="mr-2 h-4 w-4" />
          Settings
        </Button>

        <!-- Authentication buttons -->
        <Button v-if="!isLoggedIn" ref="loginButtonRef" as="button" @click.prevent="navigateTo('/auth/login')"
          variant="default" class="w-full sm:w-auto">
          <LogIn class="mr-2 h-4 w-4" />
          Sign In
        </Button>

        <!-- User info and logout (responsive) -->
        <div v-else class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <span class="text-foreground text-sm sm:text-base text-center sm:text-left">
            Hello, {{ user?.name || 'User' }}!
          </span>
          <Button @click="logout" variant="outline" size="sm" class="w-full sm:w-auto">
            <LogOut class="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>

    <div class="text-center px-4 sm:px-0">
      <p class="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
        {{ isLoggedIn ? 'Welcome back' : 'Welcome to the application' }} to recognize the outstanding palomo of the
        month
      </p>

      <!-- Cards Grid - Responsive -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto" :class="{
        'sm:!grid-cols-1 !max-w-2xl': !isAdmin,
        'lg:!grid-cols-2 !max-w-3xl': !isAdmin,
        '!max-w-[42rem]': !isAdmin
      }">
        <Card class="hover:shadow-lg transition-shadow h-full" v-show="isAdmin">
          <CardContent class="p-4 sm:p-6 h-full flex flex-col">
            <div
              class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-button-primary/10 rounded-lg mb-3 sm:mb-4 mx-auto">
              <Users class="h-5 w-5 sm:h-6 sm:w-6 text-button-primary" />
            </div>
            <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">Palomos</h2>
            <p class="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow">Manage palomo information and
              records</p>
            <Button @click="handlePalomosClick" class="w-full mt-auto text-sm sm:text-base" variant="default">
              View Palomos
            </Button>
          </CardContent>
        </Card>

        <Card class="hover:shadow-lg transition-shadow h-full" v-show="isAdmin">
          <CardContent class="p-4 sm:p-6 h-full flex flex-col">
            <div
              class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg mb-3 sm:mb-4 mx-auto">
              <UserCog class="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            </div>
            <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">Users</h2>
            <p class="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow">Manage user accounts and
              permissions</p>
            <Button @click="handleUsersClick" class="w-full mt-auto text-sm sm:text-base" variant="default"
              style="background-color: rgb(34 197 94); color: white;">
              View Users
            </Button>
          </CardContent>
        </Card>

        <Card class="hover:shadow-lg transition-shadow h-full">
          <CardContent class="p-4 sm:p-6 h-full flex flex-col">
            <div
              class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-button-secondary/10 rounded-lg mb-3 sm:mb-4 mx-auto">
              <Award class="h-5 w-5 sm:h-6 sm:w-6 text-button-secondary" />
            </div>
            <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">Nominees</h2>
            <p class="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow">Review this month's nominations
            </p>
            <Button @click="handleNomineesClick" variant="secondary" class="w-full mt-auto text-sm sm:text-base">
              View Nominees
            </Button>
          </CardContent>
        </Card>

        <Card class="hover:shadow-lg transition-shadow h-full">
          <CardContent class="p-4 sm:p-6 h-full flex flex-col">
            <div
              class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-button-variant/10 rounded-lg mb-3 sm:mb-4 mx-auto">
              <BarChart3 class="h-5 w-5 sm:h-6 sm:w-6 text-button-variant" />
            </div>
            <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">Scores</h2>
            <p class="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-grow">Check current scores and
              rankings</p>
            <Button @click="handleScoresClick" variant="outline" class="w-full mt-auto text-sm sm:text-base">
              View Scores
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Additional section to show more content -->
      <div class="mt-8 sm:mt-12">
        <h2 class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          <Card>
            <CardContent class="p-4 sm:p-6 text-center">
              <div class="text-button-primary text-3xl sm:text-4xl mb-3 sm:mb-4">🏆</div>
              <h3 class="font-semibold text-foreground mb-2 text-base sm:text-lg">Voting System</h3>
              <p class="text-muted-foreground text-xs sm:text-sm">Vote for the palomo of the month easily and
                transparently</p>
              <Button @click="handleNomineesClick" variant="link" class="w-full text-sm sm:text-base mt-3">
                Vote Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-4 sm:p-6 text-center">
              <div class="text-button-secondary text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
              <h3 class="font-semibold text-foreground mb-2 text-base sm:text-lg">Statistics</h3>
              <p class="text-muted-foreground text-xs sm:text-sm">Review voting statistics and trends to guide data‑driven</p>

              <Button @click="handleDashboardClick" variant="link" class="w-full text-sm sm:text-base mt-3">
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Message for unauthenticated users -->
      <div v-if="!isLoggedIn" class="mt-8 sm:mt-12 p-4 sm:p-6 bg-primary/5 rounded-lg max-w-2xl mx-auto">
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-2">
          Ready to participate?
        </h3>
        <p class="text-sm sm:text-base text-muted-foreground mb-4">
          Sign in to vote and see all application features
        </p>
        <Button as="button" @click.prevent="navigateTo('/auth/login')" size="lg" class="w-full sm:w-auto">
          <LogIn class="mr-2 h-4 w-4" />
          Sign In Now
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LogIn, LogOut, Users, Award, BarChart3, Settings, UserCog } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Alert from '~/components/ui/Alert.vue'

// Page configuration
definePageMeta({
  layout: 'default'
})

// Use authentication composable
const { user, isLoggedIn, logout, checkAuth, isAdmin } = useAuth()

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
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    navigateTo('/admin/palomos')
  }
}

// Function to handle Users click
const handleUsersClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Access Required',
      'You must sign in to access the users section'
    )
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    navigateTo('/admin/users')
  }
}

// Function to handle Nominees click
const handleNomineesClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Access Required',
      'You must sign in to access the nominees section'
    )
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    if (isAdmin.value) {
      navigateTo('/admin/nominees')
    } else {
      navigateTo('/nominees')
    }
  }
}

// Function to handle Scores click
const handleScoresClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Access Required',
      'You must sign in to access the scores section'
    )
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    if (isAdmin.value) {
      navigateTo('/admin/scores')
    } else {
      navigateTo('/scores')
    }
  }
}

// Function to handle Dashboard click
const handleDashboardClick = () => {
  if (!isLoggedIn.value) {
    showWarning(
      'Access Required',
      'You must sign in to access the dashboard'
    )
    nextTick(() => {
      if (loginButtonRef.value && loginButtonRef.value.$el) {
        loginButtonRef.value.$el.focus()
      }
    })
  } else {
    navigateTo('/dashboard')
  }
}

// Debug: Watch user changes
watch(user, (newUser) => {
}, { immediate: true, deep: true })

// Check authentication when mounting component
onBeforeMount(() => {
  checkAuth()
})
</script>

<style scoped>
/* Responsive enhancements */
@media (max-width: 640px) {

  /* Mobile-specific adjustments */
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {

  /* Tablet-specific adjustments */
  .grid {
    gap: 1.5rem;
  }
}

/* Smooth transitions for responsive elements */
.transition-shadow {
  transition: box-shadow 0.3s ease-in-out;
}

/* Ensure cards maintain proper aspect ratio on mobile */
@media (max-width: 640px) {
  .card-content {
    min-height: 200px;
  }
}

/* Improve button touch targets on mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px;
    padding: 0.75rem 1rem;
  }
}
</style>