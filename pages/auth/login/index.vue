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
        <VeeForm 
          @submit="handleLogin" 
          :validation-schema="loginSchema" 
          class="space-y-4"
        >
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-foreground">
              Username
            </label>
            <div class="relative">
              <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <VeeField
                name="name"
                v-slot="{ field, errorMessage }"
              >
                <Input
                  v-bind="field"
                  id="name"
                  type="text"
                  placeholder="Enter your username"
                  :class="`pl-10 ${errorMessage ? 'border-destructive' : ''}`"
                />
              </VeeField>
            </div>
            <VeeErrorMessage name="name" class="text-sm text-destructive" />
          </div>
          
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-foreground">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <VeeField
                name="password"
                v-slot="{ field, errorMessage }"
              >
                <Input
                  v-bind="field"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  :class="`pl-10 ${errorMessage ? 'border-destructive' : ''}`"
                />
              </VeeField>
            </div>
            <VeeErrorMessage name="password" class="text-sm text-destructive" />
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
        </VeeForm>

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
import { loginSchema } from '~/lib/validationSchemas'
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

const loading = ref(false)
const error = ref('')
const success = ref('')

// Authentication composable
const { login } = useAuth()

// Function to handle login
const handleLogin = async (values: any) => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await login({
      name: values.name,
      password: values.password
    })

    if (result.success) {
      success.value = 'Login successful. Redirecting...'
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

// Clear messages when component mounts
onMounted(() => {
  error.value = ''
  success.value = ''
})
</script>