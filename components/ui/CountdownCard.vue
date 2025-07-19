<template>
  <div class="w-full max-w-md mx-auto rounded-3xl shadow-xl p-6 flex flex-col items-center space-y-6 !z-50">
    <h2 class="text-2xl font-semibold text-background text-center select-none">
      The winner comes out in
    </h2>
    <div class="flex justify-center gap-4 w-full select-none">
      <TimeBlock label="Days" :value="countdown.days" />
      <TimeBlock label="Hours" :value="countdown.hours" />
      <TimeBlock label="Minutes" :value="countdown.minutes" />
      <TimeBlock label="Seconds" :value="countdown.seconds" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TimeBlock from './TimeBlock.vue'

const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

const targetDate = new Date('2025-08-01T00:00:00')

const updateCountdown = () => {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  countdown.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

let interval: any

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>