interface LoginRequest {
  name: string
  password: string
}

interface LoginResponse {
  token?: string
  user?: any
  success: boolean
  message?: string
}

export const useAuth = () => {
  const user = ref(null)
  const token = useCookie('auth-token')
  const isLoggedIn = computed(() => !!user.value)

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await $fetch<any>('http://192.3.122.170:90/api/Auth/login', {
        method: 'POST',
        body: credentials,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response && response.token) {
        token.value = response.token
        user.value = response.user || { name: credentials.name }
        
        // Redirigir al usuario
        await navigateTo('/')
        
        return { success: true, ...response }
      }

      return { success: false, message: 'Credenciales inválidas' }
    } catch (error: any) {
      console.error('Error en login:', error)
      return { 
        success: false, 
        message: error?.data?.message || 'Error de conexión' 
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
    logout,
    checkAuth
  }
}
