export default defineNuxtRouteMiddleware((to) => {
  // Verificar si el usuario está autenticado
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
  
  console.log('🛡️ Middleware auth - path:', to.path)
  console.log('🛡️ Token exists:', !!token.value)
  console.log('🛡️ User cookie exists:', !!userCookie.value)
  
  // Si no hay token y no está yendo a una página de auth, redirigir al login
  if (!token.value && !to.path.startsWith('/auth')) {
    console.log('🛡️ No token, redirecting to login')
    return navigateTo('/auth/login')
  }
  
  // Si tiene token y está yendo al login, redirigir al home
  if (token.value && to.path === '/auth/login') {
    console.log('🛡️ Has token but going to login, redirecting to home')
    return navigateTo('/')
  }
  
  // Verificar restricciones de rol para rutas de admin
  if (token.value && to.path.startsWith('/admin')) {
    try {
      const user = userCookie.value
      console.log('🛡️ User from cookie:', user)
      
      // Solo los usuarios con rol "admin" pueden acceder a rutas /admin
      if (user && user.role === 'admin') {
        console.log('✅ Admin user accessing admin routes - allowed')
        // Allow access
      } else {
        console.log('❌ Non-admin user trying to access admin routes - denied')
        return navigateTo('/')
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      return navigateTo('/auth/login')
    }
  }
})
