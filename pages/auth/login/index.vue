<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access Palomo of the Month
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-foreground">
              Username
            </label>
            <div class="relative">
              <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Enter your username"
                class="pl-10"
                required
              />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-foreground">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                class="pl-10"
                required
              />
            </div>
          </div>
          
          <!-- Error message -->
          <div v-if="error" class="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center">
            <AlertCircle class="h-4 w-4 mr-2" />
            {{ error }}
          </div>
          
          <!-- Success message -->
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
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            Forgot your password?
            <NuxtLink to="/auth/forgot-password" class="text-primary hover:underline">
              Reset password
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

// Page configuration
definePageMeta({
  layout: 'auth-layout'
})

// Form state
const form = reactive({
  name: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Authentication composable
const { login } = useAuth()

// Theme is initialized in auth-layout.vue

// Function to handle login
const handleLogin = async () => {
  if (!form.name || !form.password) {
    error.value = 'Please fill in all fields'
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
      success.value = 'Login successful. Redirecting...'
      // Redirection is handled in the useAuth composable
    } else {
      error.value = result.message || 'Login failed'
    }
  } catch (err: any) {
    error.value = 'Connection error. Please try again.'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}

// Clear form when component mounts
onMounted(() => {
  form.name = ''
  form.password = ''
  error.value = ''
  success.value = ''
})
</script>