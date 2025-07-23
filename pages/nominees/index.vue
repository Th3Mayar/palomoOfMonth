<template>
  <div class="py-4 sm:py-8">
    <!-- Alerts -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert v-for="(alert, index) in alerts" :key="alert.id" :alert="alert" :index="index" @remove="removeAlert" />
    </div>

    <!-- Countdown Timer -->
    <div class="fixed top-4 right-4 z-40 lg:flex flex-col items-end space-y-2 w-full sm:w-auto hidden">
      <div
        class="bg-primary text-white px-4 py-2 rounded-lg shadow font-semibold text-sm flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
        <div class="flex items-center gap-2 justify-between w-full sm:w-auto">
          <Calendar class="w-4 h-4" />
          <span class="text-xs sm:text-sm flex gap-1 flex-wrap">
            Voting ends in:
            <span>{{ countdown.days }}d</span>
            <span>{{ countdown.hours }}h</span>
            <span>{{ countdown.minutes }}m</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Title and Instructions -->
    <div class="text-center px-2 sm:px-0 mt-10 w-full">
      <div class="flex flex-col sm:flex-row items-center justify-between mb-5 max-w-7xl mx-auto gap-3">
        <div class="w-full sm:w-auto flex flex-col gap-2">
          <p class="text-base sm:text-lg text-muted-foreground">
            Vote for your favorite palomo this month. You can change your vote.
          </p>
          <!-- Responsive Countdown: below Back to Home on mobile, right on desktop -->
          <div class="flex sm:hidden w-full justify-center mt-2">
            <div
              class="bg-primary text-white px-4 py-2 rounded-lg shadow font-semibold text-sm flex items-center gap-2 w-full justify-center">
              <Calendar class="w-4 h-4" />
              <span class="text-xs sm:text-sm flex gap-1 flex-wrap">
                Voting ends in:
                <span>{{ countdown.days }}d</span>
                <span>{{ countdown.hours }}h</span>
                <span>{{ countdown.minutes }}m</span>
              </span>
            </div>
          </div>
        </div>
        <div class="w-full sm:w-auto flex flex-col gap-2">
          <Button as="button" @click.prevent="navigateTo('/')" variant="outline" class="w-full sm:w-auto mt-2 sm:mt-0">
            <ArrowLeft class="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
      <Card class="mb-8 max-w-7xl mx-auto">
        <CardContent class="p-3 grid grid-cols-[auto,1fr] items-center justify-items-center">
          <Calendar class="h-5 w-5 sm:h-6 sm:w-6 text-button-secondary" />
          <div class="flex flex-col items-center">
            <p class="text-sm sm:text-base text-foreground">
              Voting period: {{ votingPeriod.start }} – {{ votingPeriod.end }}
            </p>
            <p class="text-xs sm:text-sm text-muted-foreground">
              You may vote once per month. Voting again on the same nominee has no effect.
            </p>
          </div>
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
      <div v-if="nomineesWithStats.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto place-content-center">
        <Card v-for="nominee in nomineesWithStats" :key="nominee.id" :id="nominee.id" :class="[
          'relative hover:shadow-lg transition-shadow h-full cursor-pointer',
          selectedVote?.id === nominee.id ? 'ring-2 ring-green-600 scale-[1.02]' : ''
        ].join(' ')" @click="selectVote(nominee)">

          <!-- Top badge -->
          <div v-if="nominee.id"
            class="absolute top-3 left-3 z-10 px-2.5 py-1 bg-primary text-white text-[0.75rem] sm:text-sm font-semibold rounded-full flex items-center gap-1 shadow-md ring-2 ring-white/50">
            <Trophy class="w-4 h-4 shrink-0" />
            <span>Top #{{ nominee.index }}</span>
          </div>

          <!-- Confirm Vote Button overlay -->
          <div v-if="selectedVote?.id === nominee.id && (!userVote || userVote.id_nominess !== selectedVote.id)
            && selectedVote.id_employee === nominee.id_employee
          " class="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-20">
            <Button @click.stop="submitVote(selectedVote)" :disabled="submittingVote" class="text-lg px-6 py-3 gap-2">
              <CircleCheck /> {{ submittingVote ? 'Submitting…' : 'Confirm Vote' }}
            </Button>
          </div>

          <CardContent class="p-4 sm:p-6 h-full flex flex-col">
            <!-- Employee Photo -->
            <div class="h-32 sm:h-72 bg-muted rounded-lg flex items-center justify-center mb-4 relative">
              <Skeleton v-if="nomineeImageLoading[nominee.id] !== false && nominee.photo" :customClass="'absolute inset-0'" />
              <img v-if="nominee.photo"
                :src="nominee.photo"
                :alt="nominee.name"
                class="h-full w-full object-cover rounded-lg"
                loading="lazy"
                @load="() => nomineeImageLoading[nominee.id] = false"
                @error="() => nomineeImageLoading[nominee.id] = false"
                :style="nomineeImageLoading[nominee.id] === false ? '' : 'opacity:0;position:absolute;'"
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
            <div class="mt-auto flex flex-col gap-2">
              <span v-if="userVote && userVote.id_nominess === nominee.id"
                class="text-green-600 font-medium text-sm sm:text-base">
                ✓ Your current vote
              </span>
              <Button
                variant="outline"
                size="sm"
                @click.stop="openScoreModal(nominee)"
                :class="(selectedVote?.id === nominee.id
                  && (!userVote || userVote.id_nominess !== selectedVote.id)
                  && selectedVote.id_employee === nominee.id_employee)
                  ? 'z-50'
                  : 'z-0'"
              >
                View Palomerías
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- No Nominees -->
      <div v-else-if="!loading && !error && !nomineesWithStats.length" class="text-center py-12">
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

    <!-- Score Modal -->
    <div v-if="isScoreModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="isScoreModalOpen = false">
      <div
        class="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto border-t-4 border-primary">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-foreground">Score history for {{ selectedNomineeName }}</h3>
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="isScoreModalOpen = false">
            <X class="h-4 w-4" />
          </Button>
        </div>
        <div class="p-6 space-y-4">
          <ul v-if="selectedNomineeScores.length">
            <li v-for="(item, idx) in selectedNomineeScores" :key="idx" class="border-b pb-2 mb-2">
              <p class="text-sm text-muted-foreground mb-1 flex gap-1">{{ formatDate(item.date) }} <strong class="flex">
                  <ArrowBigRightDash class="-mt-[2px]" /> ({{ item.score
                  }})
                </strong></p>
              <p class="text-foreground text-sm whitespace-pre-wrap">{{ item.reason }}</p>
            </li>
          </ul>
          <p v-else class="text-muted-foreground text-sm">No records found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { Calendar, User, Users, X, ArrowBigRightDash, Trophy, ArrowLeft, CircleCheck } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import CardContent from '~/components/ui/CardContent.vue'
