<template>
  <div class="container mx-auto px-2 py-6 mt-6 sm:px-4 sm:py-8 sm:mt-10">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div class="flex-1 min-w-0"></div>
      <div class="flex-shrink-0">
        <Button as="button" @click.prevent="navigateTo('/')" variant="outline" class="w-full sm:w-auto">
          <ArrowLeft class="mr-2 h-4 w-4" />
          <span class="hidden sm:inline">Back to Home</span>
          <span class="sm:hidden">Home</span>
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Palomos Card -->
      <Card class="shadow-md flex items-center h-28">
        <div class="flex items-center h-full w-full">
          <div class="flex items-center justify-center h-full w-20">
            <Skull class="w-10 h-10 text-primary" />
          </div>
          <div class="h-16 border-l border-gray-200 mx-4"></div>
          <div class="flex flex-col justify-center flex-1">
            <span class="text-sm text-muted-foreground font-medium">Palomos</span>
            <span class="text-3xl font-bold text-foreground flex items-center min-h-[28px]">
              <span v-if="loading" class="flex items-center justify-center w-full h-full">
                <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></span>
              </span>
              <span v-else>{{ employees.length }}</span>
            </span>
          </div>
        </div>
      </Card>
      <!-- Nominees Card -->
      <Card class="shadow-md flex items-center h-28">
        <div class="flex items-center h-full w-full">
          <div class="flex items-center justify-center h-full w-20">
            <Trophy class="w-10 h-10 text-yellow-500" />
          </div>
          <div class="h-16 border-l border-gray-200 mx-4"></div>
          <div class="flex flex-col justify-center flex-1">
            <span class="text-sm text-muted-foreground font-medium">Nominees</span>
            <span class="text-3xl font-bold text-foreground flex items-center min-h-[28px]">
              <span v-if="loading" class="flex items-center justify-center w-full h-full">
                <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></span>
              </span>
              <span v-else>{{ nominees.length }}</span>
            </span>
          </div>
        </div>
      </Card>
      <!-- Total Palomerias Card -->
      <Card class="shadow-md flex items-center h-28">
        <div class="flex items-center h-full w-full">
          <div class="flex items-center justify-center h-full w-20">
            <Tally5 class="w-10 h-10 text-green-500" />
          </div>
          <div class="h-16 border-l border-gray-200 mx-4"></div>
          <div class="flex flex-col justify-center flex-1">
            <span class="text-sm text-muted-foreground font-medium">Total Palomerias</span>
            <span class="text-3xl font-bold text-foreground flex items-center min-h-[28px]">
              <span v-if="loading" class="flex items-center justify-center w-full h-full">
                <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></span>
              </span>
              <span v-else>{{ scores.length }}</span>
            </span>
          </div>
        </div>
      </Card>
      <!-- Votes of the Month Card -->
      <Card class="shadow-md flex items-center h-28">
        <div class="flex items-center h-full w-full">
          <div class="flex items-center justify-center h-full w-20">
            <Vote class="w-10 h-10 text-blue-500" />
          </div>
          <div class="h-16 border-l border-gray-200 mx-4"></div>
          <div class="flex flex-col justify-center flex-1">
            <span class="text-sm text-muted-foreground font-medium">Votes of the Month</span>
            <span class="text-3xl font-bold text-foreground flex items-center min-h-[28px]">
              <span v-if="loading" class="flex items-center justify-center w-full h-full">
                <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></span>
              </span>
              <span v-else>{{ votesByMonth.length }}</span>
            </span>
          </div>
        </div>
      </Card>
      <!-- Users Card (Admin only) -->
      <Card v-if="isAdmin" class="shadow-md flex items-center h-28">
        <div class="flex items-center h-full w-full">
          <div class="flex items-center justify-center h-full w-20">
            <User2Icon class="w-10 h-10 text-purple-500" />
          </div>
          <div class="h-16 border-l border-gray-200 mx-4"></div>
          <div class="flex flex-col justify-center flex-1">
            <span class="text-sm text-muted-foreground font-medium">Users</span>
            <span class="text-3xl font-bold text-foreground flex items-center min-h-[28px]">
              <span v-if="loading" class="flex items-center justify-center w-full h-full">
                <span class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></span>
              </span>
              <span v-else>{{ users.length }}</span>
            </span>
          </div>
        </div>
      </Card>
    </div>

    <div class="mt-8 mb-8 flex flex-col gap-8 lg:flex-row">
      <section class="w-full">
        <h2 class="text-xl font-semibold mb-4">Nominees Table</h2>
        <div v-if="loading" class="flex items-center justify-center p-8">
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading nominees...</span>
          </div>
        </div>
        <div v-else-if="nominees.length === 0" class="text-center p-8">
          <h3 class="text-lg font-medium mb-2">No Nominees Found</h3>
          <p class="text-muted-foreground mb-4">No nominees available for this period.</p>
        </div>
        <div class="rounded-md border table-container overflow-x-auto">
          <div class="table-scroll-wrapper">
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
                <TableRow v-for="nominee in nominees" :key="nominee.id_nominees || nominee.id">
                  <TableCell class="w-32">
                    <div class="text-sm">
                      <div class="font-medium">{{ formatDate(nominee.date) }}</div>
                    </div>
                  </TableCell>
                  <TableCell class="min-w-48">
                    <div class="font-medium">
                      {{ getEmployeeName(nominee.id_employee) }}
                    </div>
                  </TableCell>
                  <TableCell class="w-20 text-center">
                    <div
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ nominee.total_score }}
                    </div>
                  </TableCell>
                  <TableCell class="w-20 text-center">
                    <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="nominee.votes > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                      {{ nominee.votes }}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
      <section class="w-full">
        <h2 class="text-xl font-semibold mb-4">Scores Table</h2>
        <div v-if="loading" class="flex items-center justify-center p-8">
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span>Loading nominees...</span>
          </div>
        </div>
        <div v-else-if="scores.length === 0" class="text-center p-8">
          <h3 class="text-lg font-medium mb-2">No Scores Found</h3>
          <p class="text-muted-foreground mb-4">No scores available for this period.</p>
        </div>
        <div class="rounded-md border table-container overflow-x-auto">
          <div class="table-scroll-wrapper">
            <Table>
              <TableHeader class="sticky top-0 z-10">
                <TableRow>
                  <TableHead class="w-32">Date</TableHead>
                  <TableHead class="min-w-48">Palomo</TableHead>
                  <TableHead class="w-20 text-center">Score</TableHead>
                  <TableHead class="w-24 text-center">Reason</TableHead>
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
                  <TableCell class="w-24 text-center">
                    <Button @click="openReasonModal(score)" variant="ghost" size="sm" class="h-8 w-8 p-0">
                      <Eye class="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>

    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <h2 class="text-xl font-semibold mb-2">Votes Distribution</h2>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <div v-else>
          <div class="overflow-x-auto"><Bar :data="votesChartData" :options="barChartOptions" /></div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold">Scores by Employee</h2>
          <Select v-model="selectedEmployeeId" :options="employeeOptions" class="w-48" />
        </div>
        <div v-if="loading" class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <div v-else>
          <div class="overflow-x-auto"><Bar :data="scoresChartData" :options="barChartOptions" /></div>
        </div>
      </div>
    </div>
  </div>
  <!-- Reason Modal -->
  <div v-if="isReasonModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    @click.self="closeReasonModal">
    <div class="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border-t-4"
      :class="getScoreBorderClass(selectedScore?.score)">
      <div class="flex items-center justify-between p-6 border-b">
        <h3 class="text-lg font-semibold text-foreground">Score Details</h3>
        <Button @click="closeReasonModal" variant="ghost" size="sm" class="h-8 w-8 p-0">
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
            <p class="text-foreground font-medium">{{ selectedScore.employeeName || `Palomo ID:
              ${selectedScore.employeeId}` }}</p>
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
            <pre
              class="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">{{ selectedScore.reason }}</pre>
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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

