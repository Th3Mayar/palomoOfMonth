interface Alert {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useAlert = () => {
  const alerts = ref<Alert[]>([])

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newAlert: Alert = {
      ...alert,
      id,
      duration: alert.duration || 4000
    }
    
    alerts.value.push(newAlert)
    
    // Auto remove after duration
    setTimeout(() => {
      removeAlert(id)
    }, newAlert.duration)
    
    return id
  }

  const removeAlert = (id: string) => {
    const index = alerts.value.findIndex(alert => alert.id === id)
    if (index > -1) {
      alerts.value.splice(index, 1)
    }
  }

  const showSuccess = (title: string, message?: string) => {
    return addAlert({ type: 'success', title, message })
  }

  const showError = (title: string, message?: string) => {
    return addAlert({ type: 'error', title, message })
  }

  const showWarning = (title: string, message?: string) => {
    return addAlert({ type: 'warning', title, message })
  }

  const showInfo = (title: string, message?: string) => {
    return addAlert({ type: 'info', title, message })
  }

  return {
    alerts: readonly(alerts),
    addAlert,
    removeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}
