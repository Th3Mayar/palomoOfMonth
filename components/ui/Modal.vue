<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div 
          class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              @click="$emit('close')"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Body -->
          <div class="p-4">
            <slot></slot>
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="flex items-center justify-end gap-2 p-4 border-t bg-gray-50">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
  title: string;
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closeOnBackdrop: true,
});

const emit = defineEmits<{
  close: [];
}>();

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close');
  }
};

// Prevent body scroll when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = '';
  }
});
</script>
