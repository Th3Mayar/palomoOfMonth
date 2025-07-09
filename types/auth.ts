// Types for authentication
export interface User {
  id: number | string
  name: string
  email?: string
  avatar?: string
  role?: string
}

export interface LoginCredentials {
  name: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordData {
  email: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  token?: string
  user?: User
  data?: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
