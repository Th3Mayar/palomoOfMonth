<template>
  <div class="w-full flex flex-col items-center justify-center gap-4">
    <div class="flex justify-between items-center mb-2 gap-2">
      <p>Theme: <b class="text-buttonSuccess">{{ themeLabel }}</b></p>
      <Button as="button" variant="outline" @click="playAgain" class="ml-auto">
        <RotateCcw class="mr-2 h-4 w-4" /> Retry
      </Button>
    </div>
    <div class="grid grid-cols-4 gap-3">
      <button v-for="(card, idx) in displayCards" :key="idx"
        class="w-20 h-28 text-black rounded-lg shadow flex items-center justify-center text-2xl font-bold cursor-pointer select-none border-2 border-gray-200/50 transition-transform duration-300 relative overflow-hidden"
        :class="{
          'bg-buttonSuccess/50': card.matched,
          'bg-contentButton/60': card.flipped && !card.matched,
          'rotate-y-180': card.flipped
        }" @click="flipCard(idx)"
        :disabled="card.flipped || card.matched || flippedIndices.length === 2 || previewing || timeLeft <= 0">
        <template v-if="theme === 'palomos'">
          <span v-if="card.flipped || card.matched">
            <img v-if="card.image" :src="card.image" alt="palomo"
              class="max-w-full max-h-full w-full h-full object-cover mx-auto block" style="display: block;" />
            <span v-else class="block text-center text-base">{{ card.name }}</span>
          </span>
          <span v-else class="text-contentBackground">?</span>
        </template>
        <template v-else>
          <span v-if="card.flipped || card.matched">{{ card.value }}</span>
          <span v-else class="text-contentBackground">?</span>
        </template>
      </button>
    </div>
    <div v-if="previewing" class="mt-2 text-blue-600 font-semibold">
      Memorize the cards! Flipping in 5 seconds...
    </div>
    <div v-if="!previewing && !won && timeLeft > 0" class="mt-2 text-gray-600 font-semibold">
      Time left: {{ timeLeft }}s
    </div>
    <div v-if="won" class="mt-4 text-green-600 font-bold">
      Congratulations! You found all pairs.<br />
      <span v-if="false"></span>
    </div>
    <Dialog :open="gameOver" @update:open="onDialogOpen">
      <DialogContent class="max-w-xs">
        <DialogHeader>
          <template #title>Game Over</template>
          <template #description>
            <div class="flex flex-col items-center p-5 !justify-start !text-start">
              <p class="flex gap-2 text-xl mb-5">Attempts left: <b>{{ maxAttempts - failedAttempts }}</b></p>
              <p class="flex gap-2 text-base text-red-600 text-center" v-if="failedAttempts >= maxAttempts">You've
                reached the maximum number of failed attempts. Try again.</p>
              <p class="flex gap-2 text-base text-red-600" v-else>Time's up! Try again.</p>
              <span class="text-6xl mt-5">😞</span>
            </div>
          </template>
        </DialogHeader>
        <DialogFooter>
          <Button as="button" variant="success" @click="playAgain">Play Again</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Button from './Button.vue'
import Dialog from './Dialog.vue'
import DialogContent from './DialogContent.vue'
import DialogHeader from './DialogHeader.vue'
import DialogFooter from './DialogFooter.vue'
import { useRoute } from 'vue-router'
import { EmployeeService } from '~/services/employee/employeeService'
import { ArrowLeft, RotateCcw } from 'lucide-vue-next'

const themes: Record<string, string[]> = {
  palomos: [] // Will be filled dynamically
}
const themeLabels: Record<string, string> = {
  palomos: 'Palomos',
}

const route = useRoute()
const theme = computed(() => (route.query.theme as string) || 'palomos')
const themeLabel = computed(() => themeLabels[theme.value] || 'Unknown theme')

// Palomos/employee logic
const employees = ref<any[]>([])
const loadingEmployees = ref(false)
const errorEmployees = ref('')

async function fetchEmployees() {
  loadingEmployees.value = true
  errorEmployees.value = ''
  try {
    const employeeService = EmployeeService.getInstance()
    employees.value = await employeeService.getAllEmployees()
  } catch (err: any) {
    errorEmployees.value = 'Failed to load employees'
  } finally {
    loadingEmployees.value = false
  }
}

const displayCards = ref<any[]>([])
const flippedIndices = ref<number[]>([])
const won = ref(false)
const previewing = ref(false)
const timeLeft = ref(120)
const timer = ref<any>(null)
const maxAttempts = 3
const failedAttempts = ref(0)
const gameOver = ref(false)

function shuffle<T>(arr: T[]): T[] {
  return arr.slice().sort(() => Math.random() - 0.5)
}

function resetAttempts() {
  failedAttempts.value = 0
}

//

//

function onDialogOpen(val: boolean) {
  if (!val && gameOver.value) {
    playAgain()
  }
}

async function setupGame() {
  let base: any[] = []
  if (theme.value === 'palomos') {
    await fetchEmployees()
    base = employees.value.filter(e => e && e.id && e.name)
    while (base.length < 8 && base.length > 0) base = base.concat(base)
    base = base.slice(0, 8)
    const pairValues = shuffle([...base, ...base])
    displayCards.value = pairValues.map(v => ({
      id: v.id,
      name: v.name,
      image: v.image,
      flipped: false,
      matched: false
    }))
  } else {
    base = themes[theme.value] || themes['programming']
    const pairValues = shuffle([...base, ...base])
    displayCards.value = pairValues.map(v => ({ value: v, flipped: false, matched: false }))
  }
  flippedIndices.value = []
  won.value = false
  previewing.value = true
  timeLeft.value = 120
  resetAttempts()
  gameOver.value = false
  // Preview for 5 seconds, then flip all
  setTimeout(() => {
    for (const card of displayCards.value) card.flipped = false
    previewing.value = false
    startTimer()
  }, 5000)
  // Show all cards for preview
  for (const card of displayCards.value) card.flipped = true
}

function startTimer() {
  timer.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer.value)
      timer.value = null
      gameOver.value = true
    }
  }, 1000)
}

function flipCard(idx: number) {
  if (previewing.value || displayCards.value[idx].flipped || displayCards.value[idx].matched || flippedIndices.value.length === 2 || timeLeft.value <= 0 || gameOver.value) return
  displayCards.value[idx].flipped = true
  flippedIndices.value.push(idx)
  if (flippedIndices.value.length === 2) {
    setTimeout(() => {
      const [i1, i2] = flippedIndices.value
      let match = false
      if (theme.value === 'palomos') {
        match = displayCards.value[i1].id === displayCards.value[i2].id
      } else {
        match = displayCards.value[i1].value === displayCards.value[i2].value
      }
      if (match) {
        displayCards.value[i1].matched = true
        displayCards.value[i2].matched = true
      } else {
        displayCards.value[i1].flipped = false
        displayCards.value[i2].flipped = false
        failedAttempts.value++
        if (failedAttempts.value >= maxAttempts) {
          gameOver.value = true
          if (timer.value) clearInterval(timer.value)
        }
      }
      flippedIndices.value = []
      if (displayCards.value.every(c => c.matched)) {
        won.value = true
        if (timer.value) clearInterval(timer.value)
      }
    }, 800)
  }
}

function playAgain() {
  setupGame()
}

watch(theme, setupGame, { immediate: true })
onMounted(() => {
  if (theme.value === 'palomos') fetchEmployees()
})
</script>