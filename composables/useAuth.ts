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
  const token = useCookie('auth-token', { 
    default: () => null,
    serialize: String,
    deserialize: (value) => value 
  })
  const userCookie = useCookie('user-data', { 
    default: () => null,
    serialize: JSON.stringify,
    deserialize: (value) => {
      try {
        return value ? JSON.parse(value) : null
      } catch {
        return null
      }
    }
  })
  
  const isLoggedIn = computed(() => {
    const result = !!user.value && !!token.value
    console.log('🔍 isLoggedIn computed - user:', !!user.value, 'token:', !!token.value, 'result:', result)
    return result
  })

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await $fetch<any>('/api/modules/auth/login', {
        method: 'POST',
        body: credentials
      })

      console.log('🔐 Login full response:', response)
      console.log('🔐 Login response.data:', response.data)

      // The API returns { success: true, data: actualResponse }
      if (response.success && response.data) {
        const apiData = response.data
        
        // Check if the API response has the token
        if (apiData.token) {
          token.value = apiData.token
          
          // Use userData from the API response
          const userData = apiData.userData || { 
            name: credentials.name,
            id_user: 1,
            role: 'user'
          }
          
          user.value = userData
          
          // Store user data in cookie for middleware access
          // useCookie in Nuxt can handle objects directly
          userCookie.value = userData
          
          console.log('✅ Token stored:', token.value)
          console.log('✅ User data stored:', userData)
          console.log('✅ User cookie stored:', userCookie.value)
          console.log('✅ isLoggedIn should be:', !!userData && !!token.value)
          
          await navigateTo('/')
          
          return { success: true, token: apiData.token, user: userData }
        }
      }

      return { success: false, message: 'Invalid credentials or missing token' }
    } catch (error: any) {
      console.error('❌ Login error:', error)
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
    console.log('🚪 Logging out...')
    token.value = null
    user.value = null
    userCookie.value = null
    console.log('✅ Cleared all auth data')
    await navigateTo('/auth/login')
  }

  const checkAuth = () => {
    console.log('🔍 CheckAuth called')
    console.log('🔍 Token value:', token.value)
    console.log('🔍 User cookie value:', userCookie.value)
    console.log('🔍 User cookie type:', typeof userCookie.value)
    
    if (token.value) {
      try {
        // The userCookie should already be deserialized to an object
        if (userCookie.value) {
          user.value = userCookie.value
          console.log('✅ User restored from cookie:', userCookie.value)
          console.log('✅ isLoggedIn computed result:', !!userCookie.value && !!token.value)
          return true
        } else {
          console.log('⚠️ No user cookie found, but token exists')
          // Clear token if no user data
          token.value = null
          user.value = null
          return false
        }
      } catch (error) {
        console.error('❌ Error in checkAuth:', error)
        token.value = null
        user.value = null
        userCookie.value = null
        return false
      }
    } else {
      console.log('⚠️ No token found')
      user.value = null
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
