<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2 truncate">Palomo Management</h1>
        <p class="text-sm sm:text-base text-muted-foreground">Manage your team members and their information</p>
      </div>
      <div class="flex-shrink-0">
        <Button as="button" @click.prevent="navigateTo('/')" variant="outline" class="w-full sm:w-auto">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>

    <!-- Alerts Container -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :alert="alert"
        :index="index"
        @remove="removeAlert"
      />
    </div>

    <!-- Create Palomo Section -->
    <Card class="mb-8">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <UserPlus class="mr-2 h-5 w-5" />
            <div>
              <CardTitle>Add New Palomo</CardTitle>
              <CardDescription>
                Fill in the palomo information below
              </CardDescription>
            </div>
          </div>
          <Button
            @click="toggleAddPalomoSection"
            variant="ghost"
            size="sm"
            class="p-2 transition-transform duration-200 hover:scale-105"
          >
            <ChevronDown v-if="isAddPalomoSectionCollapsed" class="h-4 w-4 transition-transform duration-200" />
            <ChevronUp v-else class="h-4 w-4 transition-transform duration-200" />
          </Button>
        </div>
      </CardHeader>
      <CardContent 
        v-if="!isAddPalomoSectionCollapsed" 
        class="animate-slideDown"
      >
        <form @submit="onCreateSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Full Name
                <span class="text-destructive">*</span>
              </label>
              <input
                type="text"
                v-model="createName"
                v-bind="createNameAttrs"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :class="{ 'border-destructive': createErrors.name }"
                placeholder="Enter palomo's full name"
              />
              <p v-if="createErrors.name" class="text-sm text-destructive">
                {{ createErrors.name }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">Profile Image</label>
              <ImageUpload
                v-model="createImageBytes"
                @file-selected="handleNewImageSelected"
                @file-removed="handleNewImageRemoved"
              />
            </div>
          </div>
          <div>
            <Button
              type="submit"
              :disabled="loading"
              class="w-full md:w-auto"
            >
              <UserPlus class="mr-2 h-4 w-4" />
              {{ loading ? 'Creating...' : 'Create Palomo' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Palomos List -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <Users class="mr-2 h-5 w-5" />
          Palomo List
        </CardTitle>
        <CardDescription>
          Total Palomos: {{ employees.length }}
          <span v-if="searchQuery" class="ml-2">
            ({{ filteredEmployees.length }} filtered)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <!-- Search and Filters -->
        <div class="mb-6 space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search palomos by name..."
                  class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <Button
              v-if="searchQuery"
              @click="clearFilters"
              variant="outline"
              size="sm"
              class="whitespace-nowrap !h-10"
            >
              <X class="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span class="text-muted-foreground">Loading palomos...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-12 space-y-4">
          <div class="text-destructive">
            <AlertTriangle class="h-12 w-12 mx-auto mb-2" />
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground mb-1">Error Loading Data</h3>
            <p class="text-muted-foreground mb-4">{{ error }}</p>
            <Button @click="fetchEmployees" variant="outline">
              <RotateCcw class="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredEmployees.length === 0 && !searchQuery" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Users class="h-12 w-12 text-muted-foreground/50" />
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground mb-1">No Palomos Found</h3>
            <p class="text-muted-foreground">Add your first palomo using the form above.</p>
          </div>
        </div>

        <!-- No Search Results -->
        <div v-else-if="filteredEmployees.length === 0 && searchQuery" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Search class="h-12 w-12 text-muted-foreground/50" />
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground mb-1">No Results Found</h3>
            <p class="text-muted-foreground mb-4">
              No palomos match your search for "{{ searchQuery }}"
            </p>
            <Button @click="clearFilters" variant="outline">
              <X class="mr-2 h-4 w-4" />
              Clear Search
            </Button>
          </div>
        </div>

        <!-- Palomo Table -->
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-20 text-center">Profile</TableHead>
                <TableHead class="flex-1 min-w-0">Name</TableHead>
                <TableHead class="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="employee in filteredEmployees" :key="employee.id">
                <TableCell class="w-20">
                  <div class="flex items-center justify-center">
                    <div 
                      v-if="employee.image" 
                      class="w-10 h-10 rounded-full bg-gray-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      @click="openImagePreview(employee.image, employee.name)"
                    >
                      <img 
                        :src="employee.image" 
                        :alt="`${employee.name}'s profile`"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div v-else class="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Users class="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </TableCell>
                <TableCell class="font-medium flex-1 min-w-0 pr-4">
                  <div class="truncate">{{ employee.name }}</div>
                </TableCell>
                <TableCell class="w-32">
                  <div class="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="openEditModal(employee)"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      @click="openDeleteModal(employee)"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Edit Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="sm:max-w-[525px]">
        <DialogHeader>
          <template #title>Edit Palomo</template>
          <template #description>
            Update the palomo information below
          </template>
        </DialogHeader>
        <form @submit="onEditSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Full Name
              <span class="text-destructive">*</span>
            </label>
            <input
              type="text"
              v-model="editName"
              v-bind="editNameAttrs"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ 'border-destructive': editErrors.name }"
              placeholder="Enter palomo's full name"
            />
            <p v-if="editErrors.name" class="text-sm text-destructive">
              {{ editErrors.name }}
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Profile Image</label>
            <ImageUpload
              v-model="editImageBytes"
              @file-selected="handleEditImageSelected"
              @file-removed="handleEditImageRemoved"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              @click="closeEditModal"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :disabled="loading"
            >
              <Save class="mr-2 h-4 w-4" />
              {{ loading ? 'Updating...' : 'Update Palomo' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Modal -->
    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <template #title>Confirm Delete</template>
          <template #description>
            Are you sure you want to delete this palomo? This action cannot be undone.
          </template>
        </DialogHeader>
        <div class="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800">
          <AlertTriangle class="flex-shrink-0 inline w-4 h-4 mr-3" />
          <span class="sr-only">Warning</span>
          <div>
            <span class="font-medium">Warning!</span> This will permanently delete the palomo record.
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="closeDeleteModal"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            @click="confirmDelete"
            :disabled="loading"
          >
            <Trash2 class="mr-2 h-4 w-4" />
            {{ loading ? 'Deleting...' : 'Delete Palomo' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Image Preview Modal -->
    <Dialog v-model:open="showImagePreview">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <template #title>{{ previewImageName }}</template>
          <template #description>
            Profile Image Preview
          </template>
        </DialogHeader>
        <div class="flex justify-center p-4">
          <img 
            :src="previewImageSrc" 
            :alt="previewImageName" 
            class="max-w-full max-h-96 object-contain rounded-lg border bg-white shadow-md"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="closeImagePreview"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, UserPlus, Users, Save, Trash2, Edit, 
  AlertTriangle, RotateCcw, Search, X, ChevronDown, ChevronUp
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Shadcn UI Components
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import Dialog from '~/components/ui/Dialog.vue'
import DialogContent from '~/components/ui/DialogContent.vue'
import DialogHeader from '~/components/ui/DialogHeader.vue'
import DialogFooter from '~/components/ui/DialogFooter.vue'
import Alert from '~/components/ui/Alert.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import ImageUpload from '~/components/ui/ImageUpload.vue'

import type { Employee } from '~/types/employee'
import { EmployeeService } from '~/services/employee/employeeService'

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Composables
const { showSuccess, showError, showInfo, alerts, removeAlert } = useAlert()

// Validation schemas
const createEmployeeSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  imageBytes: yup.string().optional()
})

const editEmployeeSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  imageBytes: yup.string().optional()
})

// Create form
const { handleSubmit: handleCreateSubmit, defineField: defineCreateField, errors: createErrors, resetForm: resetCreateForm } = useForm({
  validationSchema: createEmployeeSchema,
  initialValues: {
    name: '',
    imageBytes: ''
  }
})

const [createName, createNameAttrs] = defineCreateField('name')
const [createImageBytes] = defineCreateField('imageBytes')

// Edit form  
const { handleSubmit: handleEditSubmit, defineField: defineEditField, errors: editErrors, resetForm: resetEditForm, setValues: setEditValues } = useForm({
  validationSchema: editEmployeeSchema,
  initialValues: {
    name: '',
    imageBytes: ''
  }
})

const [editName, editNameAttrs] = defineEditField('name')
const [editImageBytes, editImageBytesAttrs] = defineEditField('imageBytes')

// State
const loading = ref(false)
const error = ref<string | null>(null)
const employees = ref<Employee[]>([])

// Modal states
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const showImagePreview = ref(false)
const editingEmployeeId = ref<number>(0)
const deletingEmployee = ref<Employee | null>(null)

// Image preview
const previewImageSrc = ref('')
const previewImageName = ref('')

// Image handling
const handleNewImageSelected = (file: File) => {
  showInfo('Image uploaded', 'Profile image has been uploaded successfully')
}

const handleNewImageRemoved = () => {
  showInfo('Image removed', 'Profile image has been removed')
  createImageBytes.value = ''
}

const handleEditImageSelected = (file: File) => {
  showInfo('Image updated', 'Profile image has been updated successfully')
}

const handleEditImageRemoved = () => {
  showInfo('Image removed', 'Profile image has been removed')
  editImageBytes.value = ''
}

// Image preview methods
const openImagePreview = (image: string, employeeName: string) => {
  previewImageSrc.value = image;
  previewImageName.value = `${employeeName}'s Profile`
  showImagePreview.value = true
}

const closeImagePreview = () => {
  showImagePreview.value = false
  previewImageSrc.value = ''
  previewImageName.value = ''
}

// Data fetching
const fetchEmployees = async () => {
  loading.value = true
  error.value = null
  
  try {
    const employeeService = EmployeeService.getInstance()
    employees.value = await employeeService.getAllEmployees()
  } catch (err: any) {
    error.value = err.message || 'Failed to load palomos'
    showError('Error', 'Failed to load palomos')
  } finally {
    loading.value = false
  }
}

// Form submission handlers
const onCreateSubmit = handleCreateSubmit(async (values) => {
  loading.value = true
  
  try {
    const employeeService = EmployeeService.getInstance()
    const created = await employeeService.createEmployee(values)
    
    resetCreateForm()
    showSuccess('Palomo created', `${created.name} has been added successfully`)
    await fetchEmployees()
  } catch (err: any) {
    showError('Error', err.message || 'Failed to create palomo')
  } finally {
    loading.value = false
  }
})

const onEditSubmit = handleEditSubmit(async (values) => {
  loading.value = true
  
  try {
    const employeeService = EmployeeService.getInstance()
    const updated = await employeeService.updateEmployee(editingEmployeeId.value, values)
    
    closeEditModal()
    showSuccess('Palomo updated', `${updated.name} has been updated successfully`)
    await fetchEmployees()
  } catch (err: any) {
    showError('Error', err.message || 'Failed to update palomo')
  } finally {
    loading.value = false
  }
})

// Modal methods
const openEditModal = (employee: Employee) => {
  editingEmployeeId.value = employee.id
  setEditValues({
    name: employee.name,
    imageBytes: employee.imageBytes
  })
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  resetEditForm()
  editingEmployeeId.value = 0
}

const openDeleteModal = (employee: Employee) => {
  deletingEmployee.value = employee
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingEmployee.value = null
}

const confirmDelete = async () => {
  if (!deletingEmployee.value) return
  
  loading.value = true
  
  try {
    const employeeService = EmployeeService.getInstance()
    await employeeService.deleteEmployee(deletingEmployee.value.id)
    
    const deletedName = deletingEmployee.value.name
    closeDeleteModal()
    showSuccess('Palomo deleted', `${deletedName} has been removed successfully`)
    await fetchEmployees()
  } catch (err: any) {
    showError('Error', err.message || 'Failed to delete palomo')
  } finally {
    loading.value = false
  }
}

// Search and filter state
// Search state
const searchQuery = ref('')

// Collapsible sections state
const isAddPalomoSectionCollapsed = ref(true)

// Computed properties for filtering
const filteredEmployees = computed(() => {
  let filtered = [...employees.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(employee => 
      employee.name.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

// Filter methods
const clearFilters = () => {
  searchQuery.value = ''
}

// Toggle methods for collapsible sections
const toggleAddPalomoSection = () => {
  isAddPalomoSectionCollapsed.value = !isAddPalomoSectionCollapsed.value
}

// Initialize data on mount
onMounted(() => {
  fetchEmployees()
})
</script>

<style scoped>
/* Component-specific styles */
.transition-transform {
  transition: transform 0.2s ease-in-out;
}

/* Slide down animation for collapsible content */
.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Table layout optimizations */
:deep(.table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.table th:nth-child(1)),
:deep(.table td:nth-child(1)) {
  width: 80px;
}

:deep(.table th:nth-child(2)),
:deep(.table td:nth-child(2)) {
  width: auto;
  min-width: 200px;
}

:deep(.table th:nth-child(3)),
:deep(.table td:nth-child(3)) {
  width: 140px;
}
</style>