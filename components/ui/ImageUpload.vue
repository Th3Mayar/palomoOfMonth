<template>
  <div class="space-y-4">
    <!-- Drag & Drop Area -->
    <div 
      class="border-2 border-dashed border-border rounded-lg p-6 transition-colors duration-200 ease-in-out"
      :class="{
        'border-primary bg-primary/5': isDragging,
        'border-border hover:border-primary/50 hover:bg-muted/20': !isDragging && !imagePreview,
        'border-green-500 bg-green-50 dark:bg-green-900/20': imagePreview && !isDragging
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <!-- No Image State -->
      <div v-if="!imagePreview" class="text-center cursor-pointer">
        <div class="mx-auto w-12 h-12 mb-4">
          <Upload class="w-full h-full text-muted-foreground" />
        </div>
        <div class="space-y-2">
          <p class="text-sm font-medium text-foreground">
            {{ isDragging ? 'Release the image here' : 'Drag an image or click to select' }}
          </p>
          <p class="text-xs text-muted-foreground">
            PNG, JPG, GIF hasta 10MB
          </p>
        </div>
      </div>
      
      <!-- Image Preview State -->
      <div v-else class="text-center">
        <div class="relative inline-block mb-4">
          <img 
            :src="imagePreview" 
            :alt="fileName" 
            class="w-32 h-32 object-cover rounded-lg border-2 border-border shadow-sm"
          />
          <Button
            variant="destructive"
            size="sm"
            class="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
            @click.stop="removeImage"
          >
            <X class="w-3 h-3" />
          </Button>
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium text-foreground">{{ fileName }}</p>
          <p class="text-xs text-muted-foreground">{{ fileSize }}</p>
          <Button 
            variant="outline" 
            size="sm" 
            @click.stop="triggerFileInput"
          >
            <Upload class="w-3 h-3 mr-1" />
            Change Image
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Error Message -->
    <div v-if="error" class="text-sm text-destructive">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload, X } from 'lucide-vue-next'
import Button from './Button.vue'
import { removeBackground } from '~/lib/utils'

interface Props {
  modelValue?: string
  maxSize?: number // on MB
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'file-selected', file: File): void
  (e: 'file-removed'): void
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: 10,
  placeholder: 'Drag and drop an image here'
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const imagePreview = ref<string>('')
const fileName = ref<string>('')
const fileSize = ref<string>('')
const error = ref<string>('')

// Initialize with modelValue if provided
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== imagePreview.value) {
    imagePreview.value = `data:image/jpeg;base64,${newValue}`
    fileName.value = 'Image loaded'
    fileSize.value = 'Loaded'
  }
}, { immediate: true })

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

const processFile = async (file: File) => {
  error.value = ''
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Only image files are allowed'
    return
  }
  
  // Validate file size
  const fileSizeMB = file.size / (1024 * 1024)

  if (fileSizeMB > props.maxSize) {
    error.value = `File size exceeds ${props.maxSize}MB limit`
    return
  }
  
  try {
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
      fileName.value = file.name
      fileSize.value = formatFileSize(file.size)
    }
    reader.readAsDataURL(file)
    
    // Enviar el archivo como FormData al backend para remover el fondo
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch('/api/utils/remove-bg', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.base64) {
        emit('update:modelValue', data.base64)
        emit('file-selected', file)
      } else {
        error.value = 'Error removing background'
      }
    } catch (err) {
      error.value = 'Error processing file'
    }
    
  } catch (err) {
    error.value = 'Error processing file'
  }
}

const removeImage = () => {
  console.log('🖼️ ImageUpload: Removing image')
  imagePreview.value = ''
  fileName.value = ''
  fileSize.value = ''
  error.value = ''
  emit('update:modelValue', '')
  emit('file-removed')
  
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
