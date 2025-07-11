<template>
  <Modal
    :is-open="isOpen"
    title="Delete Employee"
    :close-on-backdrop="!isLoading"
    @close="$emit('cancel')"
  >
    <div class="space-y-4">
      <!-- Warning Icon -->
      <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>

      <!-- Content -->
      <div class="text-center">
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Are you sure you want to delete this employee?
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          This action cannot be undone. The employee "{{ employee?.name }}" will be permanently removed from the system.
        </p>
      </div>

      <!-- Employee Info -->
      <div v-if="employee" class="bg-gray-50 rounded-lg p-3">
        <div class="flex items-center space-x-3">
          <div v-if="employee.image" class="flex-shrink-0">
            <img
              :src="`data:image/jpeg;base64,${employee.image}`"
              :alt="employee.name"
              class="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div v-else class="flex-shrink-0">
            <div class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <div>
            <p class="font-medium text-gray-900">{{ employee.name }}</p>
            <p class="text-sm text-gray-500">ID: {{ employee.id }}</p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="isLoading"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="$emit('confirm')"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Deleting...
        </span>
        <span v-else>
          Delete Employee
        </span>
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import type { Employee } from '~/types/employee';

interface Props {
  isOpen: boolean;
  employee?: Employee | null;
  isLoading?: boolean;
  error?: string | null;
}

withDefaults(defineProps<Props>(), {
  employee: null,
  isLoading: false,
  error: null,
});

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
