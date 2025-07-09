interface LoginRequest {
  name: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface ForgotPasswordRequest {
  email: string
}

interface AuthResponse {
  token?: string
  user?: any
  success: boolean
  message?: string
}

export const useAuth = () => {
  const user = ref(null)
  const token = useCookie('auth-token')
  const isLoggedIn = computed(() => !!user.value)

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const { data } = await $fetch<any>('/api/modules/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (data && data.token) {
        token.value = data.token
        user.value = data.user || { name: credentials.name }
        
        await navigateTo('/')
        
        return { success: true, ...data }
      }

      return { success: false, message: 'Invalid credentials' }
    } catch (error: any) {
      return { 
        success: false, 
        message: error?.data?.message || error?.message || 'Error of connection' 
      }
    }
  }

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const { data } = await $fetch<any>('/api/modules/auth/register', {
        method: 'POST',
        body: userData
      })

      if (data && data.success) {
        return { success: true, ...data }
      }

      return { success: false, message: 'Error on register' }
    } catch (error: any) {
      return { 
        success: false, 
        message: error?.data?.message || error?.message || 'Error of connection' 
      }
    }
  }

  const forgotPassword = async (email: ForgotPasswordRequest): Promise<AuthResponse> => {
    try {
      const { data } = await $fetch<any>('/api/modules/auth/forgot-password', {
        method: 'POST',
        body: email
      })

      if (data && data.success) {
        return { success: true, ...data }
      }

      return { success: false, message: 'Error on forgot password' }
    } catch (error: any) {
      return { 
        success: false, 
        message: error?.data?.message || error?.message || 'Error of connection' 
      }
    }
  }

  const logout = async () => {
    token.value = null
    user.value = null
    await navigateTo('/auth/login')
  }

  const checkAuth = () => {
    if (token.value) {
      try {
        user.value = { name: 'Bartolito' } 
        return true
      } catch (error) {
        token.value = null
        user.value = null
        return false
      }
    }
    return false
  }

  return {
    user: readonly(user),
    isLoggedIn,
    login,
    register,
    forgotPassword,
    logout,
    checkAuth
  }
}
