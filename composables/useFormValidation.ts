import { useForm } from 'vee-validate'
import { Schema } from 'yup'
import type { PartialDeep } from 'type-fest'

interface UseFormValidationOptions<T> {
  schema: Schema<T>
  initialValues?: Partial<T>
}

export const useFormValidation = <T extends Record<string, any>>(
  options: UseFormValidationOptions<T>
) => {
  const { handleSubmit, resetForm, values, errors, isSubmitting } = useForm<T>({
    validationSchema: options.schema as any,
    initialValues: (options.initialValues || {}) as PartialDeep<T, {}>
  })

  const submitForm = handleSubmit(async (values) => {
    // This will be overridden by the component using this composable
    return values
  })

  const resetFormState = () => {
    resetForm()
  }

  return {
    values: readonly(values),
    errors: readonly(errors),
    isSubmitting: readonly(isSubmitting),
    submitForm,
    resetForm: resetFormState,
    handleSubmit
  }
}

// Helper composable for form state management
export const useFormState = () => {
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const setError = (message: string) => {
    error.value = message
    success.value = ''
  }

  const setSuccess = (message: string) => {
    success.value = message
    error.value = ''
  }

  const clearMessages = () => {
    error.value = ''
    success.value = ''
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    success: readonly(success),
    setLoading,
    setError,
    setSuccess,
    clearMessages
  }
}
