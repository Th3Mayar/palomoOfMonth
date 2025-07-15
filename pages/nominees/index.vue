<template>
  <div class="py-4 sm:py-8">
    <!-- Alerts -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert
        v-for="(alert, index) in alerts"
        :key="alert.id"
        :alert="alert"
        :index="index"
        @remove="removeAlert"
      />
    </div>

    <!-- Title and Instructions -->
    <div class="text-center px-4 sm:px-0">
      <p class="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
        Vote for your favorite palomo this month. You can change your vote.
      </p>

      <!-- Voting Period Info -->
      <Card class="mb-8 max-w-2xl mx-auto">
        <CardContent class="p-4 sm:p-6">
          <div class="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-button-secondary/10 rounded-lg mb-3 sm:mb-4 mx-auto">
            <Calendar class="h-5 w-5 sm:h-6 sm:w-6 text-button-secondary" />
          </div>
          <p class="text-sm sm:text-base text-foreground mb-2">
            Voting period: {{ votingPeriod.start }} – {{ votingPeriod.end }}
          </p>
          <p class="text-xs sm:text-sm text-muted-foreground">
            You may vote once per month. Voting again on the same nominee has no effect.
          </p>
        </CardContent>
      </Card>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span class="text-muted-foreground">Loading nominees…</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-12 space-y-4">
        <div class="text-destructive">
          <Users class="h-12 w-12 mx-auto mb-2" />
        </div>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-foreground mb-1">Error loading data</h3>
          <p class="text-muted-foreground mb-4">{{ error }}</p>
          <Button @click="fetchAllData" variant="outline">
            <Calendar class="mr-2 h-4 w-4" />
            Try again
          </Button>
        </div>
      </div>

      <!-- Nominee Grid -->
      <div
        v-if="nomineesWithStats.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto place-content-center"
      >
        <Card
          v-for="nominee in nomineesWithStats"
          :key="nominee.id"
          :class="[
            'hover:shadow-lg transition-shadow h-full cursor-pointer',
            selectedVote?.id === nominee.id ? 'ring-2 ring-green-600 scale-[1.02]' : ''
          ].join(' ')"
          @click="selectVote(nominee)"
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

            <!-- Name -->
            <div class="flex-grow">
              <h3 class="text-lg sm:text-xl font-semibold text-foreground mb-2">{{ nominee.name }}</h3>
            </div>

            <!-- Voting Status -->
            <div class="mt-auto">
              <span v-if="selectedVote?.id === nominee.id" class="text-green-600 font-medium text-sm sm:text-base">
                ✓ Your current vote
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Confirm Vote Button -->
      <div v-if="selectedVote" class="flex justify-center mt-6">
        <Button @click="submitVote(selectedVote)" :disabled="submittingVote">
          {{ submittingVote ? 'Submitting…' : 'Confirm Vote' }}
        </Button>
      </div>

      <!-- No Nominees -->
      <div v-else-if="!loading && !error" class="text-center py-12">
        <Card class="max-w-md mx-auto">
          <CardContent class="p-6 sm:p-8">
            <Users class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p class="text-muted-foreground text-base sm:text-lg">
              No nominees available for this month.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Calendar, User, Users } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Alert from '~/components/ui/Alert.vue'
import { VoteService } from '~/services/vote/voteService'
import { EmployeeService } from '~/services/employee/employeeService'

// Authentication & Alerts
const { user, checkAuth, isLoggedIn } = useAuth()
const { alerts, showSuccess, showError, removeAlert } = useAlert()

// State
const loading = ref(true)
const nominees = ref<any[]>([])
const employees = ref<any[]>([])
const userVote = ref<any | null>(null)
const selectedVote = ref<any | null>(null)
const hasVoted = ref(false)
const error = ref<string | null>(null)
const submittingVote = ref(false)

// Voting period (start to end of current month)
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

// Fetch nominees
async function fetchNominees() {
  const token = useCookie('auth-token').value
  const raw = await $fetch('/api/modules/nominees', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const list = Array.isArray(raw) ? raw : raw?.data || []
  nominees.value = list.map((n: any) => ({
    ...n,
    id: n.id ?? n.id_nominees ?? n.id_nominess,
    id_employee: n.id_employee ?? n.employee_id ?? n.id_employee_fk
  }))
}

// Fetch employees
async function fetchEmployees() {
  const employeeService = EmployeeService.getInstance()
  employees.value = await employeeService.getAllEmployees()
}

// Return nominee objects with employee data
const nomineesWithStats = computed(() => {
  return nominees.value.map(nominee => {
    const emp = employees.value.find(e => e.id === nominee.id_employee)
    return {
      ...nominee,
      name: emp?.name ?? 'Unknown Employee',
      photo: emp?.image ?? null
    }
  })
})

// Load everything
async function fetchAllData() {
  loading.value = true
  error.value = null
  try {
    await Promise.all([fetchNominees(), fetchEmployees()])
    await checkUserVote()
  } catch (err: any) {
    error.value = err.message ?? 'Failed to load data'
    showError('Error', error.value)
  } finally {
    loading.value = false
  }
}

// Get previous vote
async function checkUserVote() {
  if (!isLoggedIn.value || !user.value?.id) return
  try {
    const voteService = VoteService.getInstance()
    const result = await voteService.getUserVote(user.value.id, votingPeriod.value.current)
    userVote.value = result
    hasVoted.value = !!result
    if (result) selectedVote.value = { id: result.id_nominess }
  } catch (err) {
    showError('Error', 'Failed to check your voting status.')
  }
}

// Mark nominee as selected
function selectVote(nominee: any) {
  selectedVote.value = { id: nominee.id, name: nominee.name }
  window.sessionStorage.setItem('palomo-vote', JSON.stringify(selectedVote.value))
}

// Submit vote
async function submitVote(nominee: any) {
  if (!nominee || !user.value?.id_user) return
  const voteData = {
    id_user: user.value.id_user,
    id_nominess: nominee.id,
    date: new Date().toISOString()
  }

  submittingVote.value = true
  try {
    const voteService = VoteService.getInstance()
    await voteService.createVote(voteData)
    userVote.value = voteData
    selectedVote.value = { id: voteData.id_nominess }
    showSuccess('Success', `Vote submitted for ${nominee.name}`)
  } catch (err: any) {
    showError('Error', err.message ?? 'Failed to submit vote.')
  } finally {
    submittingVote.value = false
  }
}

onMounted(async () => {
  try { await checkAuth() } catch {}
  const cached = window.sessionStorage.getItem('palomo-vote')
  if (cached) selectedVote.value = JSON.parse(cached)
  await fetchAllData()
})

watch(() => votingPeriod.value.current.getMonth(), fetchAllData)

/* ------------ page meta ------------ */
definePageMeta({ middleware: 'auth', layout: 'auth-layout' })
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>