export default defineNuxtRouteMiddleware((to) => {
  // Verificar si el usuario está autenticado
  const token = useCookie('auth-token')
  
  // Si no hay token y no está yendo a una página de auth, redirigir al login
  if (!token.value && !to.path.startsWith('/auth')) {
    return navigateTo('/auth/login')
  }
  
  // Si tiene token y está yendo al login, redirigir al home
  if (token.value && to.path === '/auth/login') {
    return navigateTo('/')
  }
})
