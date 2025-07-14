<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-8">
      <div class="flex-1 min-w-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2 truncate">Score Management</h1>
        <p class="text-sm sm:text-base text-muted-foreground">Track daily palomeria points for team members</p>
      </div>
      <div class="flex-shrink-0">
        <Button as="a" href="/" variant="outline" class="w-full sm:w-auto">
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

    <!-- Score Configuration Section -->
    <Card class="mb-8">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Settings class="mr-2 h-5 w-5" />
            <div>
              <CardTitle>Score Configuration</CardTitle>
              <CardDescription>
                Configure the scoring system settings
              </CardDescription>
            </div>
          </div>
          <Button
            @click="toggleConfigSection"
            variant="ghost"
            size="sm"
            class="p-2 transition-transform duration-200 hover:scale-105"
          >
            <ChevronDown v-if="isConfigSectionCollapsed" class="h-4 w-4 transition-transform duration-200" />
            <ChevronUp v-else class="h-4 w-4 transition-transform duration-200" />
          </Button>
        </div>
      </CardHeader>
      <CardContent 
        v-if="!isConfigSectionCollapsed" 
        class="animate-slideDown"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">Maximum Score</label>
            <input
              type="number"
              v-model="maxScoreInput"
              @blur="updateMaxScore"
              min="1"
              max="10"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            />
          </div>
          <div class="flex items-end">
            <div class="text-sm text-muted-foreground">
              Current range: 0 - {{ getMaxScore() }} points
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Create Score Section -->
    <Card class="mb-8">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Plus class="mr-2 h-5 w-5" />
            <div>
              <CardTitle>Add New Score</CardTitle>
              <CardDescription>
                Record palomeria points for a palomo
              </CardDescription>
            </div>
          </div>
          <Button
            @click="toggleAddScoreSection"
            variant="ghost"
            size="sm"
            class="p-2 transition-transform duration-200 hover:scale-105"
          >
            <ChevronDown v-if="isAddScoreSectionCollapsed" class="h-4 w-4 transition-transform duration-200" />
            <ChevronUp v-else class="h-4 w-4 transition-transform duration-200" />
          </Button>
        </div>
      </CardHeader>
      <CardContent 
        v-if="!isAddScoreSectionCollapsed" 
        class="animate-slideDown"
      >
        <form @submit="onCreateSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Palomo
                <span class="text-destructive">*</span>
              </label>
              <Select
                v-model="createEmployeeId"
                v-bind="createEmployeeIdAttrs"
                :options="employeeOptions"
                placeholder="Select a palomo"
                :error="!!createErrors.id_employee"
              />
              <p v-if="createErrors.id_employee" class="text-sm text-destructive">
                {{ createErrors.id_employee }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Score
                <span class="text-destructive">*</span>
              </label>
              <Select
                v-model="createScoreValue"
                v-bind="createScoreValueAttrs"
                :options="scoreOptions"
                placeholder="Select score"
                :error="!!createErrors.score"
              />
              <p v-if="createErrors.score" class="text-sm text-destructive">
                {{ createErrors.score }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Date
                <span class="text-destructive">*</span>
              </label>
              <input
                type="date"
                v-model="createDate"
                v-bind="createDateAttrs"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                :class="{ 'border-destructive': createErrors.date }"
              />
              <p v-if="createErrors.date" class="text-sm text-destructive">
                {{ createErrors.date }}
              </p>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Reason
              <span class="text-destructive">*</span>
            </label>
            <Textarea
              v-model="createReason"
              v-bind="createReasonAttrs"
              placeholder="Describe the reason for this score..."
              :rows="4"
              :maxlength="500"
              :error="!!createErrors.reason"
            />
            <p v-if="createErrors.reason" class="text-sm text-destructive">
              {{ createErrors.reason }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ createReason.length || 0 }}/500 characters
            </p>
          </div>
          <div>
            <Button
              type="submit"
              :disabled="loading"
              class="w-full md:w-auto"
            >
              <Plus class="mr-2 h-4 w-4" />
              {{ loading ? 'Recording...' : 'Record Score' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Scores List -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center">
          <Trophy class="mr-2 h-5 w-5" />
          Score History
        </CardTitle>
        <CardDescription>
          Total Records: {{ scores.length }}
          <span v-if="searchQuery" class="ml-2">
            ({{ filteredScores.length }} filtered)
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
                  placeholder="Search by palomo name or reason..."
                  class="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
            <div class="flex gap-2">
              <Select
                v-model="filterEmployee"
                :options="[{ value: '', label: 'All Palomos' }, ...employeeOptions]"
                placeholder="Filter by palomo"
                class="w-48"
              />
              <input
                v-model="filterDate"
                type="date"
                placeholder="Filter by date"
                class="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button
                v-if="searchQuery || filterEmployee || filterDate"
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
            <span class="text-muted-foreground">Loading scores...</span>
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
            <Button @click="fetchScores" variant="outline">
              <RotateCcw class="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredScores.length === 0 && !searchQuery && !filterEmployee && !filterDate" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Trophy class="h-12 w-12 text-muted-foreground/50" />
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground mb-1">No Scores Found</h3>
            <p class="text-muted-foreground">Start recording palomeria points using the form above.</p>
          </div>
        </div>

        <!-- No Search Results -->
        <div v-else-if="filteredScores.length === 0" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Search class="h-12 w-12 text-muted-foreground/50" />
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground mb-1">No Results Found</h3>
            <p class="text-muted-foreground mb-4">
              No scores match your current filters
            </p>
            <Button @click="clearFilters" variant="outline">
              <X class="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        <!-- Scores Table -->
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-32">Date</TableHead>
                <TableHead class="min-w-48">Palomo</TableHead>
                <TableHead class="w-20 text-center">Score</TableHead>
                <TableHead class="flex-1">Reason</TableHead>
                <TableHead class="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="score in filteredScores" :key="score.id">
                <TableCell class="w-32">
                  <div class="text-sm">
                    <div class="font-medium">{{ formatDate(score.date) }}</div>
                  </div>
                </TableCell>
                <TableCell class="min-w-48">
                  <div class="font-medium">
                    {{ score.employeeName || `Palomo ID: ${score.employeeId}` }}
                  </div>
                </TableCell>
                <TableCell class="w-20 text-center">
                  <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                       :class="getScoreColorClass(score.score)">
                    {{ score.score }}
                  </div>
                </TableCell>
                <TableCell class="flex-1">
                  <Tooltip :content="score.reason">
                    <div class="max-w-md truncate cursor-help">
                      {{ score.reason }}
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell class="w-32">
                  <div class="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="openEditModal(score)"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      @click="openDeleteModal(score)"
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
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <template #title>Edit Score</template>
          <template #description>
            Update the score information below
          </template>
        </DialogHeader>
        <form @submit="onEditSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Palomo
                <span class="text-destructive">*</span>
              </label>
              <Select
                v-model="editEmployeeId"
                v-bind="editEmployeeIdAttrs"
                :options="employeeOptions"
                placeholder="Select a palomo"
                :error="!!editErrors.id_employee"
              />
              <p v-if="editErrors.id_employee" class="text-sm text-destructive">
                {{ editErrors.id_employee }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none">
                Score
                <span class="text-destructive">*</span>
              </label>
              <Select
                v-model="editScoreValue"
                v-bind="editScoreValueAttrs"
                :options="scoreOptions"
                placeholder="Select score"
                :error="!!editErrors.score"
              />
              <p v-if="editErrors.score" class="text-sm text-destructive">
                {{ editErrors.score }}
              </p>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Date
              <span class="text-destructive">*</span>
            </label>
            <input
              type="date"
              v-model="editDate"
              v-bind="editDateAttrs"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              :class="{ 'border-destructive': editErrors.date }"
            />
            <p v-if="editErrors.date" class="text-sm text-destructive">
              {{ editErrors.date }}
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none">
              Reason
              <span class="text-destructive">*</span>
            </label>
            <Textarea
              v-model="editReason"
              v-bind="editReasonAttrs"
              placeholder="Describe the reason for this score..."
              :rows="4"
              :maxlength="500"
              :error="!!editErrors.reason"
            />
            <p v-if="editErrors.reason" class="text-sm text-destructive">
              {{ editErrors.reason }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ editReason.length || 0 }}/500 characters
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
              <Save class="mr-2 h-4 w-4" />
              {{ loading ? 'Updating...' : 'Update Score' }}
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
            Are you sure you want to delete this score? This action cannot be undone.
          </template>
        </DialogHeader>
        <div class="flex items-center p-4 mb-4 text-sm text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800">
          <AlertTriangle class="flex-shrink-0 inline w-4 h-4 mr-3" />
          <span class="sr-only">Warning</span>
          <div>
            <span class="font-medium">Warning!</span> This will permanently delete the score record.
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
            {{ loading ? 'Deleting...' : 'Delete Score' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, Plus, Trophy, Save, Trash2, Edit, Settings,
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
import Select from '~/components/ui/Select.vue'
import Textarea from '~/components/ui/Textarea.vue'
import Tooltip from '~/components/ui/Tooltip.vue'

import type { Score } from '~/types/score'
import type { Employee } from '~/types/employee'

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Composables
const { showSuccess, showError, showInfo, alerts, removeAlert } = useAlert()
const { employees, fetchEmployees } = useEmployees()
const { scores, loading, error, fetchScores, createScore: createScoreAction, updateScore, deleteScore, updateEmployeeNames } = useScores()
const { getMaxScore, setMaxScore, getScoreOptions } = useScoreConfig()

// Score configuration
const maxScoreInput = ref(getMaxScore())

const updateMaxScore = () => {
  if (maxScoreInput.value && maxScoreInput.value > 0) {
    setMaxScore(maxScoreInput.value)
    showInfo('Settings updated', `Maximum score updated to ${maxScoreInput.value}`)
  }
}

// Validation schemas
const createScoreSchema = yup.object({
  id_employee: yup.number().required('Palomo is required'),
  score: yup.number().required('Score is required').min(0).max(getMaxScore()),
  date: yup.string().required('Date is required'),
  reason: yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters').max(500, 'Reason cannot exceed 500 characters')
})

const editScoreSchema = yup.object({
  id_employee: yup.number().required('Palomo is required'),
  score: yup.number().required('Score is required').min(0).max(getMaxScore()),
  date: yup.string().required('Date is required'),
  reason: yup.string().required('Reason is required').min(10, 'Reason must be at least 10 characters').max(500, 'Reason cannot exceed 500 characters')
})

// Create form
const { handleSubmit: handleCreateSubmit, defineField: defineCreateField, errors: createErrors, resetForm: resetCreateForm } = useForm({
  validationSchema: createScoreSchema,
  initialValues: {
    id_employee: null,
    score: null,
    date: new Date().toISOString().slice(0, 10),
    reason: ''
  }
})

const [createEmployeeId, createEmployeeIdAttrs] = defineCreateField('id_employee')
const [createScoreValue, createScoreValueAttrs] = defineCreateField('score')
const [createDate, createDateAttrs] = defineCreateField('date')
const [createReason, createReasonAttrs] = defineCreateField('reason')

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

const [editEmployeeId, editEmployeeIdAttrs] = defineEditField('id_employee')
const [editScoreValue, editScoreValueAttrs] = defineEditField('score')
const [editDate, editDateAttrs] = defineEditField('date')
const [editReason, editReasonAttrs] = defineEditField('reason')

// Modal states
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingScoreId = ref<number>(0)
const deletingScore = ref<Score | null>(null)

// Search and filter state
const searchQuery = ref('')
const filterEmployee = ref('')
const filterDate = ref('')

// Collapsible sections state
const isConfigSectionCollapsed = ref(true)
const isAddScoreSectionCollapsed = ref(true)

// Computed properties
const employeeOptions = computed(() => {
  return employees.value.map(employee => ({
    value: employee.id,
    label: employee.name
  }))
})

const scoreOptions = computed(() => {
  return getScoreOptions()
})

const filteredScores = computed(() => {
  let filtered = [...scores.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(score => 
      score.employeeName?.toLowerCase().includes(query) ||
      score.reason.toLowerCase().includes(query)
    )
  }
  
  // Apply employee filter
  if (filterEmployee.value) {
    filtered = filtered.filter(score => score.employeeId === Number(filterEmployee.value))
  }
  
  // Apply date filter
  if (filterDate.value) {
    filtered = filtered.filter(score => {
      // Helper function to safely convert any date to YYYY-MM-DD format
      const getDateString = (date: any): string => {
        try {
          if (date instanceof Date) {
            return date.toISOString().slice(0, 10)
          } else if (typeof date === 'string') {
            if (date.includes('T')) {
              return date.slice(0, 10)
            } else if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return date
            } else {
              return new Date(date).toISOString().slice(0, 10)
            }
          } else {
            return new Date(date).toISOString().slice(0, 10)
          }
        } catch (error) {
          console.warn('Date conversion error:', error, date)
          return ''
        }
      }
      
      const scoreDateFormatted = getDateString(score.date)
      return scoreDateFormatted === filterDate.value
    })
  }
  
  // Sort by score (highest first), then by date as secondary sort
  filtered.sort((a, b) => {
    // Primary sort: highest score first
    if (b.score !== a.score) {
      return b.score - a.score
    }
    // Secondary sort: newest date first
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  return filtered
})

// Form submission handlers
const onCreateSubmit = handleCreateSubmit(async (values) => {
  try {
    const scoreData = {
      id_employee: Number(values.id_employee),
      score: Number(values.score),
      date: values.date, // Keep as string in YYYY-MM-DD format
      reason: values.reason
    }
    
    const created = await createScoreAction(scoreData)
    
    // Update employee names after creating
    await nextTick()
    updateEmployeeNames(employees.value)
    
    resetCreateForm()
    // Reset date to current date
    createDate.value = new Date().toISOString().slice(0, 10)
    
    showSuccess('Score recorded', `Score of ${created.score} points recorded successfully`)
  } catch (err: any) {
    showError('Error', err.message || 'Failed to record score')
  }
})

const onEditSubmit = handleEditSubmit(async (values) => {
  try {
    const scoreData = {
      id_employee: Number(values.id_employee),
      score: Number(values.score),
      date: values.date, // Keep as string in YYYY-MM-DD format
      reason: values.reason
    }
    
    const updated = await updateScore(editingScoreId.value, scoreData)
    
    // Update employee names after editing
    await nextTick()
    updateEmployeeNames(employees.value)
    
    closeEditModal()
    showSuccess('Score updated', `Score updated successfully`)
  } catch (err: any) {
    showError('Error', err.message || 'Failed to update score')
  }
})

// Modal methods
const openEditModal = (score: Score) => {
  editingScoreId.value = score.id
  setEditValues({
    id_employee: score.employeeId,
    score: score.score,
    date: new Date(score.date).toISOString().slice(0, 10),
    reason: score.reason
  })
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  resetEditForm()
  editingScoreId.value = 0
}

const openDeleteModal = (score: Score) => {
  deletingScore.value = score
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletingScore.value = null
}

const confirmDelete = async () => {
  if (!deletingScore.value) return
  
  try {
    await deleteScore(deletingScore.value.id)
    
    closeDeleteModal()
    showSuccess('Score deleted', 'Score has been removed successfully')
  } catch (err: any) {
    showError('Error', err.message || 'Failed to delete score')
  }
}

// Filter methods
const clearFilters = () => {
  searchQuery.value = ''
  filterEmployee.value = ''
  filterDate.value = ''
}

// Toggle methods for collapsible sections
const toggleConfigSection = () => {
  isConfigSectionCollapsed.value = !isConfigSectionCollapsed.value
}

const toggleAddScoreSection = () => {
  isAddScoreSectionCollapsed.value = !isAddScoreSectionCollapsed.value
}

// Utility methods
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getScoreColorClass = (score: number) => {
  const maxScore = getMaxScore()
  const percentage = (score / maxScore) * 100
  
  if (percentage >= 80) return 'bg-red-500 text-white-800'
  if (percentage >= 60) return 'bg-yellow-700 text-white-800'
  if (percentage >= 40) return 'bg-yellow-600 text-white-800'
  return 'bg-green-600 text-white-800'
}

// Watch to update palomo names when data changes
watch([() => scores.value.length, () => employees.value.length], ([scoresCount, employeesCount]) => {
  if (scoresCount > 0 && employeesCount > 0) {
    nextTick(() => {
      updateEmployeeNames(employees.value)
    })
  }
}, { immediate: true })

// Initialize data on mount
onMounted(async () => {
  try {
    // Load employees first, then scores
    await fetchEmployees()
    await fetchScores()
    
    // Update names after both are loaded
    nextTick(() => {
      updateEmployeeNames(employees.value)
    })
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>