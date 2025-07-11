<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription>
          Create your account for Palomo of the Month
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <VeeForm 
          @submit="handleRegister" 
          :validation-schema="registerSchema"
          class="space-y-4"
        >
          <div class="space-y-2">
            <label for="name" class="text-sm font-medium text-foreground">
              Username
            </label>
            <div class="relative">
              <User class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <VeeField
                id="name"
                name="name"
                type="text"
                placeholder="Enter your username"
                v-slot="{ field, errorMessage }"
              >
                <Input
                  v-bind="field"
                  :class="errorMessage ? 'border-destructive' : ''"
                  class="pl-10"
                />
              </VeeField>
              <VeeErrorMessage name="name" class="text-sm text-destructive mt-1" />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium text-foreground">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <VeeField
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                v-slot="{ field, errorMessage }"
              >
                <Input
                  v-bind="field"
                  type="email"
                  :class="errorMessage ? 'border-destructive' : ''"
                  class="pl-10"
                />
              </VeeField>
              <VeeErrorMessage name="email" class="text-sm text-destructive mt-1" />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-foreground">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <VeeField
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                v-slot="{ field, errorMessage }"
              >
                <Input
                  v-bind="field"
                  type="password"
                  :class="errorMessage ? 'border-destructive' : ''"
                  class="pl-10"
                />
              </VeeField>
              <VeeErrorMessage name="password" class="text-sm text-destructive mt-1" />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="confirmPassword" class="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <VeeField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                v-slot="{ field, errorMessage }"
              >
                <Input
                  v-bind="field"
                  type="password"
                  :class="errorMessage ? 'border-destructive' : ''"
                  class="pl-10"
                />
              </VeeField>
              <VeeErrorMessage name="confirmPassword" class="text-sm text-destructive mt-1" />
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
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </Button>
        </VeeForm>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-primary hover:underline">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { registerSchema } from '~/lib/validationSchemas'

// Page configuration
definePageMeta({
  layout: 'auth-layout'
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Authentication composable
const { register } = useAuth()

// Function to handle registration
const handleRegister = async (values: any) => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await register({
      name: values.name,
      email: values.email,
      password: values.password
    })

    if (result.success) {
      success.value = 'Account created successfully! Redirecting to login...'
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigateTo('/auth/login')
      }, 2000)
    } else {
      error.value = result.message || 'Registration failed'
    }
    
  } catch (err: any) {
    error.value = 'Registration failed. Please try again.'
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