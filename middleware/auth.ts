import { User, UserApiResponse } from "~/types/user"
import { UserService } from "~/services/user/userService"

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth-token')
  const userCookie = useCookie('user-data', { 
    maxAge: 60 * 60 * 24, // 1 day
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

  // If the user change the password, close all sesions
  if (token.value && userCookie.value && (userCookie.value as User).id) {
    try {
      const userData = userCookie.value as User;
      const userService = UserService.getInstance();
      const found = await userService.getUserById(userData.id);
      if (found && found.password && userData.password !== found.password) {
        token.value = null
        userCookie.value = null
        return navigateTo('/auth/login')
      }
    } catch (e) {
      token.value = null
      userCookie.value = null
      return navigateTo('/auth/login')
    }
  }
  
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
