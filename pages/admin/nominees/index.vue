<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">Nominees Management</h1>
        <p class="text-muted-foreground">Manage employee nominations for Palomo of the Month</p>
      </div>
      <div class="flex gap-3">
        <Button @click="refreshData" variant="outline" :disabled="loading">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </Button>
        <Button @click="openGenerateModal" variant="default">
          <Plus class="mr-2 h-4 w-4" />
          Generate Nominees
        </Button>
      </div>
    </div>

    <!-- Alerts -->
    <div class="fixed top-0 right-0 z-50">
      <Alert
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :alert="alert"
        :index="index"
        @remove="removeAlert"
      />
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle class="flex items-center">
          <Filter class="mr-2 h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Start Date</label>
            <input
              type="date"
              v-model="filters.startDate"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">End Date</label>
            <input
              type="date"
              v-model="filters.endDate"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Employee</label>
            <Select
                v-model="editEmployeeId"
                v-bind="editEmployeeIdAttrs"
                :options="employeeOptions"
                placeholder="Select a palomo"
                :error="!!editErrors.id_employee"
              />
          </div>
          <div class="flex items-end space-x-2">
            <Button @click="applyFilters" class="flex-1">
              <Search class="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button @click="clearFilters" variant="outline">
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <Users class="h-8 w-8 text-blue-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">Total Nominees</p>
              <p class="text-2xl font-bold">{{ nominees.length }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <Clock class="h-8 w-8 text-yellow-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">Pending</p>
              <p class="text-2xl font-bold">{{ pendingCount }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <CheckCircle class="h-8 w-8 text-green-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">Approved</p>
              <p class="text-2xl font-bold">{{ approvedCount }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center">
            <Calendar class="h-8 w-8 text-purple-600" />
            <div class="ml-4">
              <p class="text-sm font-medium text-muted-foreground">This Month</p>
              <p class="text-2xl font-bold">{{ currentMonthCount }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Nominees Table -->
    <Card>
      <CardHeader>
        <CardTitle>Nominees List</CardTitle>
        <CardDescription>
          {{ nominees.length }} nominees found
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="flex items-center justify-center p-8">
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading nominees...</span>
          </div>
        </div>
        
        <div v-else-if="nominees.length === 0" class="text-center p-8">
          <Users class="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 class="text-lg font-medium mb-2">No Nominees Found</h3>
          <p class="text-muted-foreground mb-4">No nominees match your current filters.</p>
          <Button @click="clearFilters">Clear Filters</Button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-4 font-medium">ID</th>
                <th class="text-left p-4 font-medium">Employee</th>
                <th class="text-left p-4 font-medium">Position</th>
                <th class="text-left p-4 font-medium">Nomination Date</th>
                <th class="text-left p-4 font-medium">Status</th>
                <th class="text-left p-4 font-medium">Reason</th>
                <th class="text-left p-4 font-medium">Nominated By</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="nominee in nominees" 
                :key="nominee.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="p-4 font-mono text-sm">{{ nominee.id }}</td>
                <td class="p-4">
                  <div class="font-medium">{{ nominee.employee_name }}</div>
                  <div class="text-sm text-muted-foreground">ID: {{ nominee.id_employee }}</div>
                </td>
                <td class="p-4">{{ nominee.employee_position || 'N/A' }}</td>
                <td class="p-4">{{ formatDate(nominee.nomination_date) }}</td>
                <td class="p-4">
                  <span 
                    :class="getStatusColor(nominee.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ nominee.status }}
                  </span>
                </td>
                <td class="p-4 max-w-xs">
                  <p class="truncate" :title="nominee.reason">{{ nominee.reason }}</p>
                </td>
                <td class="p-4">{{ nominee.nominator_name || 'System' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Generate Nominees Modal -->
    <div v-if="showGenerateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Generate Nominees</CardTitle>
          <CardDescription>
            Create nominees for a specific month
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Month</label>
            <select
              v-model="generateForm.month"
              class="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="">Select month...</option>
              <option v-for="(month, index) in months" :key="index" :value="index + 1">
                {{ month }}
              </option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Maximum Quantity</label>
            <input
              type="number"
              v-model="generateForm.max_quantity"
              min="1"
              max="50"
              placeholder="Enter max nominees to generate"
              class="w-full p-2 border border-input rounded-md bg-background"
            />
          </div>
        </CardContent>
        <div class="flex justify-end space-x-2 p-6 pt-0">
          <Button @click="closeGenerateModal" variant="outline">Cancel</Button>
          <Button @click="generateNominees" :disabled="generateLoading">
            <Plus class="mr-2 h-4 w-4" />
            {{ generateLoading ? 'Generating...' : 'Generate' }}
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Users, Plus, RefreshCw, Filter, Search, X, Clock, 
  CheckCircle, Calendar
} from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import Alert from '~/components/ui/Alert.vue'
import Select from '~/components/ui/Select.vue'

import { useForm } from 'vee-validate'
import * as yup from 'yup'

// Types
import type { Nominee, NomineesFilters, GenerateNomineesResponse } from '~/types/nominees'

const { getMaxScore } = useScoreConfig()

const editScoreSchema = yup.object({
  id_employee: yup.number().required('Palomo is required'),
  score: yup.number().required('Score is required').min(0).max(getMaxScore()),
  date: yup.string().required('Date is required'),
  reason: yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters').max(500, 'Reason cannot exceed 500 characters')
})

// Edit form
const { handleSubmit: handleEditSubmit, defineField: defineEditField, errors: editErrors, resetForm: resetEditForm, setValues: setEditValues } = useForm({
  validationSchema: editScoreSchema,
  initialValues: {
    id_employee: null,
    score: null,
    date: '',
    reason: ''
  }
})
// Composables
const { alerts, showSuccess, showError, removeAlert } = useAlert()
const { employees, fetchEmployees } = useEmployees()
const [editEmployeeId, editEmployeeIdAttrs] = defineEditField('id_employee')

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Reactive state
const loading = ref(false)
const generateLoading = ref(false)
const employeesLoading = ref(false)
const nominees = ref<Nominee[]>([])
const showGenerateModal = ref(false)

// Computed properties
const employeeOptions = computed(() => {
  return employees.value.map(employee => ({
    value: employee.id,
    label: employee.name
  }))
})

// Filters
const filters = ref<NomineesFilters>({
  startDate: '',
  endDate: '',
  idEmployee: undefined
})

// Generate form
const generateForm = ref({
  month: '',
  max_quantity: 5
})

// Month names for the dropdown
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Computed properties
const pendingCount = computed(() => 
  nominees.value.filter(n => n.status === 'pending').length
)

const approvedCount = computed(() => 
  nominees.value.filter(n => n.status === 'approved').length
)

const currentMonthCount = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  
  return nominees.value.filter(n => {
    const nominationDate = new Date(n.nomination_date)
    return nominationDate.getMonth() + 1 === currentMonth && 
           nominationDate.getFullYear() === currentYear
  }).length
})

const fetchNominees = async () => {
  try {
    loading.value = true
    
    // Build query parameters
    const params: string[] = []
    if (filters.value.startDate) params.push(`startDate=${filters.value.startDate}`)
    if (filters.value.endDate) params.push(`endDate=${filters.value.endDate}`)
    if (filters.value.idEmployee) params.push(`idEmployee=${filters.value.idEmployee}`)
    
    const queryString = params.length > 0 ? `?${params.join('&')}` : ''
    const url = `/api/modules/nominees${queryString}`
    
    const response = await $fetch(url)
    nominees.value = (response as any).data || []
    
  } catch (error: any) {
    console.error('Error fetching nominees:', error)
    showError('Error', error?.data?.message || 'Failed to load nominees')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  fetchNominees()
}

const clearFilters = () => {
  filters.value = {
    startDate: '',
    endDate: '',
    idEmployee: undefined
  }
  fetchNominees()
}

const refreshData = () => {
  fetchNominees()
  fetchEmployees()
}

const openGenerateModal = () => {
  showGenerateModal.value = true
  generateForm.value = {
    month: '',
    max_quantity: 5
  }
}

const closeGenerateModal = () => {
  showGenerateModal.value = false
}

const generateNominees = async () => {
  try {
    if (!generateForm.value.month || !generateForm.value.max_quantity) {
      showError('Validation Error', 'Please fill in all required fields')
      return
    }

    generateLoading.value = true
    
    const response = await $fetch('/api/modules/nominees/GenerateNominees', {
      method: 'POST',
      body: {
        month: Number(generateForm.value.month),
        max_quantity: generateForm.value.max_quantity
      }
    })
    
    showSuccess('Success', (response as any).message || 'Nominees generated successfully')
    closeGenerateModal()
    await fetchNominees()
    
  } catch (error: any) {
    console.error('Error generating nominees:', error)
    showError('Error', error?.data?.message || 'Failed to generate nominees')
  } finally {
    generateLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Load data on mount
onMounted(() => {
  fetchNominees()
  fetchEmployees()
})
</script>