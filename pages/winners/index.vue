<template>
  <ParticlesBg v-if="!showWinner" class="h-full" />
  <!-- <SnakeGame v-if="!showWinner" class="h-full relative" /> -->
  <div :class="['relative', !showWinner ? 'overflow-hidden h-max' : 'h-max']">
    <!-- Alerts -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert v-for="(alert, index) in alerts" :key="alert.id" :alert="alert" :index="index" @remove="removeAlert" />
    </div>

    <div v-if="!showWinner" class="min-h-screen bg-bg-dark-background/50 flex items-center justify-center relative z-10">
      <CountdownCard />
    </div>

    <WinnerTemplate v-if="showWinner && winner" :image="winner.image" :name="winner.name" />
  </div>
</template>


<script setup lang="ts">
import Alert from '~/components/ui/Alert.vue';
import CountdownCard from '~/components/ui/CountdownCard.vue';
import WinnerTemplate from '~/components/ui/WinnerTemplate.vue';
import ParticlesBg from '~/components/ui/ParticlesBg.vue';
import { WinnerService } from '~/services/winner/winnerService';
import confetti from 'canvas-confetti';
import { watch, onMounted, onUnmounted } from 'vue';
import { EmployeeService } from '~/services/employee/employeeService'
import { EmployeeApiResponse } from '~/types/employee'
import SnakeGame from '~/components/ui/SnakeGame.vue'

const winner = ref<any>(null)
const employees = ref([])
const showWinner = ref(false)
let confettiInterval: ReturnType<typeof setInterval> | null = null
let interval: any

const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

// Fetch employees
async function fetchEmployees() {
  const employeeService = EmployeeService.getInstance()
  employees.value = await employeeService.getAllEmployees()
}

// Authentication & Alerts
const { alerts, showSuccess, showError, removeAlert } = useAlert()

function getTargetDate() {
  const now = new Date();
  // Define the last day of the month
  let lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  // If the last day is a weekend, move to the previous Friday
  while (lastDay.getDay() === 0 || lastDay.getDay() === 6) {
    lastDay.setDate(lastDay.getDate() - 1);
  }
  // Set the time to 14:30
  lastDay.setHours(14, 30, 0, 0);

  if (now.getDate() === 29) {
    now.setHours(14, 25, 0, 0);
    return now;
  }

  return lastDay;
}

const updateCountdown = () => {
  const now = new Date();
  const targetDate = getTargetDate();
  const diff = targetDate.getTime() - now.getTime();

  countdown.value = {
    days: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
    hours: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
    minutes: Math.max(0, Math.floor((diff / (1000 * 60)) % 60)),
    seconds: Math.max(0, Math.floor((diff / 1000) % 60)),
  };
}

onBeforeMount(async () => {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const isWeekday = lastDayOfMonth.getDay() >= 1 && lastDayOfMonth.getDay() <= 5
  const target = getTargetDate();

  const deadline = new Date(
    lastDayOfMonth.getFullYear(),
    lastDayOfMonth.getMonth(),
    lastDayOfMonth.getDate(),
    14, 30, 0
  )

  if (
    now.toDateString() === lastDayOfMonth.toDateString() &&
    isWeekday &&
    now >= deadline
  ) {
    showWinner.value = true
  }

  // LOGIC TO REMOVE FOR THE FUTURE.
  if (target.getDate() === 29 && target.getHours() === 16) {
    showWinner.value = true;
  }

  if(showWinner.value) {
    try {
      await fetchEmployees()
      const winnerService = WinnerService.getInstance();
      winner.value = await winnerService.generateCurrentMonthWinner();

      if (employees.value.length) {
        const winnerEmployee = employees.value.find((employee: EmployeeApiResponse) => employee.id === winner.value.id_employee);
        if (winnerEmployee) {
          winner.value.image = winnerEmployee.image;
          winner.value.name = winnerEmployee.name;
        } else {
          showError('Winner employee not found.');
        }
      } else {
        showError('No employees found.');
      }
      
    } catch (e) {
      showError('No winner found for this month.');
    }
  }
})

// Confetti effect when winner is shown
watch(showWinner, (val) => {
  if (val) {
    confetti({ particleCount: 500 });
    confettiInterval = setInterval(() => {
      confetti({ particleCount: 500 });
    }, 10000);
  } else {
    if (confettiInterval) clearInterval(confettiInterval);
  }
});

onMounted(() => {
  if (showWinner.value) {
    confetti({ particleCount: 500 });
    confettiInterval = setInterval(() => {
      confetti({ particleCount: 500 });
    }, 10000);
  }

  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
});

onUnmounted(() => {
  if (confettiInterval) clearInterval(confettiInterval);
  clearInterval(interval)
});

// Page configuration
definePageMeta({
  middleware: 'auth',
  layout: 'auth-layout'
})
</script>

<style scoped>
.image-winner {
  width: 320px;
  height: 320px;
  top: 18%;
  left: 42%;
}
</style>