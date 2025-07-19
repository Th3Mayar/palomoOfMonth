<template>
  <ParticlesBg class="h-full" />
  <div class="overflow-hidden">
    <!-- Alerts -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <Alert v-for="(alert, index) in alerts" :key="alert.id" :alert="alert" :index="index" @remove="removeAlert" />
    </div>

    <div class="min-h-screen bg-bg-dark-background/50 flex items-center justify-center relative z-10">
      <CountdownCard />
    </div>

    <!-- <WinnerTemplate
      v-if="employeeExample"
      :image="employeeExample.image"
      :name="employeeExample.name"
    /> -->
  </div>
</template>

<script setup lang="ts">
import Alert from '~/components/ui/Alert.vue';
import CountdownCard from '~/components/ui/CountdownCard.vue';
import WinnerTemplate from '~/components/ui/WinnerTemplate.vue';
import ParticlesBg from '~/components/ui/ParticlesBg.vue';
import { EmployeeService } from '~/services/employee/employeeService'
import { EmployeeApiResponse } from '~/types/employee';

const employees = ref([])
const employeeExample = ref<EmployeeApiResponse | null>(null)

// Fetch employees
async function fetchEmployees() {
    const employeeService = EmployeeService.getInstance()
    employees.value = await employeeService.getAllEmployees()
}

// Authentication & Alerts
const { user, checkAuth, isLoggedIn } = useAuth()
const { alerts, showSuccess, showError, removeAlert } = useAlert()

onBeforeMount(async () => {
    await checkAuth()
    if (isLoggedIn.value) {
        await fetchEmployees()

        if (employees.value.length) {
            employeeExample.value = employees.value[5]
            // showSuccess('Employees loaded successfully.')
        } else {
            showError('No employees found.')
        }
    } else {
        showError('You must be logged in to view this page.')
    }

    console.log("employeeExample:", employeeExample.value)
})

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