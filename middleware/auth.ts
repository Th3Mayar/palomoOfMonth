export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('auth-token')
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
  
  if (!token.value && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login')
  }
  
  if (token.value && to.path === '/auth/login') {
    return navigateTo('/')
  }
  
  if (token.value && to.path.startsWith('/admin')) {
    try {
      const user = userCookie.value
      
      if (user && user.role === 'admin') {
        // Allow access
      } else {
        return navigateTo('/')
      }
    } catch (error) {
      return navigateTo('/auth/login')
    }
  }
})
