import bcrypt from 'bcryptjs';
import { UserService } from '~/services/user/userService';

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
  const isAdmin = ref(false)

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
    return result
  })

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await $fetch<any>('/api/modules/auth/login', {
        method: 'POST',
        body: credentials
      })

      // The API returns { success: true, data: actualResponse }
      if (response.success && response.data) {
        const apiData = response.data
        
        // Check if the API response has the token
        if (apiData.token) {
          token.value = apiData.token
          
          // Set encrypted password in userData for session validation
          const hashedPassword = bcrypt.hashSync(credentials.password, 10);
          const userData = {
            ...(apiData.userData || { name: credentials.name, id_user: 1, role: 'user' }),
            password: hashedPassword
          }
          user.value = userData

          // Store user data in cookie for middleware access
          userCookie.value = userData
          
          await navigateTo('/')
          
          return { success: true, token: apiData.token, user: userData }
        }
      }

      return { success: false, message: 'Invalid credentials or missing token' }
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
    userCookie.value = null
    await navigateTo('/auth/login')
  }
  
  const checkAuth = async () => {
    if (token.value) {
      try {
        // The userCookie should already be deserialized to an object
        if (userCookie.value) {
          user.value = userCookie.value
          isAdmin.value = user.value?.role === 'admin'

          const userData = userCookie.value
          const userId = userData.id || userData.id_user

          const userService = UserService.getInstance()
          const found = await userService.getUserById(userId)

          const passwordMatch = found && found.password && bcrypt.compareSync(found.password, userData.password);

          if (!passwordMatch) {
            token.value = null;
            user.value = null;
            userCookie.value = null;
            isAdmin.value = false;
            return false;
          }

          return true
        } else {
          // Clear token if no user data
          token.value = null
          user.value = null
          return false
        }
      } catch (error) {
        token.value = null
        user.value = null
        userCookie.value = null
        return false
      }
    } else {
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
    checkAuth,
    isAdmin
  }
}
