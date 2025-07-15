<template>
  <div class="py-4 sm:py-8">
    <!-- Alerts container -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :alert="alert"
        :index="index"
        @remove="removeAlert"
      />
    </div>

    <div class="text-center px-4 sm:px-0">
      <p class="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
        Vote for your favorite palomo this month
      </p>
      
      <!-- Voting Period Info -->
      <Card class="mb-8 max-w-2xl mx-auto">
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-button-secondary/10 rounded-lg mb-3 sm:mb-4 mx-auto">
            <Calendar class="h-5 w-5 sm:h-6 sm:w-6 text-button-secondary" />
          </div>
          <p class="text-sm sm:text-base text-foreground mb-2">
            Voting period: {{ votingPeriod.start }} - {{ votingPeriod.end }}
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground">
            You can vote once per month. Cast your vote for your favorite palomo!
          </p>
        </CardContent>
      </Card>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span class="text-muted-foreground">Loading nominees...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12 space-y-4">
        <div class="text-destructive">
          <Users class="h-12 w-12 mx-auto mb-2" />
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-foreground mb-1">Error Loading Data</h3>
          <p class="text-muted-foreground mb-4">{{ error }}</p>
          <Button @click="fetchAllData" variant="outline">
            <Calendar class="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>

      <!-- Nominees Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto place-content-center">
        <Card
          v-for="nominee in nomineesWithStats"
          :key="nominee.id"
          class="hover:shadow-lg transition-shadow h-full"
          :class="{
            'ring-1 ring-slate-700': userVote?.id_nominess === nominee.id,
            'opacity-75': hasVoted && userVote?.id_nominess !== nominee.id
          }"
        >
          <CardContent class="p-4 sm:p-6 h-full flex flex-col">
            <!-- Employee Photo -->
            <div class="h-32 sm:h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
              <img
                v-if="nominee.photo"
                :src="nominee.photo"
                :alt="nominee.name"
                class="h-full w-full object-cover rounded-lg"
              />
              <div v-else class="text-muted-foreground">
                <User class="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
            </div>

            <!-- Employee Info -->
            <div class="flex-grow">
              <h3 class="text-lg sm:text-xl font-semibold text-foreground mb-2">{{ nominee.name }}</h3>
            </div>

            <!-- Vote Button -->
            <Button
              v-if="!hasVoted"
              @click="submitVote(nominee)"
              :disabled="submittingVote"
              class="w-full mt-auto text-sm sm:text-base"
              variant="default"
            >
              {{ submittingVote ? 'Voting...' : `Vote for ${nominee.name}` }}
            </Button>
            <div v-else-if="userVote?.id_nominess === nominee.id" class="text-center">
              <span class="text-green-600 font-medium text-sm sm:text-base">✓ You voted for this palomo</span>
              <p class="text-xs sm:text-sm text-muted-foreground mt-1">Voted on: {{ new Date(userVote.date).toLocaleDateString() }}</p>
            </div>
            <Button
              v-else
              disabled
              variant="outline"
              class="w-full mt-auto text-sm sm:text-base cursor-not-allowed opacity-50"
            >
              Already voted
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- No Nominees Message -->
      <div v-if="!loading && !error && nomineesWithStats.length === 0" class="text-center py-12">
        <Card class="max-w-md mx-auto">
          <CardContent class="p-6 sm:p-8">
            <Users class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p class="text-muted-foreground text-base sm:text-lg">No nominees available for this month.</p>
          </CardContent>
        </Card>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Home, Calendar, User, Users } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Alert from '~/components/ui/Alert.vue'

// Services
import { VoteService } from '~/services/vote/voteService'
import { EmployeeService } from '~/services/employee/employeeService'

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})

// Use authentication composable
const { user, checkAuth, isLoggedIn } = useAuth()

// Use alerts composable
const { alerts, showWarning, showSuccess, showError, removeAlert } = useAlert()

// Reactive state
const loading = ref(true)
const nominees = ref([])
const employees = ref([])
const userVote = ref(null)
const hasVoted = ref(false)
const error = ref(null)
const submittingVote = ref(false)

