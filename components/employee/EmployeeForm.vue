<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Name Field -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
        Name *
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter employee name"
        :disabled="isSubmitting"
      />
    </div>

    <!-- Image Upload Field -->
    <div>
      <label for="image" class="block text-sm font-medium text-gray-700 mb-2">
        Employee Image
      </label>
      <div class="space-y-3">
        <!-- File Input -->
        <input
          id="image"
          ref="fileInput"
          type="file"
          accept="image/*"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="handleImageChange"
          :disabled="isSubmitting"
        />
        
        <!-- Image Preview -->
        <div v-if="imagePreview" class="mt-3">
          <p class="text-sm text-gray-600 mb-2">Preview:</p>
          <div class="flex items-center space-x-3">
            <img
              :src="imagePreview"
              alt="Preview"
              class="w-16 h-16 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              @click="removeImage"
              class="text-red-600 hover:text-red-800 text-sm font-medium"
              :disabled="isSubmitting"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :disabled="isSubmitting"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isSubmitting || !formData.name.trim()"
      >
        <span v-if="isSubmitting" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ mode === 'create' ? 'Creating...' : 'Updating...' }}
        </span>
        <span v-else>
          {{ mode === 'create' ? 'Create Employee' : 'Update Employee' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Employee } from '~/types/employee';

interface Props {
  mode: 'create' | 'edit';
  employee?: Employee;
  isSubmitting?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  error: null,
});

const emit = defineEmits<{
  submit: [formData: { name: string; image?: string; imageBytes?: string }];
  cancel: [];
}>();

// Form data
const formData = reactive({
  name: '',
  image: '',
  imageFile: null as File | null,
});

// Image preview
const imagePreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement>();

// Initialize form data
watchEffect(() => {
  if (props.mode === 'edit' && props.employee) {
    formData.name = props.employee.name;
    formData.image = props.employee.image || '';
    
    // Show existing image if available
    if (props.employee.image) {
      imagePreview.value = `data:image/jpeg;base64,${props.employee.image}`;
    }
  } else if (props.mode === 'create') {
    // Reset form for create mode
    formData.name = '';
    formData.image = '';
    formData.imageFile = null;
    imagePreview.value = null;
  }
});

// Handle image file selection
const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    formData.imageFile = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Convert to base64 for API
    try {
      const base64 = await convertImageToBase64(file);
      formData.image = base64;
    } catch (error) {
      console.error('Error converting image:', error);
    }
  }
};

// Convert image to base64
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const base64String = reader.result.toString().split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(file);
  });
};

// Remove image
const removeImage = () => {
  formData.image = '';
  formData.imageFile = null;
  imagePreview.value = null;
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Handle form submission
const handleSubmit = () => {
  if (!formData.name.trim()) {
    return;
  }

  const submitData = {
    name: formData.name.trim(),
    image: formData.image || undefined,
    imageBytes: formData.image || undefined,
  };

  emit('submit', submitData);
};
</script>
