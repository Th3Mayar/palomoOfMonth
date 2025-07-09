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
        
        // Redirigir al usuario
        await navigateTo('/')
        
        return { success: true, ...data }
      }

      return { success: false, message: 'Credenciales inválidas' }
    } catch (error: any) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        message: error?.data?.message || error?.message || 'Error de conexión' 
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

      return { success: false, message: 'Error en el registro' }
    } catch (error: any) {
      console.error('Error en registro:', error)
      return { 
        success: false, 
        message: error?.data?.message || error?.message || 'Error de conexión' 
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

      return { success: false, message: 'Error al enviar el enlace' }
    } catch (error: any) {
      console.error('Error en forgot password:', error)
      return { 
        success: false, 
        message: error?.data?.message || error?.message || 'Error de conexión' 
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
        // Si tienes un token, establece el usuario
        // En una implementación real, podrías decodificar el JWT o hacer una llamada al servidor
        user.value = { name: 'Usuario' } // Placeholder - aquí podrías obtener info del token
        return true
      } catch (error) {
        // Si hay un error con el token, limpiarlo
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