// Voting period calculation
const votingPeriod = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  
  return {
    start: start.toLocaleDateString(),
    end: end.toLocaleDateString(),
    current: now
  }
})

// Computed properties for nominees with employee data
const nomineesWithStats = computed(() => {
  // Ensure nominees is an array before mapping
  if (!Array.isArray(nominees.value)) {
    return []
  }
  
  let filteredNominees = nominees.value
  
  // If user has voted, show only the nominee they voted for
  if (hasVoted.value && userVote.value?.id_nominess) {
    filteredNominees = nominees.value.filter(nominee => nominee.id === userVote.value.id_nominess)
  }
  
  return filteredNominees.map(nominee => {
    // Find the employee data for this nominee
    const employee = employees.value.find(emp => emp.id === nominee.id_employee)
    
    return {
      ...nominee,
      name: employee ? employee.name : 'Unknown Employee',
      photo: employee ? employee.image : null, 
    }
  })
})

// Data fetching functions
const fetchNominees = async () => {
  try {
    const token = useCookie('auth-token').value
    const response = await $fetch('/api/modules/nominees', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    // Handle different response structures
    nominees.value = Array.isArray(response) ? response : (response?.data || [])
  } catch (err) {
    throw new Error('Failed to load nominees')
  }
}

const fetchEmployees = async () => {
  try {
    const employeeService = EmployeeService.getInstance()
    employees.value = await employeeService.getAllEmployees()
  } catch (err) {
    throw new Error('Failed to load employees')
  }
}

// Main data fetching function
const fetchAllData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Fetch all data in parallel
    await Promise.all([
      fetchNominees(),
      fetchEmployees()
    ])
    
    // Check if user has already voted this month
    await checkUserVote()
    
  } catch (err) {
    error.value = err.message || 'Failed to load data'
    showError('Error', error.value)
  } finally {
    loading.value = false
  }
}

// Check if user has voted this month
const checkUserVote = async () => {
  if (!isLoggedIn.value || !user.value?.id) return
  
  try {
    const voteService = VoteService.getInstance()
    userVote.value = await voteService.getUserVote(user.value.id, votingPeriod.value.current)
    
    // If user has voted, set hasVoted to true
    hasVoted.value = !!userVote.value
    
  } catch (err) {
    console.error('Error checking user vote:', err)
    showError('Error', 'Failed to check your voting status.')
  }
}

// Submit vote with server-side validation
const submitVote = async (nominee) => {
  if (!nominee || !user.value?.id_user) return

  const voteData = {
    id_user: user.value.id_user,
    id_nominess: nominee.id_nominees,
    date: new Date().toISOString()
  }

  loading.value = true

  try {
    const voteService = VoteService.getInstance()
    const created = await voteService.createVote(voteData)

    showSuccess('Success', `Vote submitted for ${nominee.name}!`)
    
    // Refresh nominees and user vote after successful submission
    await fetchAllData()
    await checkUserVote()
  } catch (err) {
    showError('Error', error.message || 'Failed to submit vote. Please try again.')
  } finally {
    loading.value = false
    submittingVote.value = false
  }
}

onMounted(async () => {
  // Force check auth first to ensure user data is loaded
  try {
    await checkAuth()
  } catch (error) {
    console.error('Auth check failed:', error)
  }
  
  fetchAllData()
})

// Watch for month changes to reset voting
watch(() => votingPeriod.value.current.getMonth(), () => {
  fetchAllData()
})
</script>

<style scoped>
/* Responsive enhancements */
@media (max-width: 640px) {
  /* Mobile-specific adjustments */
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  /* Tablet-specific adjustments */
  .grid {
    gap: 1.5rem;
  }
}

/* Smooth transitions for responsive elements */
.transition-shadow {
  transition: box-shadow 0.3s ease-in-out;
}

/* Ensure cards maintain proper aspect ratio on mobile */
@media (max-width: 640px) {
  .card-content {
    min-height: 200px;
  }
}

/* Improve button touch targets on mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px;
    padding: 0.75rem 1rem;
  }
}

/* Custom styles for better UX */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>