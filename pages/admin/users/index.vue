<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2 truncate">User Management</h1>
        <p class="text-sm sm:text-base text-muted-foreground">Manage user accounts and their information</p>
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

    <!-- Create User Section -->
    <Card class="mb-8">
      <CardHeader>
        <div class="flex items-center">
          <UserPlus class="mr-2 h-5 w-5" />
          <div>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>
              Fill in the user information below
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-6">
        <form @submit="onCreateSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Username
                <span class="text-destructive">*</span>
              </label>
              <input
                type="text"
                v-model="createName"
                v-bind="createNameAttrs"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :class="{ 'border-destructive': createErrors.name }"
                placeholder="Enter user's name"
              />
              <p v-if="createErrors.name" class="text-sm text-destructive">
                {{ createErrors.name }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Password
                <span class="text-destructive">*</span>
              </label>
              <input
                type="password"
                v-model="createPassword"
                v-bind="createPasswordAttrs"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :class="{ 'border-destructive': createErrors.password }"
                placeholder="Enter user's password"
              />
              <p v-if="createErrors.password" class="text-sm text-destructive">
                {{ createErrors.password }}
              </p>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Employee
              <span class="text-destructive">*</span>
            </label>
            <Select
              v-model="createIdEmployee"
              v-bind="createIdEmployeeAttrs"
              :options="employeeOptions"
              placeholder="Select an employee"
              :error="!!createErrors.id_employee"
            />
            <p v-if="createErrors.id_employee" class="text-sm text-destructive">
              {{ createErrors.id_employee }}
            </p>
          </div>
          <div>
            <Button
              type="submit"
              :disabled="loading"
              class="w-full md:w-auto"
            >
              <UserPlus class="mr-2 h-4 w-4" />
              {{ loading ? 'Creating...' : 'Create User' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Users List -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <UserCog class="mr-2 h-5 w-5" />
          User List
        </CardTitle>
        <CardDescription>
          Total Users: {{ users.length }}
          <span v-if="searchQuery" class="ml-2">
            ({{ filteredUsers.length }} filtered)
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
                  placeholder="Search users by name..."
                  class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
            <div class="flex gap-2">
              <Select
                v-model="filterEmployee"
                :options="[{ value: '', label: 'All Employees' }, ...employeeOptions]"
                placeholder="Filter by employee"
                class="w-48"
              />
              <Button
                v-if="searchQuery || filterEmployee"
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
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span class="text-muted-foreground">Loading users...</span>
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
            <Button @click="fetchUsers" variant="outline">
              <RotateCcw class="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-12 space-y-4">
          <UserCog class="h-12 w-12 text-muted-foreground/50" />
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground mb-1">No Users Found</h3>
            <p class="text-muted-foreground">Add your first user using the form above.</p>
          </div>
        </div>

        <!-- No Search Results -->
        <div v-else-if="filteredUsers.length === 0 && (searchQuery || filterEmployee)" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Search class="h-12 w-12 text-muted-foreground/50" />
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground mb-1">No Results Found</h3>
            <p class="text-muted-foreground mb-4">
              No users match your current filters
            </p>
            <Button @click="clearFilters" variant="outline">
              <X class="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        <!-- User Table -->
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-20 text-center">Avatar</TableHead>
                <TableHead class="flex-1 min-w-0">Name</TableHead>
                <TableHead class="w-40">Employee</TableHead>
                <TableHead class="w-24 text-center">Status</TableHead>
                <TableHead class="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="user in filteredUsers" :key="user.id">
                <TableCell class="w-20">
                  <div class="flex items-center justify-center">
                    <div class="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <UserCog class="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </TableCell>
                <TableCell class="flex-1 min-w-0">
                  <div class="font-medium text-foreground truncate">
                    {{ user.name }}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Role: {{ user.role || 'User' }}
                  </div>
                </TableCell>
                <TableCell class="w-40">
                  <span class="text-sm text-muted-foreground">
                    {{ getEmployeeName(user.id_employee) }}
                  </span>
                </TableCell>
                <TableCell class="w-24 text-center">
                  <span 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ user.status ? 'Active' : 'Inactive' }}
                  </span>
                </TableCell>
                <TableCell class="w-32 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <Button 
                      @click="openEditModal(user)" 
                      variant="ghost" 
                      size="sm"
                      class="h-8 w-8 p-0"
                    >
                      <Edit class="h-4 w-4" />
                    </Button>
                    <Button 
                      @click="openDeleteModal(user)" 
                      variant="ghost" 
                      size="sm"
                      :class="`h-8 w-8 p-0 text-destructive hover:text-destructive ${isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`"
                      :disabled="isAdmin"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Edit User Modal -->
    <Dialog v-model:open="showEditModal">
      <DialogContent class="sm:max-w-[525px]">
        <DialogHeader>
          <template #title>Edit User</template>
          <template #description>
            Update the user information below
          </template>
        </DialogHeader>
        <form @submit="onEditSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Username
              <span class="text-destructive">*</span>
            </label>
            <input
              type="text"
              v-model="editName"
              v-bind="editNameAttrs"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ 'border-destructive': editErrors.name }"
              placeholder="Enter user's name"
            />
            <p v-if="editErrors.name" class="text-sm text-destructive">
              {{ editErrors.name }}
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Password
              <span class="text-destructive">*</span>
            </label>
            <input
              type="password"
              v-model="editPassword"
              v-bind="editPasswordAttrs"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ 'border-destructive': editErrors.password }"
              placeholder="Enter new password"
            />
            <p v-if="editErrors.password" class="text-sm text-destructive">
              {{ editErrors.password }}
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Employee
              <span class="text-destructive">*</span>
            </label>
            <Select
              v-model="editIdEmployee"
              v-bind="editIdEmployeeAttrs"
              :options="employeeOptions"
              placeholder="Select an employee"
              :error="!!editErrors.id_employee"
            />
            <p v-if="editErrors.id_employee" class="text-sm text-destructive">
              {{ editErrors.id_employee }}
            </p>
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
              <Edit class="mr-2 h-4 w-4" />
              {{ loading ? 'Updating...' : 'Update User' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete User Modal -->
    <Dialog v-model:open="showDeleteModal">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <template #title>Confirm Delete</template>
          <template #description>
            Are you sure you want to delete this user? This action cannot be undone.
          </template>
        </DialogHeader>
        <div class="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800">
          <AlertTriangle class="flex-shrink-0 inline w-4 h-4 mr-3" />
          <span class="sr-only">Warning</span>
          <div>
            <span class="font-medium">Warning!</span> This will permanently delete the user record.
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
            {{ loading ? 'Deleting...' : 'Delete User' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { 
  ArrowLeft, 
  UserPlus, 
  UserCog, 
  Edit, 
  Trash2, 
  X, 
  AlertTriangle, 
  RotateCcw,
  Search
} from 'lucide-vue-next'

// UI Components
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Alert from '~/components/ui/Alert.vue'
import Select from '~/components/ui/Select.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import Dialog from '~/components/ui/Dialog.vue'
import DialogContent from '~/components/ui/DialogContent.vue'
import DialogHeader from '~/components/ui/DialogHeader.vue'
import DialogFooter from '~/components/ui/DialogFooter.vue'

// Types and Services
import { UserService } from '~/services/user/userService'
import { EmployeeService } from '~/services/employee/employeeService'

// Composables
const { alerts, showSuccess, showError, removeAlert } = useAlert()
const { isAdmin } = useAuth()

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Validation schemas
const userCreateSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  id_employee: yup.number().required('Employee is required')
})

const userUpdateSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  id_employee: yup.number().required('Employee is required')
})

