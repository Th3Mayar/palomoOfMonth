<template>
  <ParticlesBg v-if="!winnerStore.showWinner" class="h-full" />
  <!-- <SnakeGame v-if="!winnerStore.showWinner" class="h-full relative" /> -->
  <div :class="['relative', !winnerStore.showWinner ? 'overflow-hidden h-max' : 'h-max']">
    <!-- Alerts -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert v-for="(alert, index) in alerts" :key="alert.id" :alert="alert" :index="index" @remove="removeAlert" />
    </div>

    <div v-if="!winnerStore.showWinner" class="min-h-screen bg-bg-dark-background/50 flex items-center justify-center relative z-10">
      <CountdownCard />
    </div>

    <WinnerTemplate v-if="winnerStore.showWinner && winnerStore.winner" :image="winnerStore.winner.image" :name="winnerStore.winner.name" />
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
import { useWinnerStore } from '~/composables/useWinnerStore'

const winnerStore = useWinnerStore()
const employees = ref([])
let confettiInterval: ReturnType<typeof setInterval> | null = null

// Fetch employees
async function fetchEmployees() {
  const employeeService = EmployeeService.getInstance()
  employees.value = await employeeService.getAllEmployees()
}

// Authentication & Alerts
const { alerts, showSuccess, showError, removeAlert } = useAlert()

watch(() => winnerStore.showWinner, async (val) => {
  if (val) {
    confetti({ particleCount: 500 });
    confettiInterval = setInterval(() => {
      confetti({ particleCount: 500 });
    }, 10000);
    // Fetch winner when showWinner becomes true
    try {
      await fetchEmployees()
      const winnerService = WinnerService.getInstance();
      winnerStore.setWinner(await winnerService.generateCurrentMonthWinner());

      if (employees.value.length) {
        const winnerEmployee = employees.value.find((employee: EmployeeApiResponse) => employee.id === winnerStore.winner?.id_employee);
        if (winnerEmployee) {
          winnerStore.winner.image = winnerEmployee.image;
          winnerStore.winner.name = winnerEmployee.name;
        } else {
          showError('Winner employee not found.');
        }
      } else {
        showError('No employees found.');
      }
    } catch (e) {
      showError('No winner found for this month.');
    }
  } else {
    if (confettiInterval) clearInterval(confettiInterval);
  }
});

onMounted(() => {
  if (winnerStore.showWinner) {
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