import { EmployeeService } from '~/services/employee/employeeService'
import { NomineesService } from '~/services/nominees/nomineesService'
import { ScoreService } from '~/services/score/scoreService'
import { UserService } from '~/services/user/userService'
import { VoteService } from '~/services/vote/voteService'

import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import Select from '~/components/ui/Select.vue'
import Table from '~/components/ui/Table.vue'
import TableHeader from '~/components/ui/TableHeader.vue'
import TableBody from '~/components/ui/TableBody.vue'
import TableRow from '~/components/ui/TableRow.vue'
import TableHead from '~/components/ui/TableHead.vue'
import TableCell from '~/components/ui/TableCell.vue'
import { ArrowLeft, Eye, Skull, SkullIcon, Tally5, Trophy, User2, User2Icon, Vote } from 'lucide-vue-next'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

const loading = ref(false)
const employees = ref([])
const nominees = ref([])
const scores = ref([])
const votesByMonth = ref([])
const users = ref([])

const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')
const selectedScore = ref(null)
const isReasonModalOpen = ref(false)

const { getMaxScore } = useScoreConfig()

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

onMounted(async () => {
  loading.value = true
  try {
    const employeeSvc = EmployeeService.getInstance()
    const nomineesSvc = NomineesService.getInstance()
    const scoreSvc = ScoreService.getInstance()
    const voteSvc = VoteService.getInstance()
    const userSvc = UserService.getInstance()

    employees.value = await employeeSvc.getAllEmployees()

    // Fetch all data for dashboard
    const nomineesResp = await nomineesSvc.getNominees()
    nominees.value = Array.isArray(nomineesResp) ? nomineesResp : (nomineesResp?.data || [])
    scores.value = await scoreSvc.getAllScores()

    scores.value.forEach(score => {
      const employee = employees.value.find(emp => emp.id === score.employeeId)
      if (employee) {
        score.employeeName = employee.name
      } else {
        scores.value = scores.value.filter(s => s.employeeId !== score.employeeId)
      }
    })

    // Get current month and year for votes
    const now = new Date()
    const month = now.getMonth() + 1 // getMonth() is 0-indexed
    const year = now.getFullYear()
    votesByMonth.value = await voteSvc.getVotesByMonthAndYear(month, year)

    if (isAdmin.value) {
      users.value = await userSvc.getAllUsers()
    }
  } finally {
    loading.value = false
  }
})

