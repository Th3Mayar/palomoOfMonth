import * as yup from 'yup'

// Login form validation schema
export const loginSchema = yup.object({
  name: yup
    .string()
    .required('Username is required'),
  password: yup
    .string()
    .required('Password is required'),
})

// Register form validation schema  
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username cannot exceed 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match')
})

// Forgot password form validation schema
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email address')
})

// Reset password form validation schema
export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match')
})

// Employee form validation schema
export const employeeSchema = yup.object({
  name: yup
    .string()
    .required('Employee name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  image: yup
    .string()
    .optional(),
  imageBytes: yup
    .string()
    .optional()
})

// Create employee validation schema
export const createEmployeeSchema = employeeSchema

// Update employee validation schema
export const updateEmployeeSchema = employeeSchema

// User form validation schema
export const userCreateSchema = yup.object({
  name: yup
    .string()
    .required('User name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  id_employee: yup
    .number()
    .required('Employee selection is required')
    .positive('Please select a valid employee')
})

// Update user validation schema  
export const userUpdateSchema = yup.object({
  name: yup
    .string()
    .required('User name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
  id_employee: yup
    .number()
    .required('Employee selection is required')
    .positive('Please select a valid employee')
})