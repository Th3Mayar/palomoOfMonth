<template>
  <ParticlesBg v-if="!showWinner" class="h-full" />
  <!-- <SnakeGame v-if="!showWinner" class="h-full relative" /> -->
  <div :class="['relative', !showWinner ? 'overflow-hidden h-screen' : 'h-full']">
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

// Fetch employees
async function fetchEmployees() {
  const employeeService = EmployeeService.getInstance()
  employees.value = await employeeService.getAllEmployees()
}

// Authentication & Alerts
const { alerts, showSuccess, showError, removeAlert } = useAlert()

onBeforeMount(async () => {
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

  // Check if current date is after the last day of the current month
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  if (now > lastDayOfMonth) {
    showWinner.value = true
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
});

onUnmounted(() => {
  if (confettiInterval) clearInterval(confettiInterval);
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