// Reactive state
const users = ref([])
const employees = ref([])
const loading = ref(false)
const error = ref(null)

// Modal state
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingUserId = ref(0)
const deletingUser = ref(null)

// Search and filter state
const searchQuery = ref('')
const filterEmployee = ref('')

// Create form
const {
  defineField: defineCreateField,
  handleSubmit: handleCreateSubmit,
  errors: createErrors,
  resetForm: resetCreateForm
} = useForm({
  validationSchema: userCreateSchema
})

const [createName, createNameAttrs] = defineCreateField('name')
const [createPassword, createPasswordAttrs] = defineCreateField('password')
const [createIdEmployee, createIdEmployeeAttrs] = defineCreateField('id_employee')

// Edit form
const {
  defineField: defineEditField,
  handleSubmit: handleEditSubmit,
  errors: editErrors,
  resetForm: resetEditForm,
  setValues: setEditValues
} = useForm({
  validationSchema: userUpdateSchema
})

const [editName, editNameAttrs] = defineEditField('name')
const [editPassword, editPasswordAttrs] = defineEditField('password')
const [editIdEmployee, editIdEmployeeAttrs] = defineEditField('id_employee')

// Computed properties
const employeeOptions = computed(() => {
  return employees.value.map(employee => ({
    value: employee.id,
    label: employee.name
  }))
})

