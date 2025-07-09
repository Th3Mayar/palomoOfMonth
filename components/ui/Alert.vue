<template>
  <div 
    :class="cn(
      'fixed rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out transform',
      'max-w-sm w-full mx-4 z-50',
      alertStyles[alert.type],
      'animate-slide-in'
    )"
    :style="{ top: `${index * 80 + 20}px`, right: '20px' }"
  >
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <component :is="alertIcons[alert.type]" class="h-5 w-5" />
      </div>
      <div class="ml-3 flex-1">
        <h3 class="text-sm font-medium">
          {{ alert.title }}
        </h3>
        <p v-if="alert.message" class="mt-1 text-sm opacity-90">
          {{ alert.message }}
        </p>
      </div>
      <div class="ml-4 flex-shrink-0">
        <button
          @click="$emit('remove', alert.id)"
          class="rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
}

interface Props {
  alert: Alert
  index: number
}

defineProps<Props>()
defineEmits<{
  remove: [id: string]
}>()

const alertStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const alertIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
