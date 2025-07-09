<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <VeeForm 
          @submit="handleForgotPassword" 
          :validation-schema="forgotPasswordSchema"
          class="space-y-4"
        >
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
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </Button>
        </VeeForm>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-muted-foreground">
            Remember your password?
            <NuxtLink to="/auth/login" class="text-primary hover:underline">
              Back to login
            </NuxtLink>
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-vue-next'
import { forgotPasswordSchema } from '~/lib/validationSchemas'

// Page configuration
definePageMeta({
  layout: 'auth-layout'
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Authentication composable
const { forgotPassword } = useAuth()

// Function to handle forgot password
const handleForgotPassword = async (values: any) => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await forgotPassword({
      email: values.email
    })

    if (result.success) {
      success.value = result.message || 'Reset link sent to your email address. Please check your inbox.'
    } else {
      error.value = result.message || 'Failed to send reset link'
    }
    
  } catch (err: any) {
    error.value = 'Failed to send reset link. Please try again.'
    console.error('Forgot password error:', err)
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