const filteredUsers = computed(() => {
  let filtered = [...users.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      (user.id_employee && getEmployeeName(user.id_employee).toLowerCase().includes(query))
    )
  }
  
  // Apply employee filter
  if (filterEmployee.value) {
    filtered = filtered.filter(user => user.id_employee === Number(filterEmployee.value))
  }
  
  return filtered
})

// Helper function to get employee name
const getEmployeeName = (employeeId) => {
  const employee = employees.value.find(emp => emp.id === employeeId)
  return employee ? employee.name : 'Unknown Employee'
}

// Data fetching
const fetchUsers = async () => {
  loading.value = true
  error.value = null
  
  try {
    const userService = UserService.getInstance()
    users.value = await userService.getAllUsers()
    
  } catch (err: any) {
    error.value = err.message || 'Failed to load users'
    showError('Error', 'Failed to load users')
  } finally {
    loading.value = false
  }
}

const fetchEmployees = async () => {
  try {
    const employeeService = EmployeeService.getInstance()
    employees.value = await employeeService.getAllEmployees()
    
  } catch (err: any) {
    showError('Error', 'Failed to load employees')
  }
}

// Form submission handlers
const onCreateSubmit = handleCreateSubmit(async (values) => {
  // Ensure id_employee is a number
  const userData = {
    name: values.name,
    password: values.password,
    id_employee: parseInt(values.id_employee, 10)
  }
  
  loading.value = true
  
  try {
    const userService = UserService.getInstance()
    const created = await userService.createUser(userData)
    
    resetCreateForm()
    showSuccess('User created', `${created.name} has been added successfully`)
    await fetchUsers()
  } catch (err: any) {
    showError('Error', err.message || 'Failed to create user')
  } finally {
    loading.value = false
  }
})

const onEditSubmit = handleEditSubmit(async (values) => {
  // Ensure id_employee is a number
  const userData = {
    name: values.name,
    password: values.password,
    id_employee: parseInt(values.id_employee, 10)
  }
  
  loading.value = true
  
  try {
    const userService = UserService.getInstance()
    const updated = await userService.updateUser(editingUserId.value, userData)
    
    closeEditModal()
    showSuccess('User updated', `${updated.name} has been updated successfully`)
    await fetchUsers()
  } catch (err: any) {
    showError('Error', err.message || 'Failed to update user')
  } finally {
    loading.value = false
  }
})

// Modal methods
const openEditModal = (user) => {
  editingUserId.value = user.id
  setEditValues({
    name: user.name,
    password: '', // Don't prefill password for security
    id_employee: user.id_employee
  })
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  resetEditForm()
  editingUserId.value = 0
}

const openDeleteModal = (user) => {
  deletingUser.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingUser.value = null
}

const confirmDelete = async () => {
  if (!deletingUser.value) return
  
  loading.value = true
  
  try {
    const userService = UserService.getInstance()
    await userService.deleteUser(deletingUser.value.id)
    
    const deletedName = deletingUser.value.name
    closeDeleteModal()
    showSuccess('User deleted', `${deletedName} has been removed successfully`)
    await fetchUsers()
  } catch (err: any) {
    showError('Error', err.message || 'Failed to delete user')
  } finally {
    loading.value = false
  }
}

// Filter methods
const clearFilters = () => {
  searchQuery.value = ''
  filterEmployee.value = ''
}

// Initialize data on mount
onMounted(async () => {
  await Promise.all([
    fetchUsers(),
    fetchEmployees()
  ])
})
</script>

<style scoped>
/* Component-specific styles */
.transition-transform {
  transition: transform 0.2s ease-in-out;
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
  width: 160px;
}

:deep(.table th:nth-child(4)),
:deep(.table td:nth-child(4)) {
  width: 96px;
}

:deep(.table th:nth-child(5)),
:deep(.table td:nth-child(5)) {
  width: 128px;
}
</style>
