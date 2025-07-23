<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
     <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-8">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2 truncate">Nominees Management</h1>
        <p class="text-sm sm:text-base text-muted-foreground">Manage employee nominations for Palomo of the Month</p>
      </div>
      <div class="flex gap-3">
        <Button @click="refreshData" variant="outline" :disabled="loading">
          <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </Button>
        <Button @click="openGenerateModal" variant="default" class="w-full sm:w-auto">
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
                v-model="filters.idEmployee"
                :options="employeeOptions"
                placeholder="Select a palomo"
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

        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-32">Date</TableHead>
                <TableHead class="min-w-48">Palomo</TableHead>
                <TableHead class="w-20 text-center">Score</TableHead>
                <TableHead class="w-20 text-center">Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="nominee in nominees" :key="(nominee as any).id_nominees">
                <TableCell class="w-32">
                  <div class="text-sm">
                    <div class="font-medium">{{ formatDate((nominee as any).date) }}</div>
                  </div>
                </TableCell>
                <TableCell class="min-w-48">
                  <div class="font-medium">
                    {{ getEmployeeName((nominee as any).id_employee) }}
                  </div>
                </TableCell>
                <TableCell class="w-20 text-center">
                  <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ (nominee as any).total_score }}
                  </div>
                </TableCell>
                <TableCell class="w-20 text-center">
                  <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                       :class="(nominee as any).votes > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                    {{ (nominee as any).votes }}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
            <Select
              v-model="generateForm.month"
              :options="monthOptions"
              placeholder="Select month..."
            />
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
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'

// Types
import type { Nominee, NomineesFilters, GenerateNomineesResponse } from '~/types/nominees'
import { NumberFieldDecrementProps } from 'radix-vue'

// Composables
const { alerts, showSuccess, showError, removeAlert } = useAlert()
const { employees, fetchEmployees } = useEmployees()

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Reactive state
const loading = ref(false)
const generateLoading = ref(false)
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

// Month options for Select component
const monthOptions = computed(() => {
  return months.map((month, index) => ({
    value: index + 1,
    label: month
  }))
})

// Computed properties
const pendingCount = computed(() => {
  // Since the new data doesn't have status, count nominees with votes = 0
  return nominees.value.filter((n: any) => n.votes === 0).length
})

const approvedCount = computed(() => {
  // Count nominees with votes > 0
  return nominees.value.filter((n: any) => n.votes > 0).length
})

const currentMonthCount = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  
  return nominees.value.filter((n: any) => {
    const nominationDate = new Date(n.date)
    return nominationDate.getMonth() + 1 === currentMonth && 
           nominationDate.getFullYear() === currentYear
  }).length
})

// Helper function to get employee name by ID
const getEmployeeName = (employeeId: number) => {
  const employee = employees.value.find(emp => emp.id === employeeId)
  return employee ? employee.name : `Employee ${employeeId}`
}

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
  // Set default month to current month (1-based, number type)
  const now = new Date()
  generateForm.value = {
    month: now.getMonth() + 1 as any,
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

// Load data on mount
onMounted(() => {
  fetchNominees()
  fetchEmployees()
})
</script>