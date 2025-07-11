// Example composable showing how to use useFetch with the external API
export const useDirectAuth = () => {
  const config = useRuntimeConfig()

  const loginDirect = async (credentials: { name: string; password: string }) => {
    try {
      const { data, error } = await useFetch<any>('/api/modules/auth/login', {
        method: 'POST',
        body: credentials,
        server: true, // Force server-side execution
        key: 'login-request' // Cache key for deduplication
      })

      if (error.value) {
        throw error.value
      }

      return data.value
    } catch (err) {
      throw err
    }
  }

  // Alternative: Direct call to external API using useFetch
  const loginDirectExternal = async (credentials: { name: string; password: string }) => {
    try {
      const { data, error } = await useFetch<any>(`${config.public.apiBaseUrl}/Auth/login`, {
        method: 'POST',
        body: credentials,
        server: true,
        key: `login-external-${credentials.name}`,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (error.value) {
        throw error.value
      }

      return data.value
    } catch (err) {
      throw err
    }
  }

  return {
    loginDirect,
    loginDirectExternal
  }
}