import Alert from '~/components/ui/Alert.vue'
import Skeleton from '~/components/ui/Skeleton.vue'
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
// Track image loading state for each nominee
const nomineeImageLoading = ref<Record<string, boolean>>({})

// Modal state
const isScoreModalOpen = ref(false)
const selectedNomineeScores = ref<any[]>([])
const selectedNomineeName = ref('')

const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let countdownInterval: number | undefined

// Voting period (start to last business day of current month at 14:30)
const votingPeriod = computed(() => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  // Get last business day of month
  let lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
    lastDay.setDate(lastDay.getDate() - 1)
  }
  lastDay.setHours(14, 30, 0, 0)
  return {
    start: start.toLocaleDateString(),
    end: lastDay.toLocaleDateString(),
    endRaw: lastDay,
    current: now
  }
})

function updateCountdown() {
  const now = new Date()
  const end = votingPeriod.value.endRaw
  const diffMs = end.getTime() - now.getTime()
  if (diffMs <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
  const hours = Math.max(0, Math.floor((diffMs / (1000 * 60 * 60)) % 24))
  const minutes = Math.max(0, Math.floor((diffMs / (1000 * 60)) % 60))
  const seconds = Math.max(0, Math.floor((diffMs / 1000) % 60))
  countdown.value = { days, hours, minutes, seconds }
}

// Fetch nominees
async function fetchNominees() {
  const token = useCookie('auth-token').value
  const raw = await $fetch('/api/modules/nominees', { headers: { Authorization: `Bearer ${token}` } })
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

// Nominee + employee data
const nomineesWithStats = computed(() => {
  return nominees.value.map(nom => {
    nom.index = nominees.value.findIndex(n => n.id === nom.id) + 1
    const emp = employees.value.find(e => e.id === nom.id_employee)
    return { ...nom, name: emp?.name ?? 'Unknown Employee', photo: emp?.image ?? null }
  })
})

// Fetch all
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

// Previous vote
async function checkUserVote() {
  if (!isLoggedIn.value || !user.value?.id_user) return
  try {
    const voteService = VoteService.getInstance()

    const month = votingPeriod.value.current.getMonth() + 1
    const year = votingPeriod.value.current.getFullYear()
    const votes = await voteService.getVotesByMonthAndYear(month, year)

    // Find the user's vote
    const userVoteRecord = votes.find(v => v.id_user === user.value.id_user)
    userVote.value = userVoteRecord || null
    hasVoted.value = !!userVoteRecord

    if (userVoteRecord && userVoteRecord.id_nominess) {
      // Search for the nominee in the nominees list
      const votedNominee = nominees.value.find(n => n.id === userVoteRecord.id_nominess || n.id_nominees === userVoteRecord.id_nominess)
      if (votedNominee) {
        selectedVote.value = {
          id: votedNominee.id,
          name: votedNominee.name,
          id_employee: votedNominee.id_employee
        }
      } else {
        selectedVote.value = null
      }
    } else {
      selectedVote.value = null
    }
  } catch (err) {
    showError('Error', 'Failed to check your voting status.')
  }
}

function selectVote(nominee: any) {
  selectedVote.value = { id: nominee.id, name: nominee.name, id_employee: nominee.id_employee }
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
    showSuccess('Success', `Vote submitted for ${nominee.name}!`)
    userVote.value = voteData
    hasVoted.value = true

    selectedVote.value = {
      id: nominee.id,
      name: nominee.name,
      id_employee: nominee.id_employee
    }

    await fetchAllData()
  } catch (err: any) {
    const message = err?.message?.replace(/^Error:\s*/i, '').trim() || 'Failed to submit vote.'
    showError('Error', message)
  } finally {
    submittingVote.value = false
  }
}

async function openScoreModal(nominee: any) {
  try {
    let idEmployee = nominee?.id_employee
    selectedNomineeName.value = nominee.name
    if (!idEmployee) {
      showError('Missing data', 'Could not find employee for this nominee.')
      return
    }
    const token = useCookie('auth-token').value
    const allScores = await $fetch<any>('/api/modules/scores', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const scoresList = Array.isArray((allScores as any)?.data) ? (allScores as any).data : allScores
    const filteredScores = scoresList.filter((score: any) => score.id_employee === idEmployee)
    selectedNomineeScores.value = filteredScores
    isScoreModalOpen.value = true
  } catch (err: any) {
    showError('Error loading scores', err.message)
  }
}

// Format date
const formatDate = (date: string) => new Date(date).toLocaleDateString()

// Init
onMounted(async () => {
  try { await checkAuth() } catch { }
  await fetchAllData();
  updateCountdown();
  countdownInterval = window.setInterval(updateCountdown, 1000);
});


onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})
</script>