// Add a ref for the selected employee filter
const selectedEmployeeId = ref('')

// Computed options for the select dropdown
const employeeOptions = computed(() => [
  { value: '', label: 'All Employees' },
  ...employees.value.map(emp => ({ value: emp.id, label: emp.name }))
])

// Filtered scores for the chart
const filteredScores = computed(() => {
  if (!selectedEmployeeId.value) return scores.value
  return scores.value.filter(s => s.employeeId === Number(selectedEmployeeId.value))
})

// Helper function to get employee name by ID
function getEmployeeName(employeeId) {
  const employee = employees.value.find(emp => emp.id === employeeId)
  return employee ? employee.name : `Employee ${employeeId}`
}

// Helper function to format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Groups votes by day and counts how many per date
const votesChartData = computed(() => {
  const grouped = {};
  votesByMonth.value.forEach(v => {
    let dateStr = '';
    if (v.date) {
      dateStr = typeof v.date === 'string' ? v.date.slice(0, 10) : v.date.toISOString().slice(0, 10);
    } else if (v.day && v.month && v.year) {
      dateStr = `${v.year}-${String(v.month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}`;
    }
    if (!grouped[dateStr]) grouped[dateStr] = 0;
    grouped[dateStr] += v.count || 1;
  });
  // Sort dates
  const labels = Object.keys(grouped).sort();
  const data = labels.map(date => grouped[date]);
  return {
    labels,
    datasets: [
      {
        label: 'Votes',
        backgroundColor: '#2563eb',
        data
      }
    ]
  };
});

const scoresChartData = computed(() => ({
  labels: filteredScores.value.map(s => s.employeeName),
  datasets: [
    {
      label: getEmployeeName(filteredScores.value[0]?.employeeId) || 'Score',
      backgroundColor: '#22c55e',
      data: filteredScores.value.map(s => s.score)
    }
  ]
}))

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: 'top' as const }, // Show legends
    title: { display: false },
    tooltip: {
      callbacks: {
        title: (context) => {
          // Show employee name in tooltip title
          return context[0]?.label || ''
        },
        label: (context) => {
          // Show score value
          return `Score: ${context.parsed.y}`
        }
      }
    }
  },
  scales: {
    x: {
      type: "category", // use the literal type instead of string
      grid: { display: false },
      title: { display: true, text: 'Date / Employee' },
    },
    y: {
      type: "linear", // use the literal type instead of string
      grid: { display: true },
      title: { display: true, text: 'Votes / Score' },
      beginAtZero: true
    }
  }
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
  height: 320px;
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
  min-width: 600px;
  /* Minimum width to prevent cramping */
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