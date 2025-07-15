<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 mt-8">
      <div class="flex-1 min-w-0">
      </div>
      <div class="flex-shrink-0">
        <Button as="a"  @click.prevent="navigateTo('/')" variant="outline" class="w-full sm:w-auto">
          <ArrowLeft class="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>

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
        <div v-else class="rounded-md border table-container">
          <div class="table-scroll-wrapper">
            <Table>
              <TableHeader class="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead class="w-32">Date</TableHead>
                  <TableHead class="min-w-48">Palomo</TableHead>
                  <TableHead class="w-20 text-center">Score</TableHead>
                  <TableHead class="flex-1">Reason</TableHead>
                  <TableHead class="w-24 text-center">Actions</TableHead>
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
                  <TableCell class="w-24 text-center">
                    <Button
                      @click="openReasonModal(score)"
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8 p-0"
                    >
                      <Eye class="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Reason Modal -->
    <div
      v-if="isReasonModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="closeReasonModal"
    >
      <div class="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border-t-4"
           :class="getScoreBorderClass(selectedScore?.score)">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-foreground">Score Details</h3>
          <Button
            @click="closeReasonModal"
            variant="ghost"
            size="sm"
            class="h-8 w-8 p-0"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>
        
        <div class="p-6 space-y-4" v-if="selectedScore">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Date</label>
              <p class="text-foreground font-medium">{{ formatDate(selectedScore.date) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Palomo</label>
              <p class="text-foreground font-medium">{{ selectedScore.employeeName || `Palomo ID: ${selectedScore.employeeId}` }}</p>
            </div>
            <div class="flex items-center justify-center gap-2">
              <label class="text-sm font-medium text-muted-foreground">Score</label>
              <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1"
                   :class="getScoreColorClass(selectedScore.score)">
                {{ selectedScore.score }}
              </div>
            </div>
          </div>
          
          <div>
            <label class="text-sm font-medium text-muted-foreground mb-2 block">Reason</label>
            <div class="bg-muted/30 rounded-md p-4 border">
              <pre class="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{{ selectedScore.reason }}</pre>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end p-6 border-t">
          <Button @click="closeReasonModal" variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, Trophy,
  AlertTriangle, RotateCcw, Search, X, Eye
} from 'lucide-vue-next'

// Shadcn UI Components
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import CardDescription from '~/components/ui/CardDescription.vue'
import CardHeader from '~/components/ui/CardHeader.vue'
import CardTitle from '~/components/ui/CardTitle.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import Select from '~/components/ui/Select.vue'
import Tooltip from '~/components/ui/Tooltip.vue'

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Composables
const { employees, fetchEmployees } = useEmployees()
const { scores, loading, error, fetchScores, updateEmployeeNames } = useScores()
const { getMaxScore } = useScoreConfig()

// Search and filter state
const searchQuery = ref('')
const filterEmployee = ref('')
const filterDate = ref('')

// Modal state
const isReasonModalOpen = ref(false)
const selectedScore = ref(null)

// Computed properties
const employeeOptions = computed(() => {
  return employees.value.map(employee => ({
    value: employee.id,
    label: employee.name
  }))
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

// Filter methods
const clearFilters = () => {
  searchQuery.value = ''
  filterEmployee.value = ''
  filterDate.value = ''
}

// Modal methods
const openReasonModal = (score) => {
  selectedScore.value = score
  isReasonModalOpen.value = true
}

const closeReasonModal = () => {
  isReasonModalOpen.value = false
  selectedScore.value = null
}

// Utility methods
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

const getScoreColorClass = (score: number) => {
  const maxScore = getMaxScore()
  const percentage = (score / maxScore) * 100
  
  if (percentage >= 80) return 'bg-red-500 text-white-800'
  if (percentage >= 60) return 'bg-yellow-700 text-white-800'
  if (percentage >= 40) return 'bg-yellow-600 text-white-800'
  return 'bg-green-600 text-white-800'
}

const getScoreBorderClass = (score: number) => {
  if (!score) return 'border-t-gray-300'
  
  const maxScore = getMaxScore()
  const percentage = (score / maxScore) * 100
  
  if (percentage >= 80) return 'border-t-red-500'
  if (percentage >= 60) return 'border-t-yellow-700'
  if (percentage >= 40) return 'border-t-yellow-600'
  return 'border-t-green-600'
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

/* Table container with fixed height and beautiful scroll */
.table-container {
  height: 600px;
  overflow: hidden;
  border-radius: 0.375rem;
  border: 1px solid hsl(var(--border));
}

.table-scroll-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

/* Webkit browsers scrollbar styling */
.table-scroll-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-scroll-wrapper::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.table-scroll-wrapper::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.table-scroll-wrapper::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

.table-scroll-wrapper::-webkit-scrollbar-corner {
  background: transparent;
}

/* Table layout optimizations */
:deep(.table) {
  table-layout: fixed;
  width: 100%;
  min-width: 600px; /* Minimum width to prevent cramping */
}

:deep(.table th:nth-child(1)),
:deep(.table td:nth-child(1)) {
  width: 140px;
}

:deep(.table th:nth-child(2)),
:deep(.table td:nth-child(2)) {
  min-width: 200px;
}

:deep(.table th:nth-child(3)),
:deep(.table td:nth-child(3)) {
  width: 80px;
}

:deep(.table th:nth-child(4)),
:deep(.table td:nth-child(4)) {
  width: auto;
}

:deep(.table th:nth-child(5)),
:deep(.table td:nth-child(5)) {
  width: 140px;
}

/* Sticky header enhancement */
:deep(.table thead th) {
  background-color: hsl(var(--background));
  backdrop-filter: blur(8px);
  border-bottom: 2px solid hsl(var(--border));
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

/* Date input styling */
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23999' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20'><path d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.89-1.99 2L3 20c0 1.1.89 2 2 2h14a2 2 0 0 0 2-2V6c0-1.11-.9-2-2-2zm0 16H5V10h14v10z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem 1rem;
  padding-right: 2.5rem;
  color-scheme: light dark;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0.75rem;
  width: 1rem;
  height: 100%;
  cursor: pointer;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .table-container {
    height: 500px;
  }
  
  :deep(.table) {
    min-width: 500px;
  }
}

@media (max-width: 640px) {
  .table-container {
    height: 400px;
  }
}
</style>